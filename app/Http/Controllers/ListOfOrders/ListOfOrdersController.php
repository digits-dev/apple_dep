<?php

namespace App\Http\Controllers\ListOfOrders;

use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderLines;
use App\Models\User;
use App\Models\EnrollmentList;
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
        $query = Order::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('sales_order_no', 'LIKE', "%$search%");
        });

        $orders = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('ListOfOrders/ListOfOrders', [ 'orders' => $orders, 'queryParams' => request()->query()]);
    }

    
    public function show(Order $order)
    {
        $orderLines = OrderLines::where('order_id', $order->id)->get();
        return Inertia::render('ListOfOrders/OrderDetails', [ 'order' => $order , 'orderLines' => $orderLines]);
    }

    public function edit(Order $order){
       
        $orderLines = OrderLines::where('order_id', $order->id)->get();
        return Inertia::render('ListOfOrders/EnrollReturnDevices', [ 'order' => $order , 'orderLines' => $orderLines]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "List Of Orders - " . date ('Y-m-d H:i:s');
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
        
        
        $results =  DB::connection('oracle')->table('OE_ORDER_HEADERS_ALL as OEH')
            ->select([
                'OEH.ORDER_NUMBER',
                'OEH.CUST_PO_NUMBER',
                'OEL.LINE_NUMBER',
                'OEL.ORDERED_ITEM',
                'MSI.DESCRIPTION',
                DB::raw('MSI.ATTRIBUTE7 AS BRAND'),
                DB::raw('MSI.ATTRIBUTE8 AS WH_CATEGORY'),
                'OEL.SHIPPED_QUANTITY',
                'CustName.PARTY_NAME as Customer_name',
                'wnd.Confirm_Date',
                'wnd.NAME as DR',
                'MTRL.ATTRIBUTE12 as SERIAL1',
                'MTRL.ATTRIBUTE13 as SERIAL2',
                'MTRL.ATTRIBUTE14 as SERIAL3',
                'MTRL.ATTRIBUTE15 as SERIAL4',
                'MTRL.ATTRIBUTE4 as SERIAL5',
                'MTRL.ATTRIBUTE5 as SERIAL6',
                'MTRL.ATTRIBUTE6 as SERIAL7',
                'MTRL.ATTRIBUTE7 as SERIAL8',
                'MTRL.ATTRIBUTE8 as SERIAL9',
                'MTRL.ATTRIBUTE9 as SERIAL10'
            ])
            ->leftJoin('OE_ORDER_LINES_ALL as OEL', 'OEH.HEADER_ID', '=', 'OEL.HEADER_ID')
            ->leftJoin('org_organization_definitions as OOD', 'OEH.SHIP_FROM_ORG_ID', '=', 'OOD.ORGANIZATION_ID')
            ->leftJoin('wsh_delivery_details as wdd', 'OEL.LINE_ID', '=', 'wdd.source_line_id')
            ->leftJoin('wsh_delivery_assignments as wda', 'wdd.delivery_detail_id', '=', 'wda.delivery_detail_id')
            ->leftJoin('wsh_new_deliveries as wnd', 'wda.delivery_id', '=', 'wnd.delivery_id')
            ->leftJoin('hz_cust_accounts as CustAccount', 'wdd.CUSTOMER_ID', '=', 'CustAccount.cust_account_id')
            ->leftJoin('hz_parties as CustName', 'CustAccount.Party_id', '=', 'CustName.PARTY_ID')
            ->leftJoin('MTL_TXN_REQUEST_LINES as MTRL', 'wdd.MOVE_ORDER_LINE_ID', '=', 'MTRL.LINE_ID')
            ->leftJoin('MTL_system_items as MSI', function ($join) {
                $join->on('OEL.INVENTORY_ITEM_ID', '=', 'MSI.INVENTORY_ITEM_ID')
                    ->on('MSI.ORGANIZATION_ID', '=', 'OOD.ORGANIZATION_ID');
            })
            ->where('OEH.ORDER_CATEGORY_CODE', '!=', 'RETURN')
            ->where('OOD.ORGANIZATION_ID', '=', 224)
            ->where('wdd.INV_INTERFACED_FLAG', '=', 'Y')
            ->where('wdd.OE_INTERFACED_FLAG', '=', 'Y')
            ->whereIn('MSI.ATTRIBUTE8', ['APPLE IPHONE', 'APPLE IMAC', 'APPLE IPAD', 'APPLE MAC', 'APPLE DEMO'])
            ->whereBetween('wnd.Confirm_Date', ['2024-01-01 00:00:00', '2024-07-31 23:59:59'])
            ->where(function ($query) {
                $query->orWhereRaw("SUBSTR(CustName.PARTY_NAME, LENGTH(CustName.PARTY_NAME) - 2, 3) = 'CRP'")
                    ->orWhereRaw("SUBSTR(CustName.PARTY_NAME, LENGTH(CustName.PARTY_NAME) - 2, 3) = 'DLR'")
                    ->orWhereRaw("SUBSTR(CustName.PARTY_NAME, LENGTH(CustName.PARTY_NAME) - 2, 3) = 'CON'");
            })
            ->get();
        
            //HEADER
            $uniqueHeaderData = [];
            $header = [];
            $lines = [];

            foreach($results as $key => $item){
                //LINES
                $serialNumbers = [];
                for ($i = 1; $i <= 10; $i++) {
                    $serialKey = "serial" . $i;
                    if (!empty($item->$serialKey)) {
                        $serialNumbers[] = $item->$serialKey;
                    }
                }

                if(count($serialNumbers) == $item->shipped_quantity){
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
            return $lines;
            // $latestRequest = DB::table('orders')->select('id')->orderBy('id','DESC')->first();
            // $latestRequestId = $latestRequest->id ?? 0;
            // foreach($uniqueHeaderData as $insert_data){
            //     $headerId = Order::updateOrInsert(
            //     ['sales_order_no'=>$insert_data->order_number,
            //      'order_ref_no'=>$insert_data->cust_po_number
            //     ],
            //     [
            //         'sales_order_no'    => $insert_data->order_number,
            //         'customer_name'     => $insert_data->customer_name,
            //         'order_ref_no'      => $insert_data->cust_po_number,
            //         'dep_order'         => 1,
            //         'enrollment_status' => "1",
            //         'order_date'        => date("Y-m-d", strtotime($insert_data->confirm_date))
            //     ]);
            // }
 
            // $header_ids = DB::table('orders')->where('id','>', $latestRequestId)->get()->toArray();
            // $insertData = [];
            // foreach($lines as $key => $line){
            //     $search = array_search($line->order_number, array_column($header_ids,'sales_order_no'));
            //     if($search !== false){
            //         $line->header_id = $header_ids[$search]->id;
            //         $insertData[] = $line;
            //     }
            // }
         
            // foreach($insertData as $key => $insertLines){
            //     OrderLines::create(
            //     [
            //         'order_id'          => $insertLines->header_id,
            //         'digits_code'       => $insertLines->ordered_item,
            //         'item_description'  => $insertLines->description,
            //         'brand'             => $insertLines->brand,
            //         'wh_category'       => $insertLines->wh_category,
            //         'quantity'          => $insertLines->final_qty,
            //         'serial_number'     => $insertLines->final_serial
            //     ]);
            // }
    }

    public function enrollDevices($id)
    {
        try {
            // $request = $request->all(); 

            $payload = [
                'requestContext' => [
                    'shipTo' => '0000742682',
                    'timeZone' => '420',
                    'langCode' => 'en',
                ],
                'transactionId' => 'TXN_' . uniqid(),  
                'depResellerId' => '0000742682',
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
                'deliveryNumber' => '30260972',
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
          
            $insertData = [ 
                'sales_order_no' => $header_data['sales_order_no'],
                'item_code' => $header_data['digits_code'],
                'serial_number' => $header_data['serial_number'],
                'transaction_id' => $response['deviceEnrollmentTransactionId'],
                'dep_status' => 1,
                'enrollment_status' => 1,
                'status_message' => $response['enrollDevicesResponse']['statusMessage']
            ];

            EnrollmentList::insert($insertData);

            dd($response);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkTransactionStatus(Response $response)
    {
        $requestData = [
            'requestContext' => [
                'shipTo' => '0000742682', //replace
                'timeZone' => '420',
                'langCode' => 'en',
            ],
            'depResellerId' => '0000742682', //replace
            'deviceEnrollmentTransactionId' => $response->transaction_id
        ];

        try {
            $response = $this->appleService->checkTransactionStatus($requestData);

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}