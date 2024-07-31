<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PullErpErrors extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $casts = [
        'created_at'    => 'datetime:Y-m-d H:i:s',
        'updated_at'    => 'datetime:Y-m-d H:i:s'
    ];
    
    protected $table = 'pull_erp_erros';
    protected $fillable = [
        'order_number', 
        'customer_name',
        'order_ref_no',
        'dr_number',
        'digits_code',
        'item_description',
        'wh_category',
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
    ];

    protected $filterable = [
        'order_number', 
        'customer_name', 
        'order_ref_no', 
        'dr_number', 
        'digits_code', 
        'item_description', 
        'confirm_date', 
        'serial_number',
    ];

    protected $serials = [
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
    ];
   

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($query) use ($search) {
                foreach ($this->fillable as $field) {
                    if ($field === 'confirm_date') {
                        $query->orWhereDate('confirm_date', $search);
                    } else {
                        $query->orWhere($field, 'LIKE', "%$search%");
                    }
                }
            });
        } else {
            
            foreach ($this->filterable as $field) {
                if ($request->filled($field)) {
                    $value = $request->input($field);
    
                    if ($field === 'confirm_date') {
                        $query->whereDate('confirm_date', $value);
                    } elseif ($field === 'serial_number') {
                        $query->where(function($query) use ($value){
                            foreach($this->serials as $serial){
                                $query->orWhere($serial, $value);
                            }
                        });
                    } else {
                        $query->where($field, 'LIKE', "%$value%");
                    }
                }
            }
        }

     

        return $query;
    }

}
