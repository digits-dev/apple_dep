<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PullErpErros extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $casts = [
        'created_at'    => 'datetime:Y-m-d H:i:s',
        'updated_at'    => 'datetime:Y-m-d H:i:s'
    ];
    
    protected $table = 'pull_erp_erros';
    protected $fillable = ['order_number', 
                           'customer_name',
                           'line_number',
                           'order_ref_no',
                           'dr_number',
                           'digits_code',
                           'item_description',
                           'brand',
                           'wh_category',
                           'shipped_quantity',
                           'serial_number', 
                           'confirm_date',                         
                           'serial1',
                           'serial2',
                           'serial3',
                           'serial4',
                           'serial5',
                           'serial6',
                           'serial7',
                           'serial8',
                           'serial9',
                           'serial10',
                           'errors_message',
                           'created_at',
                           'updated_at'
                          ];
    protected $filterable = [
        'order_number',
        'customer_name',
        'order_ref_no',
        'dr_number',
        'digits_code',
        'item_description',
        'brand',
        'wh_category',
        'confirm_date',
        'shipped_quantity',
        'serial1',
        'serial2',
        'serial3',
        'serial4',
        'serial5',
        'serial6',
        'serial7',
        'serial8',
        'serial9',
        'serial10',
        'errors_message'
    ];

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if ($field === 'created_date') {
                        $query->orWhereDate('created_at', $search);
                    } else {
                        $query->orWhere($field, 'LIKE', "%$search%");
                    }
                }
            });
        }

        foreach ($this->filterable as $field) {
            if ($field === 'created_date' && $request->filled('created_date')) {
                $date = $request->input($field);
                $query->whereDate('created_at', $date);
            } elseif ($request->filled($field)) {
                $value = $request->input($field);
                $query->where($field, 'LIKE', "%$value%");
            }
        }

        return $query;
    }

}
