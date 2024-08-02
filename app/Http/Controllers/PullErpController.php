<?php

namespace App\Http\Controllers;

use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderLines;
use App\Models\PullErpErrors;
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


class PullErpController extends Controller
{
    protected $appleService;
    public function __construct(AppleDeviceEnrollmentService $appleService){
        $this->appleService = $appleService;
    }

    public function getListOfOrdersFromErpv2(){ 
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
        foreach($lines as $key => $line){
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

    public function getListOfOrdersFromErpv1(){ 
        $orders =  Order::getOrdersFromErp();
        //FIND SAME SERIAL IN SAME LINES
        $results = [];
        $duplicateSerialOrders = [];
        foreach ($orders as $order) {
            $serials = array_filter([
                $order->serial1,
                $order->serial2,
                $order->serial3,
                $order->serial4,
                $order->serial5,
                $order->serial6,
                $order->serial7,
                $order->serial8,
                $order->serial9,
                $order->serial10
            ]);
        
            // Check if all serials are unique
            if (count($serials) !== count(array_unique($serials))) {
                $order->errors_message = "Duplicate serial in Order";
                $duplicateSerialOrders[] = $order;
            } else {
                $results[] = $order;
            }
        }
        //SAVE DUPLICATES FOR CHECKING
        if($duplicateSerialOrders){
           self::savePullErpErrors($duplicateSerialOrders);
        }
   
        //FIND Result array in duplicate serial orders serial via order number and then add to duplicate serial orders
        $addToDuplicateSerial = [];
        foreach ($results as $key => $item1) {
            foreach ($duplicateSerialOrders as $item2) {
                if ($item1->order_number == $item2->order_number) {
                    $item1->errors_message = "Duplicate serial in Order";
                    $addToDuplicateSerial[] = $item1;
                    unset($results[$key]); 
                }
            }
        }
        //SAVE AddtoDuplicate
        if($addToDuplicateSerial){
            self::savePullErpErrors($addToDuplicateSerial);
        }

        $lines = [];
        $linesNotEqualSerialAndQuantity = [];
        foreach($results as $key => $item){
            $serialNumbers = [];
            $sameCodeAndSerials = [];
            for ($i = 1; $i <= 10; $i++) {
                $serialKey = "serial" . $i;
                if (!empty($item->$serialKey)) {
                    $serialNumbers[] = $item->$serialKey;
                }
            }
          
            if(count($serialNumbers) === (int)$item->shipped_quantity){
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
            }else{
                $item->errors_message = "Not equal serials and shipped_quantity";
                $linesNotEqualSerialAndQuantity[] = $item;
            }
        }
        //SAVE NOT SAME SERIALS AND QUANTITY
        if($linesNotEqualSerialAndQuantity){
            self::savePullErpErrors($linesNotEqualSerialAndQuantity);
        }

        //CHECK IF ORDER NUMBER AND SERIAL IS DUPLICATE
        $header = [];
        $linesIdentifier = [];
        foreach($lines as $key => $line){
            //GET HEADER
            $identifier = $line->order_number . '-' . $line->cust_po_number;
            if (!in_array($identifier, $header)) {
                $header[] = $identifier;
                $uniqueHeaderData[] = $line;
            }
            //GET LINES
            $duplicateIdentifer = $line->order_number . '-' . $line->cust_po_number . '-' . $line->final_serial;
            if (!in_array($duplicateIdentifer, $linesIdentifier)) {
                $linesIdentifier[] = $duplicateIdentifer;
                $finalDataLines[] = $line;
            }
        }
     
        //SAVE HEADER
        $latestRequest = DB::table('orders')->select('id')->orderBy('id','DESC')->first();
        $latestRequestId = $latestRequest->id ?? 0;
        foreach($uniqueHeaderData as $insert_data){
            //CHECK IF ORDER EXIST
            $isExist = Order::where('sales_order_no', $insert_data->order_number)
					->where('order_ref_no', $insert_data->cust_po_number)
					->exists();
            if(!$isExist){
                $customer = DB::table('customers')->where('customer_name',trim($insert_data->customer_name))->first();
                $headerId = Order::create(
                    [
                        'sales_order_no'    => $insert_data->order_number,
                        'customer_id'       => $customer->id ?? '',
                        'order_ref_no'      => $insert_data->cust_po_number,
                        'dr_number'         => $insert_data->dr,
                        'dep_order'         => 0,
                        'enrollment_status' => 1,
                        'order_date'        => date("Y-m-d", strtotime($insert_data->confirm_date))
                    ]
                );
            }
           
        }
        //SAVE LINES
        $header_ids = DB::table('orders')->where('id','>', $latestRequestId)->get()->toArray();
        if($header_ids){
            $insertData = [];
            foreach($finalDataLines as $key => $line){
                $search = array_search($line->order_number, array_column($header_ids,'sales_order_no'));
                if($search !== false){
                    $line->header_id = $header_ids[$search]->id;
                    $insertData[] = $line;
                }
            }
            
            foreach($insertData as $key => $insertLines){
                $customer    = DB::table('customers')->where('customer_name',trim($insertLines->customer_name))->first();
                $dep_company = DB::table('dep_companies')->where('customer_id',$customer->id)->first();
                OrderLines::create(
                [
                    'order_id'          => $insertLines->header_id,
                    'dep_company_id'    => $dep_company->id ?? '',
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
    }

    public function savePullErpErrors($params){
        foreach($params as $key => $insert){
            $isExist = PullErpErrors::where('order_number', $insert->order_number)
            ->where('order_ref_no', $insert->cust_po_number)
            ->where('digits_code', $insert->ordered_item)
            ->where('serial1', $insert->serial1)
            ->where('serial2', $insert->serial2)
            ->where('serial3', $insert->serial3)
            ->where('serial4', $insert->serial4)
            ->where('serial5', $insert->serial5)
            ->where('serial6', $insert->serial6)
            ->where('serial7', $insert->serial7)
            ->where('serial8', $insert->serial8)
            ->where('serial9', $insert->serial9)
            ->where('serial10', $insert->serial10)
            ->exists();
            if(!$isExist){
                PullErpErrors::create(
                    [
                        'order_number'      => $insert->order_number,
                        'customer_name'     => $insert->customer_name,
                        'line_number'       => $insert->line_number,
                        'order_ref_no'      => $insert->cust_po_number,
                        'dr_number'         => $insert->dr,
                        'digits_code'       => $insert->ordered_item,
                        'item_description'  => $insert->description,
                        'brand'             => $insert->brand,
                        'wh_category'       => $insert->wh_category,
                        'shipped_quantity'  => $insert->shipped_quantity,
                        'confirm_date'      => $insert->confirm_date,
                        'serial1'           => $insert->serial1,
                        'serial2'           => $insert->serial2,
                        'serial3'           => $insert->serial3,
                        'serial4'           => $insert->serial4,
                        'serial5'           => $insert->serial5,
                        'serial6'           => $insert->serial6,
                        'serial7'           => $insert->serial7,
                        'serial8'           => $insert->serial8,
                        'serial9'           => $insert->serial9,
                        'serial10'          => $insert->serial10,
                        'errors_message'    => $insert->errors_message
                    ]
                );
            }
           
        }
    }

    

}