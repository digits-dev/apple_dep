<?php

namespace App\Services;

use App\Models\ItemMaster;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ItemMasterSyncService
{
    private function getApiData($url, $parameters=[]){
        $secretKey = config('services.item_master.key');
        $uniqueString = time();
   
        $userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : config('services.item_master.user_agent');

        $xAuthorizationToken = md5( $secretKey . $uniqueString . $userAgent);
        $xAuthorizationTime = $uniqueString;

        $datefrom = $parameters['datefrom'] ?? date("Y-m-d");
        $dateto = $parameters['dateto'] ?? date("Y-m-d");

        $apiItems = Http::withHeaders([
            'X-Authorization-Token' => $xAuthorizationToken,
            'X-Authorization-Time' => $xAuthorizationTime,
            'User-Agent' => $userAgent
        ])->get($url,[
            'page' => $parameters['page'] ?? 1,
			'limit' => $parameters['limit'] ?? 1000,
            'datefrom' => $datefrom.' 00:00:00',
            'dateto' => $dateto.' 23:59:59'
        ]);

        return json_decode($apiItems->body(), true);
    }

    public function syncItems(Request $request){
        //pull items from api
        $Items = $this->getApiData(config('services.item_master.url'), [
            'datefrom' => $request->datefrom,
            'dateto' => $request->dateto,
            'limit' => $request->limit,
            'page' => $request->page
        ]);

        if($Items['api_status'] == 0){
            Log::error('Something went wrong: ' . json_encode($Items));
        }

        foreach ($Items['data'] ?? [] as $key => $value) {
            DB::beginTransaction();
            try {
                ItemMaster::updateOrInsert([
                    'digits_code'         => $value['digits_code'] 
                ],
                [
                    'digits_code'             => $value['digits_code'],
                    'upc_code_up_1'           => $value['upc_code'],
                    'upc_code_up_2'           => $value['upc_code2'],
                    'upc_code_up_3'           => $value['upc_code3'],
                    'upc_code_up_4'           => $value['upc_code4'],
                    'upc_code_up_5'           => $value['upc_code5'],
                    'wh_category'             => $value['wh_category'],
                    'supplier_item_code'      => $value['supplier_item_code'],
                    'item_description'        => $value['item_description'],
                    'brand_description'       => $value['brand_description'],
                    'created_at'              => date('Y-m-d H:i:s')
                ]);
                DB::commit();
            } catch (Exception $e) {
                DB::rollBack();
                Log::error($e->getMessage());
            }
        }

        $count = count($Items['data']);

        Log::info("Pull Items Done! $count records!");

        return response()->json([
            'status' => 'success',
            'message' => "Pull Items Done! {$count} records!"
        ], 200);
    }
}
