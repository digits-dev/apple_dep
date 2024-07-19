<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DepDevice extends Model
{
    use HasFactory;
    protected $table = 'list_of_order_lines';

    protected $filterable = [
        'digits_code',
        'item_description',
        'serial_number',
        'customer_name',
    ];

    public function scopeSearchAndFilter($query, $request){
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                   if ($field === 'customer_name') {
                        $query->orWhere('orders.customer_name', 'LIKE', "%$search%");
                    } else {
                        $query->orWhere('list_of_order_lines.' . $field, 'LIKE', "%$search%");
                    }
                }
            });
        }

        foreach ($this->filterable as $field) {
            if ($request->filled($field)) {
                $value = $request->input($field);
                 if ($field === 'customer_name') {
                    $query->where('orders.customer_name', 'LIKE', "%$value%");
                } else {
                    $query->where('list_of_order_lines.' . $field, 'LIKE', "%$value%");
                }
            }
        }
    
        return $query;
    }


    public function scopeGetData($query) {
        return $query->leftJoin('orders', 'orders.id', '=', 'list_of_order_lines.order_id')
        ->leftJoin('enrollment_statuses as es', 'es.id', 'list_of_order_lines.enrollment_status_id')
        ->select('list_of_order_lines.*', 'orders.customer_name', 'es.enrollment_status', 'es.color');
     }

}