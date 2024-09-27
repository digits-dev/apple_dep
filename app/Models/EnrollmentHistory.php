<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class EnrollmentHistory extends Model
{
    use HasFactory;
    use SoftDeletes;

    public $timestamps = false;


    protected $fillable = [
        'order_lines_id',
        'dep_company_id',
        'sales_order_no',
        'item_code',
        'serial_number',
        'transaction_id',
        'dep_status',
        'status_message',
        'enrollment_status',
        'created_by',
        'created_at',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_at = now();
            $model->created_by = auth()->user()->id ?? null;
        });

    }

    public function scopeSearchAndFilter($query, $request)
    {
        //search function
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($query) use ($search) {
                foreach ($this->fillable as $field) {
                    if ($field === 'created_at') {
                        $query->orWhere("enrollment_histories.created_at", 'LIKE', "%$search%");

                    } elseif ($field === 'created_by') {
                        $query->orWhereHas('createdBy', function ($query) use ($search) {
                            $query->where('name', 'LIKE', "%$search%");
                        });

                    } elseif ($field === 'dep_status') {
                        $query->orWhereHas('dStatus', function ($query) use ($search) {
                            $query->where('dep_status', 'LIKE', "%$search%");
                        });

                    } elseif ($field === 'enrollment_status') {
                        $query->orWhereHas('eStatus', function ($query) use ($search) {
                            $query->where('enrollment_status', 'LIKE', "%$search%");
                        });

                    } elseif ($field === 'dep_company_id') {
                        $query->orWhereHas('depCompany', function ($query) use ($search) {
                            $query->where('dep_company_name', 'LIKE', "%$search%");
                        });

                    } else {
                        $query->orWhere($field, 'LIKE', "%$search%");
                    }
                }
            });
        } else {

            //filter function
            foreach ($this->fillable as $field) {
                if ($request->filled($field)) {
                    $value = $request->input($field);

                    if ($field == 'created_at') {
                        $query->whereDate('created_at', $value);

                    } elseif (in_array($field, ['dep_status', 'enrollment_status', 'created_by', 'dep_company_id' ])) {
                        $query->where($field, '=', $value);

                    } else {
                        $query->where($field, 'LIKE', "%$value%");
                    }
                }
            }
        }

        return $query;
    }

    public function scopeSort($query, array $request){

        if (in_array($request['sortBy'], ['created_by', 'updated_by', 'returned_by'])) {
            $query->leftJoin('users', "enrollment_histories.{$request['sortBy']}", '=', 'users.id')
                    ->orderBy('users.name', $request['sortDir']);
        } else if ($request['sortBy'] == 'dep_companies') {
            $query->leftJoin('dep_companies', 'dep_companies.id', 'enrollment_histories.dep_company_id')
                    ->orderBy('dep_companies.dep_company_name', $request['sortDir']);
        } else {
            $query->orderBy($request['sortBy'], $request['sortDir']);
        }

        return $query;
    }

    //ENROLLMENT STATUS
    public function eStatus()
    {
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status', 'id');
    }
    //DEP STATUS
    public function dStatus()
    {
        return $this->belongsTo(DepStatus::class, 'dep_status', 'id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
  
    public function depCompany(){
        return $this->belongsTo(DepCompany::class, 'dep_company_id', 'dep_organization_id');
    }
}