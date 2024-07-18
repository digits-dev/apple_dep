<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemMaster extends Model
{
    use HasFactory;

    protected $table = 'item_master';

    protected $fillable = [
        'digits_code',
        'upc_code_up_1',
        'upc_code_up_2',
        'upc_code_up_3',
        'upc_code_up_4',
        'upc_code_up_5',
        'wh_category',
        'supplier_item_code',
        'item_description',
        'brand_description',
    ];

    protected $filterable = [
        'digits_code',
        'upc_code_up_1',
        'upc_code_up_2',
        'upc_code_up_3',
        'upc_code_up_4',
        'upc_code_up_5',
        'wh_category',
        'supplier_item_code',
        'item_description',
        'brand_description',
    ];

    public function scopeSearch($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    $query->orWhere($field, 'LIKE', "%$search%");
                }
            });
        }
    
        return $query;
    }
}

