<?php

namespace App\Http\Controllers\ItemMaster;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\ItemMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    public function getIndex()
    {
        $data = [];
        $query = ItemMaster::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('digits_code', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));


        $data['itemMaster'] = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();
        

        return Inertia::render('ItemMaster/ItemMaster', $data);
    }

    public function addItemMaster(Request $request){


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

    }

    public function updateItemMaster(Request $request, ItemMaster $itemMaster) {

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
    }

  
}
