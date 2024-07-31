<?php

namespace App\Http\Controllers\DepDevices;
use App\Helpers\CommonHelpers;
use App\Exports\DevicesExport;
use App\Http\Controllers\Controller;
use App\Models\DepCompany;
use App\Models\DepDevice;
use App\Models\EnrollmentStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\AppleDeviceEnrollmentService;
use App\Models\OrderLines;
use App\Models\Order;
use App\Models\EnrollmentList;
use App\Models\JsonRequest;
use App\Models\JsonResponse;
use App\Models\TransactionLog;
use DB;
class DepDevicesController extends Controller
{
    protected $appleService;
    private $sortBy;
    private $sortDir;
    private $perPage;
    
    private const enrollment_status = [
        'Pending' => 1,
        'Enrollment Error' => 2,
        'Enrollment Success' => 3,
        'Completed' => 4,
        'Returned' => 5,
        'Return Error' => 6,
        'Partially Enrolled' => 7,
        'Voided' => 8,
        'Canceled' => 9,
        'Void Error' => 10,
    ];

    private const dep_status = [
        'Success' => 1,
        'GRX-50025' => 2,
    ];

    public function __construct(AppleDeviceEnrollmentService $appleService){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
        $this->appleService = $appleService;
    }

    public function getAllData()
    {

        $query = DepDevice::getData()->with('customer', 'depCompany');

        $filter = $query->searchAndFilter(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);
        
        return $result;
    }
    
    public function export(Request $request)
    {

        $filename = "DEP Devices - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new DevicesExport($data), $filename . '.xlsx');
    }

    public function getIndex()
    {
        $data = [];

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data['devices'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['enrollmentStatuses'] = EnrollmentStatus::select('id', 'enrollment_status as name')->get();
        $data['queryParams'] = request()->query();
        $data['options'] = DepCompany::get();
        $data['depCompanies'] = DepCompany::select('id as value', 'dep_company_name as label')->get();

        
        return Inertia::render('DepDevices/DepDevices', $data);
    }

    public function enrollDevices(Request $request)
    {

        if(!CommonHelpers::isCreate()) {

            $data = [
                'message' => "You don't have permission to enroll.", 
                'status' => 'error'
            ];

            return response()->json($data);
        }

        try {
            $id = $request->input('id'); 

            $payload = [
                'requestContext' => [
                    'shipTo' => config('services.apple_api.ship_to'),
                    'timeZone' => config('services.apple_api.timezone'),
                    'langCode' => config('services.apple_api.langCode'),
                ],
                'transactionId' => 'TXN_' . uniqid(),  
                'depResellerId' => config('services.apple_api.ship_to'),
                'orders' => [],  
            ];
            
            $header_data = OrderLines::where('list_of_order_lines.id',$id)->leftJoin('orders','list_of_order_lines.order_id','orders.id')->first();
            //UPC CODE
            $item_master = DB::table('item_master')->where('digits_code',$header_data['digits_code'])->first();
            $dep_company = DB::table('dep_companies')->where('id',$header_data['dep_company_id'])->first();
            if(!$item_master){
                $data = [
                    'message' => 'Item Master not found!',
                    'status' => 'error' 
                ];
    
                return response()->json($data);
            }
            // Check if multiple orders are provided
            $deliveryPayload = [];
            $devicePayload = [];
            
           
            $devicePayload[] = [
                'deviceId' => $header_data['serial_number'],
                'assetTag' => $header_data['serial_number'],
            ];
                
            $timestamp = strtotime($header_data['order_date']);
            $formattedDate = date('Y-m-d\TH:i:s\Z', $timestamp);
            $deliveryPayload = [
                'deliveryNumber' => $header_data['dr_number'],
                'shipDate' => $formattedDate,
                'devices' => $devicePayload,
            ];

            $orderPayload = [
                'orderNumber' => $header_data['sales_order_no'],
                'orderDate' => $formattedDate,
                'orderType' => 'OR',
                'customerId' => (string)$dep_company->id,
                'poNumber' => $header_data['order_ref_no'],
                'deliveries' => [
                    $deliveryPayload
                ],
            ];
            $payload['orders'][] = $orderPayload;

            // Call the service method to enroll devices
            $response = $this->appleService->enrollDevices($payload);

            // For successful response
            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                // $dep_status = $response['enrollDevicesResponse']['statusCode'];
                $dep_status = self::dep_status['Success'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $enrollment_status = self::enrollment_status['Enrollment Success'];
            }
            // else if (isset($response['enrollDeviceErrorResponse'])){
            //     $dep_status = $response['errorCode'];
            //     $status_message = $response['errorMessage'];
            //     $enrollment_status = 0;
            // }
            
            // For error response
            else {
                $transaction_id = $response['transactionId'];
                // $dep_status = $response['errorCode'];
                $dep_status = self::dep_status['GRX-50025'];
                $status_message = $response['errorMessage'];
                $enrollment_status = self::enrollment_status['Enrollment Error'];
            }

            // Data to be inserted in the enrollment list
            $insertData = [ 
                'order_lines_id' => $id,
                'dep_company_id' => $dep_company->id,
                'sales_order_no' => $header_data['sales_order_no'],
                'item_code' => $header_data['digits_code'],
                'serial_number' => $header_data['serial_number'],
                'transaction_id' => $transaction_id,
                'dep_status' => $dep_status,
                'enrollment_status' => $enrollment_status,
                'status_message' => $status_message,
                'created_by' => auth()->user()->id,
                'created_at' => date('Y-m-d H:i:s')
            ];

            
            // $enrollmentQuery = EnrollmentList::where('sales_order_no', $header_data['sales_order_no'])
            // ->where('serial_number', $header_data['serial_number']);
        
            // $enrolled = $enrollmentQuery->where('enrollment_status', 3)->exists();

            // if ($enrolled) {
            //     return response()->json(['message' => 'Device already enrolled!', 'status' => 'error' ]);
            // }

         
            $enrollmentQuery = EnrollmentList::where('sales_order_no', $header_data['sales_order_no'])
            ->where('serial_number', $header_data['serial_number']);
        
            // Check if the device already exists in the enrollment list
            $enrollment_exist = $enrollmentQuery->exists();
            
            if (!$enrollment_exist) {
                // If the device does not exist, insert the data
                EnrollmentList::insert($insertData);
            } else {
                // If the device exists, update the data
                $enrollmentQuery->update([
                    'dep_company_id' => $dep_company->id,
                    'transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'enrollment_status' => $enrollment_status,
                    'status_message' => $status_message,
                    'updated_by' => auth()->user()->id,
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
            }
            
            // Update the enrollment status of the order line
            OrderLines::where('id', $id)->update(['enrollment_status_id' => $enrollment_status]);
            
            // insert the request and response data to the database
            $orderId = $header_data['order_id'];
            $encodedPayload = json_encode($payload);
            $encodedResponse = json_encode($response);
            
            JsonRequest::insert(['order_id' => $orderId, 'order_lines_id' => $id,'data' => $encodedPayload , 'created_at' => date('Y-m-d H:i:s')]);
            JsonResponse::insert(['order_id' => $orderId, 'order_lines_id' => $id,'data' => $encodedResponse , 'created_at' => date('Y-m-d H:i:s')]);
            
            TransactionLog::insert([
                'order_type' => 'OR',
                'order_id' => $orderId,
                'order_lines_id' => $id,
                'dep_transaction_id' => $transaction_id,
                'dep_status' => $dep_status,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            // Count total number of order lines
            $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

            // Count order lines with enrollment status 3 or completed
            $enrollmentStatusSuccess = OrderLines::where('order_id', $orderId)
                ->where('enrollment_status_id', 3)
                ->count();

            // Check if all order lines have status 3 and update the enrollment status of the order
            if ($enrollmentStatusSuccess === $totalOrderLines && $totalOrderLines > 0) {
                Order::where('id', $orderId)->update(['enrollment_status' => self::enrollment_status['Completed']]);
            }

            $data = [
                'message' => $enrollment_status == 3 ? 'Enrollment Success!' : 'Enrollment Error!',
                'status' => $enrollment_status == 3 ? 'success' : 'error'
            ];

            return response()->json($data);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function unEnrollDevices(Request $request)
    {

        if(!CommonHelpers::isCreate()) {

            $data = [
                'message' => "You don't have permission to return.", 
                'status' => 'error'
            ];

            return response()->json($data);
        }

        try {
            $id = $request->input('id'); 

            $payload = [
                'requestContext' => [
                    'shipTo' => config('services.apple_api.ship_to'),
                    'timeZone' => config('services.apple_api.timezone'),
                    'langCode' => config('services.apple_api.langCode'),
                ],
                'transactionId' => 'TXN_' . uniqid(),  
                'depResellerId' => config('services.apple_api.ship_to'),
                'orders' => [],  
            ];
            
            $header_data = OrderLines::where('list_of_order_lines.id',$id)->leftJoin('orders','list_of_order_lines.order_id','orders.id')->first();
             //UPC CODE
             $item_master = DB::table('item_master')->where('digits_code',$header_data['digits_code'])->first();
             $dep_company = DB::table('dep_companies')->where('id',$header_data['dep_company_id'])->first();
             if(!$item_master){
                 $data = [
                     'message' => 'Item Master not found!',
                     'status' => 'error' 
                 ];
     
                 return response()->json($data);
             }
            // Check if multiple orders are provided
            $deliveryPayload = [];
            $devicePayload = [];
            
           
            $devicePayload[] = [
                'deviceId' => $header_data['serial_number'],
                'assetTag' => $header_data['serial_number'],
            ];
                
            $timestamp = strtotime($header_data['order_date']);
            $formattedDate = date('Y-m-d\TH:i:s\Z', $timestamp);
            $deliveryPayload = [
                'deliveryNumber' => $header_data['dr_number'],
                'shipDate' => $formattedDate,
                'devices' => $devicePayload,
            ];

            $orderPayload = [
                'orderNumber' => $header_data['sales_order_no'],
                'orderDate' => $formattedDate,
                'orderType' => 'RE',
                'customerId' => (string)$dep_company->id,
                'poNumber' => $header_data['order_ref_no'],
                'deliveries' => [
                    $deliveryPayload
                ],
            ];
            $payload['orders'][] = $orderPayload;

            // Call the service method to enroll devices
            $response = $this->appleService->unenrollDevices($payload);


            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                $enrollment_status = self::enrollment_status['Returned'];
                $dep_status = self::dep_status['Success'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
            
            } else {
                $transaction_id = $response['transactionId'];
                $enrollment_status = self::enrollment_status['Return Error'];
                $dep_status = self::dep_status['GRX-50025'];
                $status_message = $response['errorMessage'];
            }

            $enrollment = EnrollmentList::where('order_lines_id', $id)->first();

            if($enrollment){
                $enrollment->fill([
                    'transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'enrollment_status' => $enrollment_status,
                    'status_message' => $status_message,
                ]);

                if($enrollment_status == self::enrollment_status['Returned']){
                    $enrollment->fill([
                        'returned_by' => auth()->user()->id,
                        'returned_date' => now(),
                    ]);
                }

                $enrollment->save();
            }

            OrderLines::where('id', $id)->update(['enrollment_status_id' => $enrollment_status ]);

            
            // insert the request and response data to the database
            $orderId = $header_data['order_id'];
            $encodedPayload = json_encode($payload);
            $encodedResponse = json_encode($response);
            
            JsonRequest::insert(['order_id' => $orderId, 'order_lines_id' => $id, 'data' => $encodedPayload , 'created_at' => date('Y-m-d H:i:s')]);
            JsonResponse::insert(['order_id' => $orderId, 'order_lines_id' => $id, 'data' => $encodedResponse , 'created_at' => date('Y-m-d H:i:s')]);
            
            TransactionLog::insert([
                'order_type' => 'RE',
                'order_id' => $orderId,
                'order_lines_id' => $id,
                'dep_transaction_id' => $transaction_id,
                'dep_status' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            // Count total number of order lines
            $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

            // Count order lines with enrollment status 3 or completed
            $enrollmentStatusReturned = OrderLines::where('order_id', $orderId)
                ->where('enrollment_status_id', 5)
                ->count();

            if ($enrollmentStatusReturned === $totalOrderLines) {
                Order::where('id', $orderId)->update(['enrollment_status' => self::enrollment_status['Pending']]);
            }else{
                Order::where('id', $orderId)->update(['enrollment_status' => self::enrollment_status['Partially Enrolled']]);
            }
            // For successful response
            $data = [
                'message' => $enrollment_status == 5 ? 'Unenrollment Success!' : 'Unenrollment Error!',
                'status' => $enrollment_status == 5 ? 'success' : 'error'
            ];

            return response()->json($data);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateDepCompany(Request $request)
    {
        $validatedData = $request->validate([
            'depCompanyId' => 'required|integer|exists:dep_companies,id',
            'orderId' => 'required|integer|exists:list_of_order_lines,id',
        ]);
        
        $updated = DepDevice::updateDepCompany($validatedData['depCompanyId'], $validatedData['orderId']);

        if ($updated) {

            $data = [
                'message' =>'DEP Company updated successfully.',
                'status' => 'success'
            ];

            return response()->json($data, 200);
        } else {
            return response()->json(['message' => 'Something went wrong!'], 404);
        }
    }

    public function getDepCompany($orderId)
    {
        $customerId = Order::where('id', $orderId)->value('customer_name');

        if (!$customerId) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $options = DepCompany::where('customer_id', $customerId)->get();

        $formattedOptions = $options->map(function ($option) {
            return [
                'value' => $option->id,
                'label' => $option->dep_company_name
            ];
        });


        return response()->json($formattedOptions);
    }



}