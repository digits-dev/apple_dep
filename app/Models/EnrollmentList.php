<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class EnrollmentList extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
        'updated_at' => 'datetime:Y-m-d',
        'returned_date' => 'datetime:Y-m-d',
    ];

    protected $fillable = [
        'sales_order_no', 
        'item_code', 
        'serial_number',
        'transaction_id',
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
            $model->created_by = auth()->user()->id;
        });

        static::updating(function ($model) {
            $model->updated_at = now();
            $model->updated_by = auth()->user()->id;
        });
    }

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->fillable as $field) {
                    if (in_array($field, ['created_at', 'updated_at', 'returned_date'])) {
                        $query->orWhereDate($field, $search);
                        
                    } elseif (in_array($field, ['created_by', 'updated_by', 'returned_by'])) {
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

                    } else {
                        $query->orWhere($field, 'LIKE', "%$search%");
                    }
                }
            });
        }

        foreach ($this->fillable as $field) {
            if (in_array($field, ['created_at', 'updated_at', 'returned_date']) && $request->filled($field)) {
                $date = $request->input($field);
                $query->whereDate('created_at', $date);

            } elseif (in_array($field, ['created_by', 'updated_by', 'returned_by']) && $request->filled($field)) {
                $value = $request->input($field);
                $query->where($field, '=', $value);

            } else if ($request->filled($field)) {
                $value = $request->input($field);
                $query->where($field, 'LIKE', "%$value%");

            }
        }
    
        return $query;
    }

    //ENROLLMENT STATUS
    public function eStatus(){
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status', 'id');
    }
    //DEP STATUS
    public function dStatus(){
        return $this->belongsTo(DepStatus::class, 'dep_status', 'id');
    }

    public function createdBy(){
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updatedBy(){
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
    public function returnedBy(){
        return $this->belongsTo(User::class, 'returned_by', 'id');
    }

}
