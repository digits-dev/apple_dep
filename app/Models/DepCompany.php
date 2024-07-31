<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DepCompany extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $casts = [
        'created_at'    => 'datetime:Y-m-d',
        'updated_at'    => 'datetime:Y-m-d',
        'returned_date' => 'datetime:Y-m-d',
    ];

    protected $fillable = [
        'customer_id',
        'dep_company_name',
        'status',
        'created_by',
        'updated_by',
        'created_at',
        'updated_at',
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
    public function scopeSearch($query, $request)
    {
        //search function
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($query) use ($search) {
                foreach ($this->fillable as $field) {
                    if (in_array($field, [ 'created_at', 'updated_at'])) {
                        $query->orWhereDate($field, $search);

                    } elseif($field === 'customer_id') {
                        $query->orWhereHas('customers', function ($query) use ($search) {
                            $query->where('customer_name', 'LIKE', "%$search%");
                        });

                    } elseif (in_array($field, [ 'created_by', 'updated_by'])) {
                        $relation = Str::camel($field);

                        $query->orWhereHas($relation, function ($query) use ($search) {
                            $query->where('name', 'LIKE', "%$search%");
                        });

                    } else {
                        $query->orWhere($field, 'LIKE', "%$search%");
                    }
                }
            });
        } 

        return $query;
    }

    public function customers()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }


}
