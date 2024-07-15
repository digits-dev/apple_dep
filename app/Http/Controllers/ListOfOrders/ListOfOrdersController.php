<?php

namespace App\Http\Controllers\ListOfOrders;
use App\Helpers\CommonHelpers;
use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
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


class ListOfOrdersController extends Controller
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

    public function getIndex()
    {
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }
        $query = Order::query()->with('status');
        $query->when(request('search'), function ($query, $search) {
            $query->where('sales_order_no', 'LIKE', "%$search%");
        });

        $orders = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        return Inertia::render('ListOfOrders/ListOfOrders', [ 'orders' => $orders, 'queryParams' => request()->query()]);
    }

    
    public function show(Order $order)
    {
        $orderLines = OrderLines::where('order_id', $order->id)->get();
        $jsonSubmitted = JsonRequest::where('order_id', $order->id)->get();
        $jsonReceived= JsonResponse::where('order_id', $order->id)->get();
        $transactionLogs = TransactionLog::where('order_id', $order->id)->get();
        return Inertia::render('ListOfOrders/OrderDetails', compact('order', 'orderLines', 'jsonSubmitted', 'jsonReceived', 'transactionLogs'));
    }

    public function edit(Order $order){
       
        $data = [];
        $data ['order'] = $order;

        $data['orderLines'] = OrderLines::query()
        ->where('order_id', $order->id)
        ->with('status')->orderBy($this->sortBy, $this->sortDir)->get();

        $data['queryParams'] = request()->query();
        
        return Inertia::render('ListOfOrders/EnrollReturnDevices', $data);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename = "List Of Orders - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new OrdersExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = Order::select([
            'id', 
            'sales_order_no', 
            'customer_name', 
            'order_ref_no', 
            'dep_order', 
            'enrollment_status', 
            'order_date'
        ]);

        return $query;
    }

    public function enrollDevices(Request $request)
    {
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
            // Check if multiple orders are provided
            $deliveryPayload = [];
            $devicePayload = [];
            
           
            $devicePayload[] = [
                'deviceId' => $header_data['sales_order_no'],
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
                'customerId' => $header_data['customer_name'],
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
                $dep_status = 1;
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $enrollment_status = 3;
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
                $dep_status = 2;
                $status_message = $response['errorMessage'];
                $enrollment_status = 2;
            }

            // Data to be inserted in the enrollment list
            $insertData = [ 
                'sales_order_no' => $header_data['sales_order_no'],
                'item_code' => $header_data['digits_code'],
                'serial_number' => $header_data['serial_number'],
                'transaction_id' => $transaction_id,
                'dep_status' => $dep_status,
                'enrollment_status' => $enrollment_status,
                'status_message' => $status_message,
                'created_at' => date('Y-m-d H:i:s')
            ];

         
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
                    'transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'enrollment_status' => $enrollment_status,
                    'status_message' => $status_message
                ]);
            }
            
            // Update the enrollment status of the order line
            OrderLines::where('id', $id)->update(['enrollment_status_id' => $enrollment_status]);
            
            // insert the request and response data to the database
            $orderId = $header_data['order_id'];
            $encodedPayload = json_encode($payload);
            $encodedResponse = json_encode($response);
            
            JsonRequest::insert(['order_id' => $orderId, 'data' => $encodedPayload , 'created_at' => date('Y-m-d H:i:s')]);
            JsonResponse::insert(['order_id' => $orderId, 'data' => $encodedResponse , 'created_at' => date('Y-m-d H:i:s')]);
            
            TransactionLog::insert([
                'order_type' => 'OR',
                'order_id' => $orderId,
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
                Order::where('id', $orderId)->update(['enrollment_status' => 3]);
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

    public function bulkEnrollDevices(Request $request){
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
                    ->where('enrollment_status_id', 3)
                    ->exists();
        
                if (!$exists) {
                    $idsOfUniqueLines[] = $orderLines->id;
                }
            }
        
            if (!empty($idsOfUniqueLines)) {
                // Fetch detailed order lines
                $requestData = OrderLines::whereIn('list_of_order_lines.id', $idsOfUniqueLines)
                    ->leftJoin('orders', 'list_of_order_lines.order_id', 'orders.id')
                    ->get();
        
                $header_data = $requestData->first();
        
                $devicePayload = [];

                foreach ($requestData as $key => $orderData) {
                    $devicePayload[$key] = [
                        'deviceId' => $orderData->sales_order_no,
                        'assetTag' => $orderData->serial_number,
                    ];
                }
        
                $formattedDate = date('Y-m-d\TH:i:s\Z', strtotime($header_data->order_date));
        
                $deliveryPayload = [
                    'deliveryNumber' => $header_data->dr_number,
                    'shipDate' => $formattedDate,
                    'devices' => $devicePayload,
                ];
        
                $orderPayload = [
                    'orderNumber' => $header_data->sales_order_no,
                    'orderDate' => $formattedDate,
                    'orderType' => 'OR',
                    'customerId' => $header_data->customer_name,
                    'poNumber' => $header_data->order_ref_no,
                    'deliveries' => [$deliveryPayload],
                ];
        
                $payload = [
                    'requestContext' => [
                        'shipTo' => config('services.apple_api.ship_to'),
                        'timeZone' => config('services.apple_api.timezone'),
                        'langCode' => config('services.apple_api.langCode'),
                    ],
                    'transactionId' => 'TXN_' . uniqid(),
                    'depResellerId' => config('services.apple_api.ship_to'),
                    'orders' => [$orderPayload],
                ];

                $response = $this->appleService->enrollDevices($payload);
        
                if (isset($response['enrollDevicesResponse'])) {
                    $transaction_id = $response['deviceEnrollmentTransactionId'];
                    $dep_status = 1;
                    $status_message = $response['enrollDevicesResponse']['statusMessage'];
                    $enrollment_status = 3; //success
                } else {
                    $transaction_id = $response['transactionId'];
                    $dep_status = 2;
                    $status_message = $response['errorMessage'];
                    $enrollment_status = 2;  //error
                }
        
                foreach ($requestData as $deviceData) {
                    $insertData = [
                        'sales_order_no' => $header_data->sales_order_no,
                        'item_code' => $header_data->digits_code,
                        'serial_number' => $deviceData->serial_number,
                        'transaction_id' => $transaction_id,
                        'dep_status' => $dep_status,
                        'enrollment_status' => $enrollment_status,
                        'status_message' => $status_message,
                        'created_at' => now(),
                    ];
        
                    EnrollmentList::updateOrCreate(
                        [
                            'sales_order_no' => $header_data->sales_order_no,
                            'serial_number' => $deviceData->serial_number,
                        ],
                        $insertData
                    );
                }
        
                // Update enrollment status to success
                OrderLines::whereIn('id', $idsOfUniqueLines)->update(['enrollment_status_id' => 3]);
        
                // Logs
                $orderId = $header_data->order_id;
                $encodedPayload = json_encode($payload);
                $encodedResponse = json_encode($response);
        
                JsonRequest::insert([
                    'order_id' => $orderId,
                    'data' => $encodedPayload,
                    'created_at' => now(),
                ]);
        
                JsonResponse::insert([
                    'order_id' => $orderId,
                    'data' => $encodedResponse,
                    'created_at' => now(),
                ]);
        
                TransactionLog::insert([
                    'order_type' => 'OR',
                    'order_id' => $orderId,
                    'dep_transaction_id' => $transaction_id,
                    'dep_status' => $dep_status,
                    'created_at' => now(),
                ]);
        
                // Update order enrollment status to success if all lines are enrolled successfully
                $totalOrderLines = OrderLines::where('order_id', $orderId)->count();

                $enrollmentStatusSuccess = OrderLines::where('order_id', $orderId)
                    ->where('enrollment_status_id', 3)
                    ->count();

                if ($enrollmentStatusSuccess === $totalOrderLines) {
                    Order::where('id', $orderId)->update(['enrollment_status' => 3]);
                }
        
                $data = [
                    'message' => $enrollment_status == 3 ? 'Enrollment Success!' : 'Enrollment Error!',
                    'status' => $enrollment_status == 3 ? 'success' : 'error',
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

}