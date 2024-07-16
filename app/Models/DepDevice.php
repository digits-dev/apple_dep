<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DepDevice extends Model
{
    use HasFactory;
    protected $table = 'enrollment_lists';

    protected $filterable = [
        'item_code',
        'item_description',
        'serial_number',
        'customer_name',
    ];

    public function scopeSearchAndFilter($query, $request){
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if ($field === 'item_description') {
                        $query->orWhere('list_of_order_lines.item_description', 'LIKE', "%$search%");
                    } else if ($field === 'customer_name') {
                        $query->orWhere('orders.customer_name', 'LIKE', "%$search%");
                    } else {
                        $query->orWhere('enrollment_lists.' . $field, 'LIKE', "%$search%");
                    }
                }
            });
        }

        foreach ($this->filterable as $field) {
            if ($request->filled($field)) {
                $value = $request->input($field);

                if ($field === 'item_description') {
                    $query->where('list_of_order_lines.item_description', 'LIKE', "%$value%");
                } else if ($field === 'customer_name') {
                    $query->where('orders.customer_name', 'LIKE', "%$value%");
                } else {
                    $query->where('enrollment_lists.' . $field, 'LIKE', "%$value%");
                }
            }
        }
    
        return $query;
    }


    public function scopeGetData($query) {
       return $query->leftJoin('orders', 'orders.sales_order_no', '=', 'enrollment_lists.sales_order_no')
        ->leftJoin('list_of_order_lines', 'list_of_order_lines.serial_number', '=', 'enrollment_lists.serial_number')
        ->select('enrollment_lists.*', 'list_of_order_lines.item_description', 'orders.customer_name')
        ->where('enrollment_lists.enrollment_status', 3);
    }

}
