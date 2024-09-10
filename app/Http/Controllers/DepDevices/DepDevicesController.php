<?php

namespace App\Http\Controllers\DepDevices;
use App\Models\EnrollmentHistory;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Customer;
use App\Models\DepDevice;
use App\Models\DepCompany;
use App\Models\OrderLines;
use App\Models\JsonRequest;
use App\Models\JsonResponse;
use Illuminate\Http\Request;
use App\Exports\DevicesExport;
use App\Helpers\CommonHelpers;
use App\Models\EnrollmentList;
use App\Models\TransactionLog;
use App\Models\EnrollmentStatus;
use App\Models\Counter;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\AppleDeviceEnrollmentService;
use App\Services\ApplePayloadController;

class DepDevicesController extends Controller
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

    private $enrollment_status;

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

        $query = DepDevice::getData()->with('customer', 'depCompany');

        $filter = $query->searchAndFilter(request());

        $result = $filter->sort([
            'sortBy' => $this->sortBy,
            'sortDir' => $this->sortDir,
        ]);

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

        $devices = self::getAllData()->paginate($this->perPage)->withQueryString();

        $data['devices'] = $devices;


        foreach ($devices as $depDevice) {
            $order = $depDevice->order;
            $depDevice["dr_number"] =$order->dr_number;
            $depDevice["order_ref_no"] =$order->order_ref_no;
            $depDevice["order_date"] =$order->order_date;
            $depDevice["sales_order_no"] =$order->sales_order_no;
        }

        $data['enrollmentStatuses'] = EnrollmentStatus::select('id', 'enrollment_status as name')->get();
        $data['queryParams'] = request()->query();
        $data['options'] = DepCompany::get();
        $data['depCompanies'] = DepCompany::select('id as value', 'dep_company_name as label')->get();
        $data['customers'] = Customer::select('id as value', 'customer_name as label')->get();

        //get all duplicate serials with different SO
        $data['duplicates'] = OrderLines::query()
        ->select('serial_number')
        ->groupBy('serial_number')
        ->havingRaw('COUNT(DISTINCT order_id) > 1')
        ->pluck('serial_number');

        return Inertia::render('DepDevices/DepDevices', $data);
    }

    public function getDepCompanies(Request $request){
        $orderId = $request->input('order_id');
        $orderHeader = Order::find($orderId);

        $depCompanies = DepCompany::where('customer_id', $orderHeader->customer_id)
            ->select('id as value', 'dep_company_name as label')
            ->get();
    
        return response()->json($depCompanies);
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
            $header_data = OrderLines::where('list_of_order_lines.id',$id)->leftJoin('orders','list_of_order_lines.order_id','orders.id')->first();
            $dep_company = DB::table('dep_companies')->where('id',$header_data['dep_company_id'])->first();
        
            //UPC CODE
            $item_master = DB::table('item_master')->where('digits_code',$header_data['digits_code'])->first();

            if(!$item_master){
                $data = [
                    'message' => 'Item Master not found!',
                    'status' => 'error' 
                ];
    
                return response()->json($data);
            }
  
            $payload = $this->applePayloadController->generatePayload();

            $ordersPayload = $this->applePayloadController->generateOrdersPayload($header_data,  $dep_company, 'OR');

            $payload['orders'][] = $ordersPayload;

            $response = $this->appleService->enrollDevices($payload);

            //Device Enrollment
            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                $dep_status = self::dep_status['Success'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $this->enrollment_status = EnrollmentStatus::IN_PROGRESS['id'];

            } else if(isset($response['enrollDeviceErrorResponse'])) {  
                $transaction_id = $response['transactionId'];
                $dep_status = self::dep_status['GRX-50025'];
                $status_message = $response['errorMessage'];
                $this->enrollment_status = EnrollmentStatus::ENROLLMENT_ERROR['id'];

            } else {
                $data = [
                    'message' => 'Something went wrong in enrolling the device/s.',
                    'status' =>  'error',
                ];
        
                return response()->json($data);
              
            }

            // Logs
            $orderId = $header_data['order_id'];
            $encodedPayload = json_encode($payload);
            $encodedResponse = json_encode($response);

            self::generateLogs($orderId, $id, $encodedPayload, $encodedResponse, $transaction_id, $dep_status, 'OR');

            
            //Check transaction status
            if($this->enrollment_status !== EnrollmentStatus::ENROLLMENT_ERROR['id']) {
                $apiStatus = self::checkTransactionStatus($transaction_id);

                $statusCode = isset($apiStatus['statusCode']);

                if($statusCode === "ERROR"){
                    $this->enrollment_status = EnrollmentStatus::ENROLLMENT_ERROR['id'];
                } else if($statusCode === 'COMPLETE'){
                    $this->enrollment_status = EnrollmentStatus::ENROLLMENT_SUCCESS['id'];
                } else if ($statusCode === 'COMPLETE_WITH_ERRORS'){
                    // $enrollment_status = self::enrollment_status['Error'];
                } else {
                    $this->enrollment_status = EnrollmentStatus::IN_PROGRESS['id'];
                }

                //Update Order Line Status
                OrderLines::where('id', $id)->update(['enrollment_status_id' => $this->enrollment_status]);

                // Data to be inserted in the enrollment list
                $insertData = [ 
                    'order_lines_id'    => $id,
                    'dep_company_id'    => $dep_company->id,
                    'sales_order_no'    => $header_data['sales_order_no'],
                    'item_code'         => $header_data['digits_code'],
                    'serial_number'     => $header_data['serial_number'],
                    'transaction_id'    => $transaction_id,
                    'dep_status'        => $dep_status,
                    'enrollment_status' => $this->enrollment_status,
                    'status_message'    => $status_message,
                    'created_by'        => auth()->user()->id,
                    'created_at'        => date('Y-m-d H:i:s')
                ];
                
            
                $enrollmentQuery = EnrollmentList::where('sales_order_no', $header_data['sales_order_no'])
                ->where('serial_number', $header_data['serial_number']);
            
                if (!$enrollmentQuery->exists()) {
                    // If the device does not exist, insert the data
                    EnrollmentList::insert($insertData);
                } else {
                    // If the device exists, update the data
                    $enrollmentQuery->update([
                        'dep_company_id' => $dep_company->id,
                        'transaction_id' => $transaction_id,
                        'dep_status' => $dep_status,
                        'enrollment_status' => $this->enrollment_status,
                        'status_message' => $status_message,
                        'updated_by' => auth()->user()->id,
                        'updated_at' => date('Y-m-d H:i:s'),
                    ]);
                }

                //Insert in Enrollment History 
                EnrollmentHistory::create($insertData);

                $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

                // Count order lines with enrollment status 3 or completed
                $enrollmentStatusSuccess = OrderLines::where('order_id', $orderId)
                    ->where('enrollment_status_id', EnrollmentStatus::ENROLLMENT_SUCCESS['id'])
                    ->count();

                // Check if all order lines have status 3 and update the enrollment status of the order
                if ($enrollmentStatusSuccess === $totalOrderLines) {
                    Order::where('id', $orderId)->update([
                        'enrollment_status' => EnrollmentStatus::ENROLLMENT_SUCCESS['id'],
                        'dep_order' => 1
                    ]);
                }else if ($enrollmentStatusSuccess > 0) {
                    Order::where('id', $orderId)->update([
                        'enrollment_status' => EnrollmentStatus::PARTIALLY_ENROLLED['id'],
                        'dep_order' => 1
                    ]);
                }
            }

            //For Toast Feedback
            switch($this->enrollment_status){
                case '3':
                    $message = EnrollmentStatus::ENROLLMENT_SUCCESS['value'];
                    $status = 'success';
                break;

                case '13':
                    $message = EnrollmentStatus::IN_PROGRESS['value'];
                    $status = 'success';
                break;

                default:
                    $message = EnrollmentStatus::ENROLLMENT_ERROR['value'];
                    $status = 'error';
            }
        
            $data = [
                'message' => $message,
                'status' => $status,
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
            $header_data = OrderLines::where('list_of_order_lines.id',$id)->leftJoin('orders','list_of_order_lines.order_id','orders.id')->first();
            $dep_company = DB::table('dep_companies')->where('id',$header_data['dep_company_id'])->first();
            
            //UPC CODE
            $item_master = DB::table('item_master')->where('digits_code',$header_data['digits_code'])->first();

            if(!$item_master){
                $data = [
                    'message' => 'Item Master not found!',
                    'status' => 'error' 
                ];
                
                return response()->json($data);
            }

            $payload = $this->applePayloadController->generatePayload();
            $counter = Counter::where('id',1)->first();
            $ordersPayload = $this->applePayloadController->generateOrdersPayload($header_data,  $dep_company, 'RE', null, $counter);

            $payload['orders'][] = $ordersPayload;

            $response = $this->appleService->unEnrollDevices($payload);

            //Device Enrollment
            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                $dep_status = self::dep_status['Success'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $this->enrollment_status = EnrollmentStatus::IN_PROGRESS['id'];

            } else if(isset($response['enrollDeviceErrorResponse'])) {  
                $transaction_id = $response['transactionId'];
                $dep_status = self::dep_status['GRX-50025'];
                $status_message = $response['errorMessage'];
                $this->enrollment_status = EnrollmentStatus::ENROLLMENT_ERROR['id'];

            } else {
                $data = [
                    'message' => 'Something went wrong in enrolling the device/s.',
                    'status' =>  'error',
                ];

                return response()->json($data);
            
            }

            // Logs
            $orderId = $header_data['order_id'];
            $encodedPayload = json_encode($payload);
            $encodedResponse = json_encode($response);

            self::generateLogs($orderId, $id, $encodedPayload, $encodedResponse, $transaction_id, $dep_status, 'RE');

            //Check transaction status
            if($this->enrollment_status !== EnrollmentStatus::ENROLLMENT_ERROR['id']) {
                $apiStatus = self::checkTransactionStatus($transaction_id);

                $statusCode = isset($apiStatus['statusCode']);

                if($statusCode === "ERROR"){
                    $this->enrollment_status = EnrollmentStatus::ENROLLMENT_ERROR['id'];
                } else if($statusCode === 'COMPLETE'){
                    $this->enrollment_status = EnrollmentStatus::ENROLLMENT_SUCCESS['id'];
                } else if ($statusCode === 'COMPLETE_WITH_ERRORS'){
                    // $enrollment_status = self::enrollment_status['Error'];
                } else {
                    $this->enrollment_status = EnrollmentStatus::IN_PROGRESS['id'];
                }

                //Update Order Line Status
                OrderLines::where('id', $id)->update(['enrollment_status_id' => $this->enrollment_status ]);

                //Update EnrollmentList 
                $enrollment = EnrollmentList::where('order_lines_id', $id)->first();

                if($enrollment){
                    $enrollment->fill([
                        'transaction_id' => $transaction_id,
                        'dep_status' => $dep_status,
                        'enrollment_status' => $this->enrollment_status,
                        'status_message' => $status_message,
                        'rma_number'     => $header_data['sales_order_no'].'_RE'.$counter->code
                    ]);

                    if($this->enrollment_status == EnrollmentStatus::RETURNED['id']){
                        $enrollment->fill([
                            'returned_by' => auth()->user()->id,
                            'returned_date' => now(),
                        ]);
                    }

                    $enrollment->save();
                }

                //Insert in Enrollment History 
                $insertToHistory = [ 
                    'order_lines_id' => $id,
                    'dep_company_id' => $dep_company->id,
                    'sales_order_no' => $header_data['sales_order_no'],
                    'item_code' => $header_data['digits_code'],
                    'serial_number' => $header_data['serial_number'],
                    'transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'enrollment_status' => $this->enrollment_status,
                    'status_message' => $status_message,
                ];

                EnrollmentHistory::create($insertToHistory);

            }

            //For Toast Feedback
            switch($this->enrollment_status){
                case '5':
                    $message = 'UnEnrollment Success!';
                    $status = 'success';
                break;

                case '13':
                    $message = EnrollmentStatus::IN_PROGRESS['value'];
                    $status = 'success';
                break;

                default:
                    $message = EnrollmentStatus::RETURN_ERROR['value'];
                    $status = 'error';
            }

            //update counter
            $counter = Counter::where('id',1)->increment('code');
        
            $data = [
                'message' => $message,
                'status' => $status,
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


    public function overrideOrder(Request $request){
        $validatedData = $request->validate([
            'serial_number' => 'required|string',
        ]);

        if(!CommonHelpers::isOverride()) {

            $data = [
                'message' => "You don't have permission to override.", 
                'status' => 'error'
            ];
    
            return back()->with($data);
        }

        try {
            $id = $request->id;
            $timestamp = strtotime($request->order_date);
            $formattedDate = date('Y-m-d\TH:i:s\Z', $timestamp);

            $payload = $this->applePayloadController->generatePayload();

            $orderPayload = [
                'orderNumber' => $request->order_number, // sales_order_no from order tb
                'orderDate' => $formattedDate, // order_date from order tb
                'orderType' => 'OV',
                'customerId' => (string)$request->customer_id, // dep company id [can retrieve from list of order lines tb]
                'poNumber' => $request->po_number, // order_ref_no from order tb
                'deliveries' => [],
            ];

            $deliveryPayload = [
                'deliveryNumber' => $request->delivery_number, // dr_number from order tb 
                'shipDate' => $formattedDate, // order_date
                'devices' => [],
            ];

            $devicePayload = [
                'deviceId' => $request->serial_number, // serial_number from list_of_order_lines
                'assetTag' => $request->serial_number, // serial_number from list_of_order_lines
            ];

            // Add device to delivery payload
            $deliveryPayload['devices'][] = $devicePayload;

            // Add delivery to order payload
            $orderPayload['deliveries'][] = $deliveryPayload;
                
            // Add order to payload
            $payload['orders'][] = $orderPayload;

            $response = $this->appleService->overrideOrder($payload);

            Log::info($response);

            // For successful response
            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                $dep_status = self::dep_status['Success'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $this->enrollment_status = EnrollmentStatus::IN_PROGRESS['id'];

   

            }  else if(isset($response['enrollDeviceErrorResponse'])) {  
                $transaction_id = $response['transactionId'];
                $dep_status = self::dep_status['GRX-50025'];
                $status_message = $response['errorMessage'];
                $this->enrollment_status = EnrollmentStatus::OVERRIDE_ERROR['id'];

            } else {
                $data = [
                    'message' => 'Something went wrong in enrolling the device/s.',
                    'status' =>  'error',
                ];
        
                return response()->json($data);
                
            }

            Log::info($this->enrollment_status);

            $header_data = OrderLines::where('list_of_order_lines.id',$id)->leftJoin('orders','list_of_order_lines.order_id','orders.id')->first();

            // Logs
            $orderId = $header_data['order_id'];
            $encodedPayload = json_encode($payload);
            $encodedResponse = json_encode($response);

            self::generateLogs($orderId, $id, $encodedPayload, $encodedResponse, $transaction_id, $dep_status, 'OV');

            //Check transaction status
            if($this->enrollment_status !== EnrollmentStatus::OVERRIDE_ERROR['id']) {
                $apiStatus = self::checkTransactionStatus($transaction_id);

                $statusCode = isset($apiStatus['statusCode']);

                if($statusCode === "ERROR"){
                    $this->enrollment_status = EnrollmentStatus::OVERRIDE_ERROR['id'];
                } else if($statusCode === 'COMPLETE'){
                    $this->enrollment_status = EnrollmentStatus::OVERRIDE['id'];
                    $depDevice = DepDevice::find($request->id);

                    if ($depDevice) {
                        DepDevice::updateDepCompanyId($request->id, $request->customer_id);
                        DepDevice::updateSerialNumber($request->id, $request->serial_number);
                    }
                } else if ($statusCode === 'COMPLETE_WITH_ERRORS'){
                    // $enrollment_status = self::enrollment_status['Error'];
                } else {
                    $this->enrollment_status = EnrollmentStatus::IN_PROGRESS['id'];
                }

                // Update the enrollment status of the order line
                DepDevice::updateEnrollmentStatusId($request->id, $this->enrollment_status);



                $insertToHistory = [ 
                    'order_lines_id' => $id,
                    'dep_company_id' => $header_data->dep_company_id,
                    'sales_order_no' => $header_data->sales_order_no,
                    'item_code' => $header_data->digits_code,
                    'serial_number' => $header_data->serial_number,
                    'transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'enrollment_status' => $this->enrollment_status,
                    'status_message' => $status_message,
                ];

                EnrollmentHistory::create($insertToHistory);

                // $orderLine->update(['enrollment_status_id' => $enrollment_status]);
            }

             //For Toast Feedback
             switch($this->enrollment_status){
                case '11':
                    $message = 'Override Success!';
                    $status = 'success';
                break;

                case '13':
                    $message = EnrollmentStatus::IN_PROGRESS['value'];
                    $status = 'success';
                break;

                default:
                    $message = EnrollmentStatus::OVERRIDE_ERROR['value'];
                    $status = 'error';
            }
        
            $data = [
                'message' => $message,
                'status' => $status,
            ];


            return response()->json($data);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }

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

        try {
            return $this->appleService->checkTransactionStatus($requestData);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function generateLogs($orderId, $ids, $payload, $response, $transaction_id, $dep_status, $orderType){

        if (is_array($ids)) {
            $idsString = implode(',', $ids);
        } else {
            $idsString = $ids;
        }
        
        JsonRequest::insert([
            'order_type' => $orderType,
            'order_id' => $orderId,
            'order_lines_id' => $idsString,
            'data' => $payload,
            'created_at' => now(),
        ]);

        JsonResponse::insert([
            'order_type' => $orderType,
            'order_id' => $orderId,
            'order_lines_id' => $idsString,
            'data' => $response,
            'created_at' => now(),
        ]);

        TransactionLog::insert([
            'order_type' => $orderType,
            'order_id' => $orderId,
            'order_lines_id' => $idsString,
            'dep_transaction_id' => $transaction_id,
            'dep_status' => $dep_status,
            'created_at' => now(),
        ]);
    }

}