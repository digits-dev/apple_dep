<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class DepDevice extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $table = 'list_of_order_lines';

    protected $filterable = [
        'digits_code',
        'item_description',
        'serial_number',
        'dep_company_id',
        'enrollment_status_id',
        'dep_company_id',
        'customer_id'
    ];

    public function scopeSearchAndFilter($query, $request)
    {
        //search function
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if ($field === 'dep_company_id') {
                        $query->orWhereHas('depCompany', function ($query) use ($search) {
                            $query->where('dep_company_name', 'LIKE', "%$search%");
                        });
                    } else if ($field === 'enrollment_status_id') {
                        $query->orWhereHas('eStatus', function ($query) use ($search) {
                            $query->where('enrollment_status', 'LIKE', "%$search%");
                        });
                    } else if ($field === 'customer_id') {
                        $query->orWhereHas('customer', function ($query) use ($search) {
                            $query->where('customer_name', 'LIKE', "%$search%");
                        });
                    } else {
                        $query->orWhere('list_of_order_lines.' . $field, 'LIKE', "%$search%");
                    }
                }
            });
        } else {

            //filter function
            foreach ($this->filterable as $field) {
                if ($request->filled($field)) {
                    $value = $request->input($field);

                    if (in_array($field, ['dep_company_id', 'enrollment_status_id'])) {
                        $query->where('list_of_order_lines.' . $field, '=', $value);
                    }  else if ($field === 'customer_id') {
                        $query->whereHas('customer', function ($query) use ($value) {
                            $query->where('customers.id', $value);
                        });
                    } else {
                        $query->where('list_of_order_lines.' . $field, 'LIKE', "%$value%");
                    }
                }
            }
        }

        return $query;
    }

    public function scopeSort($query, array $request) {

        if($request['sortBy'] == 'customer'){
            $query->leftJoin('customers', 'customers.id', 'orders.customer_id')
                    ->orderBy('customers.customer_name', $request['sortDir']);
        } else if ($request['sortBy'] == 'dep_company'){
            $query->leftJoin('dep_companies', 'dep_companies.id', 'list_of_order_lines.dep_company_id')
                ->orderBy('dep_companies.dep_company_name', $request['sortDir']);
        } else {
            $query->orderBy($request['sortBy'],  $request['sortDir']);
        }

        return $query;

    }

    public function eStatus()
    {
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status_id', 'id');
    }

    public function depCompany()
    {
        return $this->belongsTo(DepCompany::class, 'dep_company_id', 'id');
    }

    public function customer() {

        return $this->hasOneThrough(Customer::class, Order::class, 'id', 'id', 'order_id', 'customer_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    public function scopeGetData($query)
    {
        return $query->leftJoin('orders', 'orders.id', '=', 'list_of_order_lines.order_id')
            ->leftJoin('enrollment_statuses as es', 'es.id', 'list_of_order_lines.enrollment_status_id')
            ->select('list_of_order_lines.*', 'orders.customer_id', 'es.enrollment_status', 'es.color')
            ->whereNotIn('enrollment_status_id', [8,9]);
    }

    public static function updateDepCompany($depCompanyId, $orderId)
    {
        $order = self::find($orderId);

        if (!$order) {
            return false;
        }

        $order->dep_company_id = $depCompanyId;
        return $order->save();
    }

    public static function updateDepCompanyId($id, $newDepCompanyId)
    {
        $depDevice = self::find($id);
        
        if ($depDevice) {
            $depDevice->dep_company_id = $newDepCompanyId;
            return $depDevice->save();
        }

        return false;
    }

    public static function updateSerialNumber($id, $newSerialNum)
    {
        $depDevice = self::find($id);
        
        if ($depDevice) {
            $depDevice->serial_number = $newSerialNum;
            return $depDevice->save();
        }

        return false;
    }

    public static function updateEnrollmentStatusId($id, $newStatusId)
    {
        $depDevice = self::find($id);
        
        if ($depDevice) {
            $depDevice->enrollment_status_id = $newStatusId;
            return $depDevice->save();
        }

        return false;
    }

}
