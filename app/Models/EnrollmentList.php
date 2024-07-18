<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentList extends Model
{
    use HasFactory;

    protected $fillable = [
        'sales_order_no', 
        'item_code', 
        'serial_number',
        'transaction_id',
        'dep_status', 
        'enrollment_status', 
        'status_message',
        'order_lines_id',
        'created_by',
        'updated_by'
    ];
    
    protected $filterable = [
        'sales_order_no',
        'item_code',
        'serial_number',
        'transaction_id',
        'dep_status',
        'status_message',
        'enrollment_status',
        'created_date',
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

    //ENROLLMENT STATUS
    public function eStatus(){
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status', 'id');
    }
    //DEP STATUS
    public function dStatus(){
        return $this->belongsTo(DepStatus::class, 'dep_status', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        // Listen for saving event
        static::saving(function ($enrollment) {
            if (!$enrollment->exists) {
                $enrollment->created_by = auth()->user()->id;
                $enrollment->created_at = now();
            }
        });

        // Listen for updating event
        static::updating(function ($enrollment) {
            $enrollment->updated_by = auth()->user()->id;
            $enrollment->updated_at = now();
        });
    }
}
