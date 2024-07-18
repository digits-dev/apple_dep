<?php

namespace App\Http\Controllers;

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

}