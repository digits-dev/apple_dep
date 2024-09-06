<?php

namespace App\Http\Controllers\EnrollmentList;
use App\Helpers\CommonHelpers;
use App\Exports\EnrollmentListExport;
use App\Http\Controllers\Controller;
use App\Models\DepCompany;
use App\Models\DepStatus;
use App\Models\EnrollmentHistory;
use App\Models\EnrollmentList;
use App\Models\EnrollmentStatus;
use App\Models\Order;
use App\Models\TransactionLog;
use App\Models\TransactionStatusJsonRequest;
use App\Models\TransactionStatusJsonResponse;
use App\Models\OrderLines;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\AppleDeviceEnrollmentService;


class EnrollmentListController extends Controller
{

    protected $appleService;
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(AppleDeviceEnrollmentService $appleService){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
        $this->appleService = $appleService;
    }

    
    public function getAllData()
    {
        $query = EnrollmentList::query()->with([
            'dStatus:id,dep_status,color', 
            'eStatus:id,enrollment_status,color', 
            'createdBy:id,name', 
            'updatedBy:id,name', 
            'returnedBy:id,name',
            'depCompany:id,dep_company_name as name',
        ]);

        $filter = $query->searchAndFilter(request());

        $result = $filter->sort([
            'sortBy' => $this->sortBy,
            'sortDir' => $this->sortDir,
        ]);

        return $result;
    }
    
    public function export(Request $request)
    {

        $filename = "Enrollment List - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new EnrollmentListExport($data), $filename . '.xlsx');
    }

    public function getIndex(Request $request)
    {
        $data = [];

        $data['enrollmentLists'] = self::getAllData()->paginate($this->perPage)->withQueryString();

        $data['enrollmentStatuses'] = EnrollmentStatus::select('id', 'enrollment_status as name')->get();
        $data['depStatuses'] = DepStatus::select('id', 'dep_status as name')->get();
        $data['users'] = User::select('id as value', 'name as label')->get();
        $data['depCompanies'] = DepCompany::select('id as value', 'dep_company_name as label')->get();
        $data['queryParams'] = request()->query();

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        return Inertia::render('EnrollmentList/EnrollmentList', $data);

    }

    public function EnrollmentListDetails(EnrollmentList $enrollmentList)
    {
        $data = [];

        $data['enrollmentList'] = $enrollmentList->load(['dStatus', 'eStatus']);
       

        return Inertia::render('EnrollmentList/EnrollmentListDetails', $data);
    }

    public function checkTransactionStatus($transactionId)
    {
        
        $requestData = [
            'requestContext' => [
                'shipTo' => config('services.apple_api.ship_to'),
                'timeZone' => config('services.apple_api.timeZone'),
                'langCode' => config('services.apple_api.langCode')
            ],
            'depResellerId' => config('services.apple_api.depResellerId'),
            'deviceEnrollmentTransactionId' => $transactionId
        ];

        $orderLines = EnrollmentList::where('transaction_id', $transactionId)->get();

        $orderLinesId = $orderLines->pluck('order_lines_id')->toArray();

        $transactionLog = TransactionLog::where('dep_transaction_id', $transactionId)->first();

        $orderId = $transactionLog->order_id;
        $orderType = $transactionLog->order_type;

        try {
            
            $response = $this->appleService->checkTransactionStatus($requestData);

            if (isset($response['statusCode'])) {

                if ($response['statusCode'] == 'COMPLETE') {

                    switch($orderType){
                        case 'OR':
                           $enrollmentStatus = EnrollmentStatus::ENROLLMENT_SUCCESS['id'];
                           self::processEnroll($orderId, $orderLines, $transactionId, $enrollmentStatus);

                        break;

                        case 'RE':
                            $enrollmentStatus = EnrollmentStatus::RETURNED['id'];
                            self::processReturn($orderLines, $transactionId, $enrollmentStatus);

                        break;

                        case 'OV':
                           $enrollmentStatus = EnrollmentStatus::OVERRIDE['id'];
                           self::processOverride($orderId, $orderLines, $transactionId, $enrollmentStatus);

                        break;

                        case 'VD':
                           $enrollmentStatus = EnrollmentStatus::VOIDED['id'];
                           self::processVoid($orderId, $transactionId, $enrollmentStatus);

                        break;

                        default:
                            return;
                    }

                } else if (self::checkForErrors($response)){
                    switch($orderType){
                        case 'OR':
                           $enrollmentStatus = EnrollmentStatus::ENROLLMENT_ERROR['id'];
                        break;

                        case 'RE':
                            $enrollmentStatus = EnrollmentStatus::RETURN_ERROR['id'];
                        break;

                        case 'OV':
                           $enrollmentStatus = EnrollmentStatus::OVERRIDE_ERROR['id'];
                        break;

                        case 'VD':
                            $enrollmentStatus = EnrollmentStatus::VOID_ERROR['id'];
                        break;

                        default:
                        return;
                    }

                    OrderLines::whereIn('id', $orderLinesId)->update(['enrollment_status_id' => $enrollmentStatus]);
                    EnrollmentList::where('transaction_id', $transactionId)->update(['enrollment_status' => $enrollmentStatus]);

                    // Update order enrollment status 
                    $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

                    $orderLinesWithCurrStatus = OrderLines::where('order_id', $orderId)
                        ->where('enrollment_status_id', $enrollmentStatus)
                        ->count();


                    if ($orderLinesWithCurrStatus === $totalOrderLines) {
                        Order::where('id', $orderId)->update([
                            'enrollment_status' => $enrollmentStatus,
                            'dep_order' => 1,
                        ]);
                    }

                } else {
                    $validDeviceIds = [];
                    $invalidDeviceIds = [];
            
                    if (isset($response['orders'][0]['deliveries'][0]['devices'])) {
                        foreach ($response['orders'][0]['deliveries'][0]['devices'] as $device) {
                            if ($device['devicePostStatus'] == 'COMPLETE') {
                                $validDeviceIds[] = $device['deviceId'];
                            } else {
                                $invalidDeviceIds[] = $device['deviceId'];
                            }
                        }
                    }
            
                    if (!empty($validDeviceIds)) {
                        OrderLines::whereIn('serial_number', $validDeviceIds)->update(['enrollment_status_id' => 3]);
                        EnrollmentList::whereIn('serial_number', $validDeviceIds)->update(['enrollment_status' => 3]);
                    }
            
                    if (!empty($invalidDeviceIds)) {
                        OrderLines::whereIn('serial_number', $invalidDeviceIds)->update(['enrollment_status_id' => 2]);
                        EnrollmentList::whereIn('serial_number', $invalidDeviceIds)->update(['enrollment_status' => 2]);
                    }

                     // Update order enrollment status to success if all lines are enrolled successfully
                    $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

                    $enrollmentStatusSuccess = OrderLines::where('order_id', $orderId)
                        ->where('enrollment_status_id', EnrollmentStatus::ENROLLMENT_SUCCESS['id'])
                        ->count();

                    $orderUpdateData = [];

                    if ($enrollmentStatusSuccess === $totalOrderLines) {
                        $orderUpdateData = [
                            'enrollment_status' => EnrollmentStatus::ENROLLMENT_SUCCESS['id'],
                            'dep_order' => 1,
                        ];
                    } elseif ($enrollmentStatusSuccess > 0) {
                        $orderUpdateData = [
                            'enrollment_status' => EnrollmentStatus::PARTIALLY_ENROLLED['id'],
                            'dep_order' => 1,
                        ];
                    }
                
                    if (!empty($orderUpdateData)) {
                        Order::where('id', $orderId)->update($orderUpdateData);
                    }
                }
            }
            
            $encodedRequestData = json_encode($requestData);
            $encodedResponseData = json_encode($response);
      
            TransactionStatusJsonRequest::updateOrInsert(['transaction_id' => $transactionId],['data' => $encodedRequestData , 'created_at' => date('Y-m-d H:i:s')]);
            TransactionStatusJsonResponse::updateOrInsert(['transaction_id' => $transactionId],['data' => $encodedResponseData , 'created_at' => date('Y-m-d H:i:s')]);

            $data = [];

            $data['TransactionJsonResponse'] = TransactionStatusJsonResponse::where('transaction_id', $transactionId)->first();
            $data['TransactionJsonRequest'] = TransactionStatusJsonRequest::where('transaction_id', $transactionId)->first();
         
            return json_encode(["message"=>response()->json($response), "jsonresponse" => $data['TransactionJsonResponse'] , "jsonrequest"=>$data['TransactionJsonRequest'] ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    

    public function updateEnrollmentStatus() 
    {
        $onGoing = EnrollmentList::where('enrollment_status', 13)->get();
        foreach ($onGoing as $enrollment) {
            $requestData = [
                'requestContext' => [
                    'shipTo' => config('services.apple_api.ship_to'),
                    'timeZone' => config('services.apple_api.timeZone'),
                    'langCode' => config('services.apple_api.langCode')
                ],
                'depResellerId' => config('services.apple_api.depResellerId'),
                'deviceEnrollmentTransactionId' => $enrollment->transaction_id
            ];
    
            $orderLinesId = EnrollmentList::where('transaction_id', $enrollment->transaction_id)
            ->pluck('order_lines_id')
            ->toArray();
        
            try {
                $response = $this->appleService->checkTransactionStatus($requestData);
                if (isset($response['statusCode'])) {  
                    if ($response['statusCode'] == 'COMPLETE') {
                        OrderLines::whereIn('id', $orderLinesId)->update(['enrollment_status_id' => 3]);
                        EnrollmentList::where('transaction_id', $enrollment->transaction_id)->update(['enrollment_status' => 3]);
                    }
                }
                
            } catch (\Exception $e) {
                return response()->json(['error' => $e->getMessage()], 500);
            }
        }
    }

    public function checkForErrors($response)
    {
        // If the status code is present and indicates an error
        if (isset($response['statusCode']) && $response['statusCode'] === 'ERROR') {
            return true;
        }


        // Check for errors in checkTransactionErrorResponse
        if (isset($response['checkTransactionErrorResponse'])) {
            foreach ($response['checkTransactionErrorResponse'] as $error) {
                if (isset($error['errorCode']) && strpos($error['errorCode'], 'DEP-ERR') !== false) {
                    return true;
                }
            }
        }


        // Check for errors in orders, deliveries, and devices
        // if (isset($response['orders'])) {
        //     foreach ($response['orders'] as $order) {
        //         if (isset($order['orderPostStatus']) && strpos($order['orderPostStatus'], 'DEP-ERR') !== false) {
        //             return true;
        //         }

        //         if (isset($order['deliveries'])) {
        //             foreach ($order['deliveries'] as $delivery) {
        //                 if (isset($delivery['deliveryPostStatus']) && strpos($delivery['deliveryPostStatus'], 'DEP-ERR') !== false) {
        //                     return true;
        //                 }

        //                 if (isset($delivery['devices'])) {
        //                     foreach ($delivery['devices'] as $device) {
        //                         if (isset($device['devicePostStatus']) && strpos($device['devicePostStatus'], 'DEP-ERR') !== false) {
        //                             return true;
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
 

        // If no errors were found, return false
        return false;
    }

    private function processVoid($orderId, $transactionId, $enrollmentStatus){

        DB::beginTransaction();

        try{

            $orderHeader = Order::where('id', $orderId)->first();
            $orderHeader->update(['enrollment_status' => $enrollmentStatus]);


            $enrollmentIds = OrderLines::where('order_id', $orderId)
                                    ->whereIn('enrollment_status_id', [3, 5, 6, 10, 13])
                                    ->pluck('id')->toArray();


            $enrolledDevices = OrderLines::whereIn('list_of_order_lines.id', $enrollmentIds)
                    ->leftJoin('enrollment_lists', 'list_of_order_lines.id', 'enrollment_lists.order_lines_id')
                    ->leftJoin('orders', 'list_of_order_lines.order_id', 'orders.id')
                    ->whereIn('enrollment_lists.dep_status', [1, 2])
                    ->select([
                    'orders.id as order_id', 
                    'list_of_order_lines.id as line_id', 
                    'list_of_order_lines.*', 
                    'enrollment_lists.*', 
                    'orders.*', ])
                    ->get();


            foreach ($enrolledDevices as $deviceData) {

                $enrollment = EnrollmentList::query()
                ->where('sales_order_no', $orderHeader->sales_order_no)
                ->where('serial_number', $deviceData->serial_number)
                ->first();

                if($enrollment){
                    $enrollment->update([
                        'transaction_id' => $transactionId,
                        'dep_status' => 1,
                        'enrollment_status' => $enrollmentStatus,
                        'status_message' => 'Transaction posted successfully in DEP',
                    ]);
                }

                EnrollmentHistory::create([ 
                    'order_lines_id' => $deviceData->id,
                    'dep_company_id' => $deviceData->dep_company_id,
                    'sales_order_no' => $orderHeader->sales_order_no,
                    'item_code' => $deviceData->digits_code,
                    'serial_number' => $deviceData->serial_number,
                    'transaction_id' => $transactionId,
                    'dep_status' => 1,
                    'enrollment_status' => $enrollmentStatus,
                    'status_message' => 'Transaction posted successfully in DEP',
                ]);
            }

            //Insert other lines that are not enrolled in Enrollment History
            
            $enrolledIds = $enrolledDevices->pluck('line_id');

            $orderLines = OrderLines::where('order_id', $orderId)->get();

            OrderLines::whereIn('id', $orderLines->pluck('id'))->update(['enrollment_status_id' => $enrollmentStatus]);

            $otherLines = $orderLines->filter(function($orderLine) use ($enrolledIds) {
                return !$enrolledIds->contains($orderLine->id);
            });

            foreach ($otherLines as $orderLine) {

                EnrollmentHistory::create([ 
                    'order_lines_id' => $orderLine->id,
                    'dep_company_id' => $orderLine->dep_company_id,
                    'sales_order_no' => $orderHeader->sales_order_no,
                    'item_code' => $orderLine->digits_code,
                    'serial_number' => $orderLine->serial_number,
                    'dep_status' => 0,
                    'enrollment_status' => $enrollmentStatus,
                ]);
            }

            DB::commit();

        } catch (\Exception $e) {
            // Rollback the transaction if something went wrong
            DB::rollBack();
        
            // Optionally, log the error message or handle it as needed
            Log::error($e->getMessage());
            throw $e;
        }
    }

    private function processEnroll($orderId, $orderLines, $transactionId, $enrollmentStatus){

        DB::beginTransaction();

        try {
            $orderLinesId = $orderLines->pluck('order_lines_id')->toArray();
        
            OrderLines::whereIn('id', $orderLinesId)->update(['enrollment_status_id' => $enrollmentStatus]);
            EnrollmentList::where('transaction_id', $transactionId)->update(['enrollment_status' => $enrollmentStatus]);

            // Prepare data for EnrollmentHistory
            $enrollmentHistoryData = [];

            foreach($orderLines as $orderLine) {
                $enrollmentHistoryData[] = [ 
                    'order_lines_id'    => $orderLine->id,
                    'dep_company_id'    => $orderLine->dep_company_id,
                    'sales_order_no'    => $orderLine->sales_order_no,
                    'item_code'         => $orderLine->item_code,
                    'serial_number'     => $orderLine->serial_number,
                    'transaction_id'    => $orderLine->transaction_id,
                    'dep_status'        => $orderLine->dep_status,
                    'enrollment_status' => $enrollmentStatus,
                    'status_message'    => $orderLine->status_message,
                    'created_by'        => auth()->user()->id,
                    'created_at'        => date('Y-m-d H:i:s')
                ];
            }

            EnrollmentHistory::insert($enrollmentHistoryData);

            // Update order enrollment status to success if all lines are enrolled successfully
            $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

            $enrollmentStatusSuccess = OrderLines::where('order_id', $orderId)
                ->where('enrollment_status_id', EnrollmentStatus::ENROLLMENT_SUCCESS['id'])
                ->count();

            $orderUpdateData = [];

            if ($enrollmentStatusSuccess === $totalOrderLines) {
                $orderUpdateData = [
                    'enrollment_status' => EnrollmentStatus::ENROLLMENT_SUCCESS['id'],
                    'dep_order' => 1,
                ];
            } elseif ($enrollmentStatusSuccess > 0) {
                $orderUpdateData = [
                    'enrollment_status' => EnrollmentStatus::PARTIALLY_ENROLLED['id'],
                    'dep_order' => 1,
                ];
            }
        
            if (!empty($orderUpdateData)) {
                Order::where('id', $orderId)->update($orderUpdateData);
            }

            DB::commit();

        } catch (\Exception $e) {
            // Rollback the transaction if something went wrong
            DB::rollBack();

            // Optionally, log the error message or handle it as needed
            throw $e;
        }
    }

    private function processOverride($orderId, $orderLines, $transactionId, $enrollmentStatus){

        $orderLinesId = $orderLines->pluck('order_lines_id')->toArray();

        OrderLines::whereIn('id', $orderLinesId)->update(['enrollment_status_id' => $enrollmentStatus]);
        EnrollmentList::where('transaction_id', $transactionId)->update(['enrollment_status' => $enrollmentStatus]);

        $enrollmentHistoryData = [];

        foreach($orderLines as $orderLine) {
             $enrollmentHistoryData[] = [ 
                 'order_lines_id'    => $orderLine->id,
                 'dep_company_id'    => $orderLine->dep_company_id,
                 'sales_order_no'    => $orderLine->sales_order_no,
                 'item_code'         => $orderLine->item_code,
                 'serial_number'     => $orderLine->serial_number,
                 'transaction_id'    => $orderLine->transaction_id,
                 'dep_status'        => $orderLine->dep_status,
                 'enrollment_status' => $enrollmentStatus,
                 'status_message'    => $orderLine->status_message,
                 'created_by'        => auth()->user()->id,
                 'created_at'        => date('Y-m-d H:i:s')
             ];
         }

         EnrollmentHistory::insert($enrollmentHistoryData);

        //Update header status
        Order::where('id', $orderId)->update([
            'enrollment_status' => EnrollmentStatus::ENROLLMENT_SUCCESS['id'],
            'dep_order' => 1,
        ]);

    }

    private function processReturn( $orderLines, $transactionId, $enrollmentStatus){

        DB::beginTransaction();

        try {
            // Extract IDs and update tables
            $orderLinesId = $orderLines->pluck('id')->toArray();
            
            OrderLines::whereIn('id', $orderLinesId)->update(['enrollment_status_id' => $enrollmentStatus]);
            EnrollmentList::where('transaction_id', $transactionId)->update(['enrollment_status' => $enrollmentStatus]);

            // Prepare data for EnrollmentHistory and EnrollmentList updates
            $enrollmentHistoryData = [];
            $orderLineIds = $orderLines->pluck('id')->toArray();
            
            // Fetch all related enrollments in one query
            $enrollments = EnrollmentList::whereIn('order_lines_id', $orderLineIds)->get()->keyBy('order_lines_id');
            
            foreach($orderLines as $orderLine) {
                // Update EnrollmentList if exists
                if (isset($enrollments[$orderLine->id])) {
                    $enrollment = $enrollments[$orderLine->id];
                    $enrollment->fill([
                        'returned_by' => auth()->user()->id,
                        'returned_date' => now(),
                    ]);
                    $enrollment->save();
                }

                // Prepare data for EnrollmentHistory
                $enrollmentHistoryData[] = [ 
                    'order_lines_id'    => $orderLine->id,
                    'dep_company_id'    => $orderLine->dep_company_id,
                    'sales_order_no'    => $orderLine->sales_order_no,
                    'item_code'         => $orderLine->item_code,
                    'serial_number'     => $orderLine->serial_number,
                    'transaction_id'    => $orderLine->transaction_id,
                    'dep_status'        => $orderLine->dep_status,
                    'enrollment_status' => $enrollmentStatus,
                    'status_message'    => $orderLine->status_message,
                    'created_by'        => auth()->user()->id,
                    'created_at'        => now()
                ];
            }

            EnrollmentHistory::insert($enrollmentHistoryData);

            DB::commit();
        } catch (\Exception $e) {
            // Rollback the transaction if something went wrong
            DB::rollBack();
            
            // Optionally, log the error message or handle it as needed
            throw $e;
        }
    }

}