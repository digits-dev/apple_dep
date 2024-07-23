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

    
  
}
