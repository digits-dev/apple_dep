<?php

namespace App\Http\Controllers\ListOfOrders;
use App\Helpers\CommonHelpers;
use App\Exports\OrdersExport;
use App\Exports\TransactionExport;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\DepCompany;
use App\Models\EnrollmentHistory;
use App\Models\EnrollmentStatus;
use App\Models\Order;
use App\Models\OrderLines;
use App\Models\User;
use App\Models\EnrollmentList;
use App\Models\JsonRequest;
use App\Models\JsonResponse;
use App\Models\TransactionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\AppleDeviceEnrollmentService;
use App\Services\ApplePayloadController;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Config;
use App\Models\TransactionStatusJsonRequest;
use App\Models\TransactionStatusJsonResponse;

class ListOfOrdersController extends Controller
{
    protected $appleService;
    private $sortBy;
    private $sortDir;
    private $perPage;
    protected $applePayloadController;

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
        'Override' => 11,
        'Override Error' => 12,
    ];

    private const dep_status = [
        'Success' => 1,
        'GRX-50025' => 2,
    ];


    public function __construct(ApplePayloadController $applePayloadController, AppleDeviceEnrollmentService $appleService){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
        $this->appleService = $appleService;
        $this->applePayloadController = $applePayloadController;
    }

    
    public function getAllData()
    {
        $query = Order::query()->with(['status','customer']);

        $filter = $query->searchAndFilter(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }
    
    public function export(Request $request)
    {

        $filename = "List Of Orders - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new OrdersExport($data), $filename . '.xlsx');
    }

    public function checkIfVoidable($id) {

        $enrollmentStatusSuccess = OrderLines::where('order_id', $id)
            ->whereIn('enrollment_status_id', [self::enrollment_status['Enrollment Success'], self::enrollment_status['Void Error']])
            ->count();

        $isVoidable = $enrollmentStatusSuccess > 0 ? true : false;    
            
        return $isVoidable;
    }

    public function getIndex(Request $request)
    {

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];

        $orders = self::getAllData()->paginate($this->perPage)->withQueryString();

        $data['enrollmentStatuses'] = EnrollmentStatus::select('id', 'enrollment_status as name')->get();

        foreach ($orders as $order) {
            $order->isVoidable = $this->checkIfVoidable($order->id);
        }


        $data['orders'] = $orders;
        $data['queryParams'] = request()->query();
        $data['customers'] = Customer::select('id as value', 'customer_name as label')->get();
        $data['order_number'] = Order::select('sales_order_no as value','sales_order_no as label')->where('enrollment_status',7)->get();
        return Inertia::render('ListOfOrders/ListOfOrders', $data);

    }

    public function show(Order $order)
    {
        $data = [];
        $data['order'] = $order->with('customer')->where('id', $order->id)->first();
        $data['orderLines'] = OrderLines::where('order_id', $order->id)->get();
        $data['jsonSubmitted'] = JsonRequest::where('order_id', $order->id)->orderBy('created_at', 'desc')->get();
        $data['jsonReceived'] = JsonResponse::where('order_id', $order->id)->orderBy('created_at', 'desc')->get();
        $data['transactionLogs'] = TransactionLog::join('dep_statuses', 'dep_statuses.id', '=', 'transaction_logs.dep_status')
        ->select('transaction_logs.*', 'dep_statuses.dep_status as dep_status_name')
        ->where('transaction_logs.order_id', $order->id)->orderBy('created_at', 'desc')->get();
        return Inertia::render('ListOfOrders/OrderDetails', $data);
    }

    public function showEnrollReturn(Order $order){

        if(!CommonHelpers::isCreate()) {
            return Inertia::render('Errors/RestrictionPage');
        }
       
        $data = [];
        $data ['order'] = $order->with('customer')->where('id',$order->id)->first();
        
        $data['orderLines'] = OrderLines::query()
        ->where('order_id', $order->id)
        ->with(['status','depCompanies'])
        ->orderBy($this->sortBy, $this->sortDir)
        ->get();

        //get all duplicate serials with different SO
        $duplicates = OrderLines::query()
        ->select('serial_number')
        ->groupBy('serial_number')
        ->havingRaw('COUNT(DISTINCT order_id) > 1')
        ->pluck('serial_number');

        $data['duplicateSerials'] = $data['orderLines']->filter(function ($orderLine) use ($duplicates) {
            return $duplicates->contains($orderLine->serial_number);
        })->pluck('serial_number');

        $data['queryParams'] = request()->query();

        $orderHeader = Order::where('id', $order->id)->select('customer_id')->first();

        $data['depCompanies'] = DepCompany::where('customer_id', $orderHeader->customer_id)
        ->select('id as value', 'dep_company_name as label')
        ->get();
        
        return Inertia::render('ListOfOrders/EnrollReturnDevices', $data);
    }

    public function updateDepCompany(Request $request, OrderLines $order){
        
        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

   
        $request->validate([
            'dep_company_id' => "required",
        ]);

        $order->update(['dep_company_id' => $request->input('dep_company_id')]);
        
        $data = [
            'message' => "Successfully Updated.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }

    public function exportText($logType,$orderId)
    {
        if ($logType === 'Received') {
            $data = JsonResponse::where('order_id', $orderId)->get();
        } else {
            $data = JsonRequest::where('order_id', $orderId)->get();
        }
        
        $content = "";
        foreach ($data as $item) {
            $decodedData = json_decode($item->data);
            
            $exportData = [
                'id' => $item->id,
                'order_id' => $item->order_id,
                'order_lines_id' => $item->order_lines_id,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'data' => $decodedData, 
            ];
            
            $content .= json_encode($exportData, JSON_PRETTY_PRINT) . "\n";
        }
        
        $headers = [
            'Content-Type' => 'text/plain',
            'Content-Disposition' => 'attachment; filename="export.txt"',
        ];
        
        return response()->make($content, 200, $headers);
    }


    public function exportTransaction($orderId)
    {

        $filename = "Transaction Logs - " . date ('Y-m-d H:i:s');

        return Excel::download(new TransactionExport($orderId), $filename . '.xlsx');
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
            
            $payload = $this->applePayloadController->generatePayload();

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
                'order_lines_id'    => $id,
                'dep_company_id'    => $dep_company->id,
                'sales_order_no'    => $header_data['sales_order_no'],
                'item_code'         => $header_data['digits_code'],
                'serial_number'     => $header_data['serial_number'],
                'transaction_id'    => $transaction_id,
                'dep_status'        => $dep_status,
                'enrollment_status' => $enrollment_status,
                'status_message'    => $status_message,
                'created_by'        => auth()->user()->id,
                'created_at'        => date('Y-m-d H:i:s')
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

            EnrollmentHistory::create($insertData);
            
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
                ->where('enrollment_status_id', self::enrollment_status['Enrollment Success'])
                ->count();

            // Check if all order lines have status 3 and update the enrollment status of the order
            if ($enrollmentStatusSuccess === $totalOrderLines) {
                Order::where('id', $orderId)->update([
                    'enrollment_status' => self::enrollment_status['Enrollment Success'],
                    'dep_order' => 1
                ]);
            }else if ($enrollmentStatusSuccess > 0) {
                Order::where('id', $orderId)->update([
                    'enrollment_status' => self::enrollment_status['Partially Enrolled'],
                    'dep_order' => 1
                ]);
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
            
            $payload = $this->applePayloadController->generatePayload();
            
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

            $insertToHistory = [ 
                'order_lines_id' => $id,
                'dep_company_id' => $dep_company->id,
                'sales_order_no' => $header_data['sales_order_no'],
                'item_code' => $header_data['digits_code'],
                'serial_number' => $header_data['serial_number'],
                'transaction_id' => $transaction_id,
                'dep_status' => $dep_status,
                'enrollment_status' => $enrollment_status,
                'status_message' => $status_message,
            ];

            EnrollmentHistory::create($insertToHistory);

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
            
             // Check if all order lines have status 5 and update the enrollment status of the order
            // if ($enrollmentStatusReturned === $totalOrderLines) {
            //     Order::where('id', $orderId)->update([
            //         'enrollment_status' => self::enrollment_status['Pending'],
            //         'dep_order' => 0
            //     ]);
            // }else{
            //     Order::where('id', $orderId)->update([
            //         'enrollment_status' => self::enrollment_status['Partially Enrolled']
            //     ]);
            // }
            

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

    public function bulkEnrollDevices(Request $request)
    {

        if(!CommonHelpers::isCreate()) {

            $data = [
                'message' => "You don't have permission to enroll.", 
                'status' => 'error'
            ];

            return response()->json($data);
        }

        try {
            $ids = $request->input('ids');
            
            // Fetch unique lines
            $uniqueLines = OrderLines::whereIn('list_of_order_lines.id', $ids)
                ->leftJoin('orders', 'list_of_order_lines.order_id', 'orders.id')
                ->selectRaw('MIN(list_of_order_lines.id) as id, list_of_order_lines.serial_number, list_of_order_lines.digits_code')
                ->groupBy('list_of_order_lines.serial_number', 'list_of_order_lines.digits_code')
                ->get();

            $idsOfUniqueLines = [];
            
            // check lines if they're already enrolled through digits code and serial number
            foreach ($uniqueLines as $orderLines) {
                $exists = OrderLines::where('digits_code', $orderLines->digits_code)
                    ->where('serial_number', $orderLines->serial_number)
                    ->where('enrollment_status_id', self::enrollment_status['Enrollment Success'])
                    ->exists();
        
                if (!$exists) {
                    $idsOfUniqueLines[] = $orderLines->id;
                }
            }

            if (!empty($idsOfUniqueLines)) {
                // Fetch detailed order lines
                $requestData = OrderLines::select('list_of_order_lines.id as order_line_id', 'orders.id as order_id', 'list_of_order_lines.*', 'orders.*') 
                    ->whereIn('list_of_order_lines.id', $idsOfUniqueLines)
                    ->leftJoin('orders', 'list_of_order_lines.order_id', '=', 'orders.id')
                    ->get();

        
                $header_data = $requestData->first();
        
                $devicePayload = [];

                foreach ($requestData as $key => $orderData) {
                    $item_master = DB::table('item_master')->where('digits_code',$orderData->digits_code)->first();

                    if(!$item_master){
                        $data = [
                            'message' => 'Item Master not found!',
                            'status' => 'error' 
                        ];
            
                        return response()->json($data);
                    }

                    $devicePayload[$key] = [
                        'deviceId' => $orderData->serial_number,
                        'assetTag' => $orderData->serial_number,
                    ];
                }
        
                $formattedDate = date('Y-m-d\TH:i:s\Z', strtotime($header_data->order_date));
        
                $deliveryPayload = [
                    'deliveryNumber' => $header_data->dr_number,
                    'shipDate' => $formattedDate,
                    'devices' => $devicePayload,
                ];
                $dep_company = DB::table('dep_companies')->where('id',$header_data->dep_company_id)->first();
                $orderPayload = [
                    'orderNumber' => $header_data->sales_order_no,
                    'orderDate' => $formattedDate,
                    'orderType' => 'OR',
                    'customerId' => (string)$dep_company->id,
                    'poNumber' => $header_data->order_ref_no,
                    'deliveries' => [$deliveryPayload],
                ];
                
                $payload = $this->applePayloadController->generatePayload();

                $payload['orders'][] = $orderPayload;

                $response = $this->appleService->enrollDevices($payload);
        
                if (isset($response['enrollDevicesResponse'])) {
                    $transaction_id = $response['deviceEnrollmentTransactionId'];
                    $dep_status = self::dep_status['Success'];
                    $status_message = $response['enrollDevicesResponse']['statusMessage'];
                    $enrollment_status = self::enrollment_status['Enrollment Success'];

                    // Update enrollment status to success
                    OrderLines::whereIn('id', $idsOfUniqueLines)->update(['enrollment_status_id' => self::enrollment_status['Enrollment Success']]);

                } else {
                    $transaction_id = $response['transactionId'];
                    $dep_status = self::dep_status['GRX-50025'];
                    $status_message = $response['errorMessage'];
                    $enrollment_status = self::enrollment_status['Enrollment Error'];

                    OrderLines::whereIn('id', $idsOfUniqueLines)->update(['enrollment_status_id' => self::enrollment_status['Enrollment Error']]);
                }

                foreach ($requestData as $deviceData) {

                    $record = EnrollmentList::updateOrCreate(
                        [
                            'sales_order_no' => $header_data->sales_order_no,
                            'serial_number'  => $deviceData->serial_number
                        ],
                        [
                            'order_lines_id'    => $deviceData->order_line_id,
                            'dep_company_id'    => $dep_company->id,
                            'sales_order_no'    => $header_data->sales_order_no,
                            'item_code'         => $deviceData->digits_code,
                            'transaction_id'    => $transaction_id,
                            'serial_number'     => $deviceData->serial_number,
                            'dep_status'        => $dep_status,
                            'enrollment_status' => $enrollment_status,
                            'status_message'    => $status_message,
                        ],
                    );

                    $insertToHistory = [ 
                        'order_lines_id' => $deviceData->order_line_id,
                        'dep_company_id' => $dep_company->id,
                        'sales_order_no' =>  $header_data->sales_order_no,
                        'item_code' => $deviceData->digits_code,
                        'serial_number' => $deviceData->serial_number,
                        'transaction_id' => $transaction_id,
                        'dep_status' => $dep_status,
                        'enrollment_status' => $enrollment_status,
                        'status_message' => $status_message,
                    ];
        
                    EnrollmentHistory::create($insertToHistory);

                }

                // Logs
                $orderId = $header_data->order_id;
                $encodedPayload = json_encode($payload);
                $encodedResponse = json_encode($response);

                      
                JsonRequest::insert([
                    'order_id' => $orderId,
                    'order_lines_id' => implode(',', $idsOfUniqueLines),
                    'data' => $encodedPayload,
                    'created_at' => now(),
                ]);
        
                JsonResponse::insert([
                    'order_id' => $orderId,
                    'order_lines_id' => implode(',', $idsOfUniqueLines),
                    'data' => $encodedResponse,
                    'created_at' => now(),
                ]);
        
                TransactionLog::insert([
                    'order_type' => 'OR',
                    'order_id' => $orderId,
                    'order_lines_id' => implode(',', $idsOfUniqueLines),
                    'dep_transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'created_at' => now(),
                ]);
        
                // Update order enrollment status to success if all lines are enrolled successfully
                $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

                $enrollmentStatusSuccess = OrderLines::where('order_id', $orderId)
                    ->where('enrollment_status_id', self::enrollment_status['Enrollment Success'])
                    ->count();

                if ($enrollmentStatusSuccess === $totalOrderLines) {
                    Order::where('id', $orderId)->update([
                        'enrollment_status' => self::enrollment_status['Enrollment Success'],
                        'dep_order' => 1,
                    ]);
                }else if ($enrollmentStatusSuccess > 0) {
                    Order::where('id', $orderId)->update([
                        'enrollment_status' => self::enrollment_status['Partially Enrolled'],
                        'dep_order' => 1,
                    ]);
                }
                
                $data = [
                    'message' => $enrollment_status == self::enrollment_status['Enrollment Success'] ? 'Enrollment Success!' : 'Enrollment Error!',
                    'status' => $enrollment_status == self::enrollment_status['Enrollment Success'] ? 'success' : 'error',
                ];
        
                return response()->json($data);
            } else {
                $data = [
                    'message' => 'The selected items could be duplicates and already enrolled.',
                    'status' => 'error',
                ];
        
                return response()->json($data);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        
    }

    public function bulkReturnDevices(Request $request)
    {
        if(!CommonHelpers::isCreate()) {

            $data = [
                'message' => "You don't have permission to return.", 
                'status' => 'error'
            ];

            return response()->json($data);
        }

        try {
            $ids = $request->input('ids');

            if (!empty($ids)) {
                $requestData = OrderLines::whereIn('list_of_order_lines.id', $ids)
                    ->leftJoin('orders', 'list_of_order_lines.order_id', 'orders.id')
                    ->get();
        
                $header_data = $requestData->first();
        
                $devicePayload = [];

                foreach ($requestData as $key => $orderData) {
                    $item_master = DB::table('item_master')->where('digits_code',$orderData->digits_code)->first();

                    if(!$item_master){
                        $data = [
                            'message' => 'Item Master not found!',
                            'status' => 'error' 
                        ];
            
                        return response()->json($data);
                    }

                    $devicePayload[$key] = [
                        'deviceId' => $orderData->serial_number,
                        'assetTag' => $orderData->serial_number,
                    ];
                }
        
                $formattedDate = date('Y-m-d\TH:i:s\Z', strtotime($header_data->order_date));
        
                $deliveryPayload = [
                    'deliveryNumber' => $header_data->dr_number,
                    'shipDate' => $formattedDate,
                    'devices' => $devicePayload,
                ];
                $dep_company = DB::table('dep_companies')->where('id', $header_data->dep_company_id)->first();
                $orderPayload = [
                    'orderNumber' => $header_data->sales_order_no,
                    'orderDate' => $formattedDate,
                    'orderType' => 'RE',
                    'customerId' => (string)$dep_company->id,
                    'poNumber' => $header_data->order_ref_no,
                    'deliveries' => [$deliveryPayload],
                ];

                $payload = $this->applePayloadController->generatePayload();
                $payload['orders'][] = $orderPayload;
                $response = $this->appleService->unenrollDevices($payload);

                if (isset($response['enrollDevicesResponse'])) {
                    $transaction_id = $response['deviceEnrollmentTransactionId'];
                    $dep_status = self::dep_status['Success'];
                    $status_message = $response['enrollDevicesResponse']['statusMessage'];
                    $enrollment_status = self::enrollment_status['Returned'];

                    OrderLines::whereIn('id', $ids)->update(['enrollment_status_id' => self::enrollment_status['Returned']]);

                } else {
                    $transaction_id = $response['transactionId'];
                    $dep_status = self::dep_status['GRX-50025'];
                    $status_message = $response['errorMessage'];
                    $enrollment_status = self::enrollment_status['Return Error'];

                    OrderLines::whereIn('id', $ids)->update(['enrollment_status_id' => self::enrollment_status['Return Error']]);

                }
        
                foreach ($requestData as $deviceData) {
                    $enrollment = EnrollmentList::query()
                    ->where('sales_order_no', $header_data->sales_order_no)
                    ->where('serial_number', $deviceData->serial_number)
                    ->first();

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

                    
                    $insertToHistory = [ 
                        'order_lines_id' => $deviceData->id,
                        'dep_company_id' => $deviceData->dep_company_id,
                        'sales_order_no' =>  $header_data->sales_order_no,
                        'item_code' => $deviceData->digits_code,
                        'serial_number' => $deviceData->serial_number,
                        'transaction_id' => $transaction_id,
                        'dep_status' => $dep_status,
                        'enrollment_status' => $enrollment_status,
                        'status_message' => $status_message,
                    ];
        
                    EnrollmentHistory::create($insertToHistory);
                }
        
                // Logs
                $orderId = $header_data->order_id;
                $encodedPayload = json_encode($payload);
                $encodedResponse = json_encode($response);
        
                JsonRequest::insert([
                    'order_id' => $orderId,
                    'order_lines_id' => implode(',', $ids),
                    'data' => $encodedPayload,
                    'created_at' => now(),
                ]);
        
                JsonResponse::insert([
                    'order_id' => $orderId,
                    'order_lines_id' => implode(',', $ids),
                    'data' => $encodedResponse,
                    'created_at' => now(),
                ]);
        
                TransactionLog::insert([
                    'order_type' => 'RE',
                    'order_id' => $orderId,
                    'order_lines_id' => implode(',', $ids),
                    'dep_transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'created_at' => now(),
                ]);

                $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

                // Count order lines with enrollment status 3 or completed
                $enrollmentStatusReturned = OrderLines::where('order_id', $orderId)
                    ->where('enrollment_status_id', 5)
                    ->count();

                // if ($enrollmentStatusReturned === $totalOrderLines) {
                //     Order::where('id', $orderId)->update([
                //         'enrollment_status' => self::enrollment_status['Pending'],
                //         'dep_order' => 0,
                //     ]);
                // } 
                
                $data = [
                    'message' => $enrollment_status == self::enrollment_status['Returned' ] ? 'Unenroll Devices Successfully!' : 'Unenroll Devices Failed!',
                    'status' => $enrollment_status == self::enrollment_status['Returned' ] ? 'success' : 'error',
                ];
        
                return response()->json($data);
            } else {
                $data = [
                    'message' => 'Something went wrong!',
                    'status' => 'error',
                ];
        
                return response()->json($data);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        
    }

    public function cancelOrder(Order $order){

        $orderId = $order->id;

        $orderLines = OrderLines::where('order_id', $orderId)->get();

        // UPDATING EACH LINES
        foreach($orderLines as $orderLine){
            $orderLine->enrollment_status_id = self::enrollment_status['Canceled'];
            $orderLine->save();

            $insertToHistory = [ 
                'order_lines_id' => $orderLine->id,
                'dep_company_id' => $orderLine->dep_company_id,
                'sales_order_no' =>  $order->sales_order_no,
                'item_code' => $orderLine->digits_code,
                'serial_number' => $orderLine->serial_number,
                'dep_status' => 0,
                'enrollment_status' => self::enrollment_status['Canceled'],
            ];

            EnrollmentHistory::create($insertToHistory);
        }

        // UPDATE HEADER
        $order->enrollment_status = self::enrollment_status['Canceled'];
        $order->save();

        $data = [
            'message' => 'Cancel Order Success.',
            'status' => 'success',
        ];

        return response()->json($data);
    }

    public function void(Request $request)
    {
        if(!CommonHelpers::isCreate()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $id = $request->input('id');

        $enrollmentIds = OrderLines::where('order_id', $id)
                ->whereIn('enrollment_status_id', [3, 5, 6, 10])
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


        $header_data = $enrolledDevices->first();
        $devicePayload = [];

        foreach ($enrolledDevices as $key => $orderData) {
            $item_master = DB::table('item_master')->where('digits_code',$orderData->digits_code)->first();

            if(!$item_master){
                $data = [
                    'message' => 'Item Master not found!',
                    'status' => 'error' 
                ];
    
                return response()->json($data);
            }
            $devicePayload[$key] = [
                'deviceId' => $orderData->serial_number,
                'assetTag' => $orderData->serial_number,
            ];
        }

        $formattedDate = date('Y-m-d\TH:i:s\Z', strtotime($header_data->order_date));
  
        // $deliveryPayload = [
        //     'deliveryNumber' => $header_data->dr_number,
        //     'shipDate' => $formattedDate,
        //     'devices' => $devicePayload,
        // ];
        $dep_company = DB::table('dep_companies')->where('id',$header_data->dep_company_id)->first();
        $orderPayload = [
            'orderNumber' => $header_data->sales_order_no,
            'orderDate' => $formattedDate,
            'orderType' => 'VD',
            'customerId' => (string)$dep_company->id,
            'poNumber' => $header_data->order_ref_no,
            // 'deliveries' => [$deliveryPayload],
        ];

    
        $payload = $this->applePayloadController->generatePayload();
        $payload['orders'][] = $orderPayload;
        $response = $this->appleService->unenrollDevices($payload);

        if (isset($response['enrollDevicesResponse'])) {
            $transaction_id = $response['deviceEnrollmentTransactionId'];
            $dep_status = self::dep_status['Success'];
            $status_message = $response['enrollDevicesResponse']['statusMessage'];
            $enrollment_status = self::enrollment_status['Voided'];

            OrderLines::where('order_id', $header_data->order_id)->update(['enrollment_status_id' => self::enrollment_status['Voided']]);

        } else {
            $transaction_id = $response['transactionId'];
            $dep_status = self::dep_status['GRX-50025'];
            $status_message = $response['errorMessage'];
            $enrollment_status = self::enrollment_status['Void Error'];

            OrderLines::where('order_id', $header_data->order_id)->update(['enrollment_status_id' => self::enrollment_status['Void Error']]);

        }

        // for enrolled/Returned devices
        foreach ($enrolledDevices as $deviceData) {
            $enrollment = EnrollmentList::query()
            ->where('sales_order_no', $header_data->sales_order_no)
            ->where('serial_number', $deviceData->serial_number)
            ->first();

            if($enrollment){
                $enrollment->fill([
                    'transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'enrollment_status' => $enrollment_status,
                    'status_message' => $status_message,
                ]);

                $enrollment->save();
            }


            $insertToHistory = [ 
                'order_lines_id' => $deviceData->id,
                'dep_company_id' => $deviceData->dep_company_id,
                'sales_order_no' => $header_data->sales_order_no,
                'item_code' => $deviceData->digits_code,
                'serial_number' => $deviceData->serial_number,
                'transaction_id' => $transaction_id,
                'dep_status' => $dep_status,
                'enrollment_status' => $enrollment_status,
                'status_message' => $status_message,
            ];

            EnrollmentHistory::create($insertToHistory);
            
        }

    
        //Insert other lines that are not enrolled in Enrollment History

        $enrolledIds = $enrolledDevices->pluck('line_id');

        $orderLines = OrderLines::where('order_id', $id)->get();

        $otherLines = $orderLines->filter(function($orderLine) use ($enrolledIds) {
            return !$enrolledIds->contains($orderLine->id);
        });

        foreach ($otherLines as $orderLine) {
            $insertToHistory = [ 
                'order_lines_id' => $orderLine->id,
                'dep_company_id' => $orderLine->dep_company_id,
                'sales_order_no' => $header_data->sales_order_no,
                'item_code' => $orderLine->digits_code,
                'serial_number' => $orderLine->serial_number,
                'dep_status' => 0,
                'enrollment_status' => $enrollment_status,
            ];

            EnrollmentHistory::create($insertToHistory);
        }
        

          // Logs
          $orderId = $header_data->order_id;
          $encodedPayload = json_encode($payload);
          $encodedResponse = json_encode($response);
          $ids = $enrolledDevices->pluck('order_lines_id')->toArray();

  
          JsonRequest::insert([
              'order_id' => $orderId,
              'order_lines_id' => implode(',', $ids),
              'data' => $encodedPayload,
              'created_at' => now(),
          ]);
  
          JsonResponse::insert([
              'order_id' => $orderId,
              'order_lines_id' => implode(',', $ids),
              'data' => $encodedResponse,
              'created_at' => now(),
          ]);
  
          TransactionLog::insert([
              'order_type' => 'VD',
              'order_id' => $orderId,
              'order_lines_id' => implode(',', $ids),
              'dep_transaction_id' => $transaction_id,
              'dep_status' => $dep_status,
              'created_at' => now(),
          ]);

        Order::where('id', $orderId)->update(['enrollment_status' => $enrollment_status]);
        
        $data = [
            'message' => $enrollment_status == self::enrollment_status['Voided'] ? 'Voided Successfully!' : 'Void Error!',
            'status' => $enrollment_status == self::enrollment_status['Voided'] ? 'success' : 'error',
        ];

        return response()->json($data);
    }
  
    public function overrideOrder(Request $request, OrderLines $orderLine)
    {
        if(!CommonHelpers::isOverride()) {

            $data = [
                'message' => "You don't have permission to override.", 
                'status' => 'error'
            ];
    
            return back()->with($data);
        }
      
        try {
            $id = $orderLine->id;
            $depCompanyId = $request->input('dep_company_id');

            $payload = $this->applePayloadController->generatePayload();
            
            $header_data = OrderLines::where('list_of_order_lines.id',$id)->leftJoin('orders','list_of_order_lines.order_id','orders.id')->first();
           
            //UPC CODE
            $item_master = DB::table('item_master')->where('digits_code',$header_data['digits_code'])->first();

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
                'orderType' => 'OV',
                'customerId' => (string)$depCompanyId,
                'poNumber' => $header_data['order_ref_no'],
                'deliveries' => [
                    $deliveryPayload
                ],
            ];
            $payload['orders'][] = $orderPayload;

            // Call the service method to override device
            $response = $this->appleService->overrideOrder($payload);

            // For successful response
            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                $dep_status = self::dep_status['Success'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $enrollment_status = self::enrollment_status['Override'];
                $orderLine->update(['dep_company_id' => $depCompanyId]);
            }

            // For error response
            else {
                $transaction_id = $response['transactionId'];
                $dep_status = self::dep_status['GRX-50025'];
                $status_message = $response['errorMessage'];
                $enrollment_status = self::enrollment_status['Override Error'];
            }
            
            // Update the enrollment status of the order line
            $orderLine->update(['enrollment_status_id' => $enrollment_status]);

            $insertToHistory = [ 
                'order_lines_id' => $orderLine->id,
                'dep_company_id' => $orderLine->dep_company_id,
                'sales_order_no' => $header_data->sales_order_no,
                'item_code' => $orderLine->digits_code,
                'serial_number' => $orderLine->serial_number,
                'transaction_id' => $transaction_id,
                'dep_status' => $dep_status,
                'enrollment_status' => $enrollment_status,
                'status_message' => $status_message,
            ];

            EnrollmentHistory::create($insertToHistory);
            
            // insert the request and response data to the database
            $orderId = $header_data['order_id'];
            $encodedPayload = json_encode($payload);
            $encodedResponse = json_encode($response);
            
            JsonRequest::insert(['order_id' => $orderId, 'order_lines_id' => $id,'data' => $encodedPayload , 'created_at' => date('Y-m-d H:i:s')]);
            JsonResponse::insert(['order_id' => $orderId, 'order_lines_id' => $id,'data' => $encodedResponse , 'created_at' => date('Y-m-d H:i:s')]);
            
            TransactionLog::insert([
                'order_type' => 'OV',
                'order_id' => $orderId,
                'order_lines_id' => $id,
                'dep_transaction_id' => $transaction_id,
                'dep_status' => $dep_status,
                'created_at' => date('Y-m-d H:i:s'),
            ]);

            $data = [
                'message' => $enrollment_status == self::enrollment_status['Override'] ? 'Override Success!' : 'Override Error!',
                'status' => $enrollment_status == self::enrollment_status['Override'] ? 'success' : 'error'
            ];
    
            return back()->with($data);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function orderDetails(Request $request){
      
        $requestData = [
            'requestContext' => [
                'shipTo' => config('services.apple_api.ship_to'),
                'timeZone' => config('services.apple_api.timeZone'),
                'langCode' => config('services.apple_api.langCode')
            ],
            'depResellerId' => config('services.apple_api.depResellerId'),
            'orderNumbers'  => array_values($request->orderNumber)
        ];

        $depSellerId = config('services.apple_api.depResellerId');
       
        $response = $this->appleService->showOrderDetails($requestData);

        $encodedRequestData = json_encode($requestData);
        $encodedResponseData = json_encode($response);
   
        foreach($request->orderNumber as $order){
            TransactionStatusJsonRequest::updateOrInsert(['transaction_id' => $order],['data' => $encodedRequestData , 'created_at' => date('Y-m-d H:i:s')]);
            TransactionStatusJsonResponse::updateOrInsert(['transaction_id' => $order],['data' => $encodedResponseData , 'created_at' => date('Y-m-d H:i:s')]);
           
            $data = [];
    
            $data['TransactionJsonResponse'] = TransactionStatusJsonResponse::where('transaction_id', $order)->first();
            $data['TransactionJsonRequest'] = TransactionStatusJsonRequest::where('transaction_id', $order)->first();
        }
     
        return json_encode(["message"=>response()->json($response), "jsonresponse" => $data['TransactionJsonResponse'] , "jsonrequest"=>$data['TransactionJsonRequest'] ]);
     
        return json_encode($response);
    }
}