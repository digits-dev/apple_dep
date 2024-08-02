<?php

namespace App\Http\Controllers\ItemMaster;

use App\Exports\ItemMasterExport;
use app\Helpers\CommonHelpers;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\ItemMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ItemMasterController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData()
    {
        $query = ItemMaster::query();

        $filter = $query->search(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }
    
    public function export(Request $request)
    {

        $filename = "Item Master - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new ItemMasterExport($data), $filename . '.xlsx');
    }

    public function getIndex(Request $request)
    {

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];

        $data['itemMaster'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        return Inertia::render('ItemMaster/ItemMaster', $data);
    }

    public function addItemMaster(Request $request){

        if(!CommonHelpers::isCreate()) {

            $data = [
                'message' => "You don't have permission to add.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }


        $request->validate([
            'digits_code' => 'required',
            'upc_code_up_1' => 'required',
            'wh_category' => 'required',
            'supplier_item_code' => 'required',
            'item_description' => 'required',
            'brand_description' => 'required',
        ]);
        
        ItemMaster::create([
            'digits_code'=> $request->input('digits_code'),
            'upc_code_up_1'=> $request->input('upc_code_up_1'),
            'upc_code_up_2'=> $request->input('upc_code_up_2'),
            'upc_code_up_3'=> $request->input('upc_code_up_3'),
            'upc_code_up_4'=> $request->input('upc_code_up_4'),
            'upc_code_up_5'=> $request->input('upc_code_up_5'),
            'wh_category'=> $request->input('wh_category'),
            'supplier_item_code'=> $request->input('supplier_item_code'),
            'item_description'=> $request->input('item_description'),
            'brand_description'=> $request->input('brand_description'),
        ]);

        $data = [
            'message' => "Successfully Added Item.", 
            'status' => 'success'
        ];

        return back()->with($data);

    }

    public function updateItemMaster(Request $request, ItemMaster $itemMaster) {


        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'digits_code' => 'required',
            'upc_code_up_1' => 'required',
            'wh_category' => 'required',
            'supplier_item_code' => 'required',
            'item_description' => 'required',
            'brand_description' => 'required',
        ]);

        $itemMaster->update([
            'digits_code'=> $request->input('digits_code'),
            'upc_code_up_1'=> $request->input('upc_code_up_1'),
            'upc_code_up_2'=> $request->input('upc_code_up_2'),
            'upc_code_up_3'=> $request->input('upc_code_up_3'),
            'upc_code_up_4'=> $request->input('upc_code_up_4'),
            'upc_code_up_5'=> $request->input('upc_code_up_5'),
            'wh_category'=> $request->input('wh_category'),
            'supplier_item_code'=> $request->input('supplier_item_code'),
            'item_description'=> $request->input('item_description'),
            'brand_description'=> $request->input('brand_description'),
        ]);

        $data = [
            'message' => "Successfully Updated Item.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }

    public function getItemMasterDataApi(Request $request) {
        $secretKey = config('services.item_master.key');
        $url = config('services.item_master.url');
        
        $uniqueString = time(); 
        // $userAgent = $_SERVER['HTTP_USER_AGENT']; 
   
        // if($userAgent == '' || is_null($userAgent)){
        //     $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36';    
        // }
        // Check if running from command line (CLI)
        if (php_sapi_name() == 'cli') {
            $userAgent = 'Scheduled Task';
        } else {
            $userAgent = $request->header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36');
        }
        $xAuthorizationToken = md5( $secretKey . $uniqueString . $userAgent);
        $xAuthorizationTime = $uniqueString;
        $vars = [
            "your_param"=>1
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_POST, FALSE);
        curl_setopt($ch, CURLOPT_POSTFIELDS,null);
        curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT , 30);

        $headers = [
        'X-Authorization-Token: ' . $xAuthorizationToken,
        'X-Authorization-Time: ' . $xAuthorizationTime,
        'User-Agent: '.$userAgent
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $server_output = curl_exec ($ch);
        curl_close ($ch);

        $response = json_decode($server_output, true);
  
        $data = [];
        if(!empty($response["data"])) {
            foreach ($response["data"] as $key => $value) {
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
                        'supplier_item_code'      => $value['supplier_item_code'],
                        'item_description'        => $value['item_description'],
                        'brand_description'       => $value['brand_description'],
                        'created_at'              => date('Y-m-d H:i:s')
                    ]);
                    DB::commit();
                } catch (\Exception $e) {
                    \Log::debug($e);
                    DB::rollback();
                }
                
            }
        }
        \Log::info('Item Create: executed! items');
    }
  
}
