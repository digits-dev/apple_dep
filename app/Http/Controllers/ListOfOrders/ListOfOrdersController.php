<?php

namespace App\Http\Controllers\ListOfOrders;

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

        $query = OrderLines::query()->where('order_id', $order->id)->with('status');
        $data['orderLines'] = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

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

    public function getListOfOrdersFromErp(){ 
        
        $results =  Order::getOrdersFromErp();

        //HEADER
        $header = [];
        $lines = [];

        foreach($results as $key => $item){
            //COUNT SERIALs
            $serialNumbers = [];
            for ($i = 1; $i <= 10; $i++) {
                $serialKey = "serial" . $i;
                if (!empty($item->$serialKey)) {
                    $serialNumbers[] = $item->$serialKey;
                }
            }

            // Check for duplicate serial numbers
            $serialCount = array_count_values($serialNumbers);
            $duplicates = array_filter($serialCount, function($count) {
                return $count > 1;
            });

            if(count($serialNumbers) === (int)$item->shipped_quantity && empty($duplicates)){
                for($i = 0; $i < (int)$item->shipped_quantity; $i++){
                    $res = clone $item;
                    $res->final_qty = 1;
                    $serial = "serial" . ($i + 1);
                    if (property_exists($item, $serial)) {
                        $res->final_serial = $item->$serial;
                    } else {
                        $res->final_serial = null; // 
                    }

                    $lines[] = $res;
                }  
            }
            
            $identifier = $item->order_number . '-' . $item->cust_po_number;
            if (!in_array($identifier, $header)) {
                $header[] = $identifier;
                $uniqueHeaderData[] = $item;
            }
        }

        //CHECK IF ORDER NUMBER AND SERIAL IS DUPLICATE
        $linesIdentifier = [];
        foreach($lines as $key => $line){
            $duplicateIdentifer = $line->order_number . '-' . $line->cust_po_number . '-' . $line->final_serial;
            if (!in_array($duplicateIdentifer, $linesIdentifier)) {
                $linesIdentifier[] = $duplicateIdentifer;
                $finalDataLines[] = $line;
            }
        }

        $latestRequest = DB::table('orders')->select('id')->orderBy('id','DESC')->first();
        $latestRequestId = $latestRequest->id ?? 0;
        foreach($uniqueHeaderData as $insert_data){
            $headerId = Order::updateOrInsert(
            ['sales_order_no'=>$insert_data->order_number,
             'order_ref_no'=>$insert_data->cust_po_number
            ],
            [
                'sales_order_no'    => $insert_data->order_number,
                'customer_name'     => $insert_data->customer_name,
                'order_ref_no'      => $insert_data->cust_po_number,
                'dr_number'         => $insert_data->dr,
                'dep_order'         => 1,
                'enrollment_status' => "1",
                'order_date'        => date("Y-m-d", strtotime($insert_data->confirm_date))
            ]);
        }

        $header_ids = DB::table('orders')->where('id','>', $latestRequestId)->get()->toArray();
        $insertData = [];
        foreach($finalDataLines as $key => $line){
            $search = array_search($line->order_number, array_column($header_ids,'sales_order_no'));
            if($search !== false){
                $line->header_id = $header_ids[$search]->id;
                $insertData[] = $line;
            }
        }
        
        foreach($insertData as $key => $insertLines){
            OrderLines::create(
            [
                'order_id'          => $insertLines->header_id,
                'digits_code'       => $insertLines->ordered_item,
                'item_description'  => $insertLines->description,
                'brand'             => $insertLines->brand,
                'wh_category'       => $insertLines->wh_category,
                'quantity'          => $insertLines->final_qty,
                'serial_number'     => $insertLines->final_serial,
                'enrollment_status_id' => 1,

            ]);
        }
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

            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                $dep_status = $response['enrollDevicesResponse']['statusCode'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $enrollment_status = 3;
            }
            // else if (isset($response['enrollDeviceErrorResponse'])){
            //     $dep_status = $response['errorCode'];
            //     $status_message = $response['errorMessage'];
            //     $enrollment_status = 0;
            // }
            else {
                $transaction_id = $response['transactionId'];
                $dep_status = $response['errorCode'];
                $status_message = $response['errorMessage'];
                $enrollment_status = 2;
            }

            $insertData = [ 
                'sales_order_no' => $header_data['sales_order_no'],
                'item_code' => $header_data['digits_code'],
                'serial_number' => $header_data['serial_number'],
                'transaction_id' => $transaction_id,
                'dep_status' => 1,
                'enrollment_status' => $enrollment_status,
                'status_message' => $status_message,
                'created_at' => date('Y-m-d H:i:s')
            ];

            EnrollmentList::insert($insertData);
            OrderLines::where('id', $id)->update(['enrollment_status_id' => $enrollment_status]);
            
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
            
            $data = ['message'=>   $enrollment_status == 3  ?'Enrollment Success! ' : 'Enrollment Error! ', 'status'=> $enrollment_status == 3 ? 'success' : 'error'];

            return response()->json($data);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function bulkEnrollDevices(Request $request)
    {
        try {
            $ids = $request->input('ids');

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

            $query = OrderLines::whereIn('list_of_order_lines.id', $ids)->leftJoin('orders','list_of_order_lines.order_id','orders.id');

            $requestData = $query->get();
            $header_data = $query->first();

            $deliveryPayload = [];
            $devicePayload = [];
            
            foreach ($requestData ?? [] as $key => $orderData) {
                $devicePayload[$key] = [
                    'deviceId' => $orderData['sales_order_no'],
                    'assetTag' => $orderData['serial_number'],
                ];
            }
                
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

            $response = $this->appleService->enrollDevices($payload);

            if (isset($response['enrollDevicesResponse'])) {
                $transaction_id = $response['deviceEnrollmentTransactionId'];
                $dep_status = $response['enrollDevicesResponse']['statusCode'];
                $status_message = $response['enrollDevicesResponse']['statusMessage'];
                $enrollment_status = 3; //success
            }else {
                $transaction_id = $response['transactionId'];
                $dep_status = $response['errorCode'];
                $status_message = $response['errorMessage'];
                $enrollment_status = 2;  //error
            }

            foreach ($requestData ?? [] as $deviceData) {
                $insertData = [ 
                    'sales_order_no' => $header_data['sales_order_no'],
                    'item_code' => $header_data['digits_code'],
                    'serial_number' => $deviceData['serial_number'],
                    'transaction_id' => $response['deviceEnrollmentTransactionId'],
                    'dep_status' => 1,
                    'enrollment_status' =>  $enrollment_status,
                    'status_message' => $response['enrollDevicesResponse']['statusMessage']
                ];
    
                EnrollmentList::insert($insertData);

            }

            //update enrollment status to success
            OrderLines::whereIn('id', $ids)->update(['enrollment_status_id' => 3]);

            //logs
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
          
            $data = ['message'=>'Enrollment Success!', 'status'=>'success'];

            return response()->json($data);
       
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}