<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class EnrollmentList extends Model
{
    use HasFactory;
    use SoftDeletes;

    public $timestamps = false;

    protected $casts = [
        'created_at'    => 'datetime:Y-m-d',
        'updated_at'    => 'datetime:Y-m-d',
        'returned_date' => 'datetime:Y-m-d',
    ];

    protected $fillable = [
        'sales_order_no',
        'dep_company_id',
        'item_code',
        'serial_number',
        'rma_number',
        'dep_transact_id',
        'transaction_id',
        'dep_company_id',
        'dep_status',
        'status_message',
        'enrollment_status',
        'order_lines_id',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'returned_date',
        'returned_by',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_at = now();
            $model->created_by = auth()->user()->id ?? null;
        });

        static::updating(function ($model) {
            $model->updated_at = now();
            $model->updated_by = auth()->user()->id ?? null;
        });
    }

    public function scopeSearchAndFilter($query, $request)
    {
        //search function
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($query) use ($search) {
                foreach ($this->fillable as $field) {
                    if (in_array($field, [ 'created_at', 'updated_at', 'returned_date' ])) {
                        $query->orWhereDate("enrollment_lists.$field", $search);

                    } elseif (in_array($field, [ 'created_by', 'updated_by', 'returned_by' ])) {
                        $relation = Str::camel($field);

                        $query->orWhereHas($relation, function ($query) use ($search) {
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

                    if (in_array($field, [ 'created_at', 'updated_at', 'returned_date' ])) {
                        $query->whereDate($field, $value);

                    } elseif (in_array($field, ['dep_status', 'enrollment_status', 'created_by', 'updated_by', 'returned_by', 'dep_company_id' ])) {
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
            $query->leftJoin('users', "enrollment_lists.{$request['sortBy']}", '=', 'users.id')
                    ->orderBy('users.name', $request['sortDir']);
        } else if ($request['sortBy'] == 'dep_companies') {
            $query->leftJoin('dep_companies', 'dep_companies.id', 'enrollment_lists.dep_company_id')
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
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
    public function returnedBy()
    {
        return $this->belongsTo(User::class, 'returned_by', 'id');
    }

    public function depCompany(){
        return $this->belongsTo(DepCompany::class, 'dep_company_id', 'id');
    }

}
