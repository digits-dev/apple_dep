<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'party_number',
        'customer_code',
        'customer_name',
        'status',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d'
    ];

    public function scopeSearch($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where('customer_name', 'LIKE', "%$search%");
        }
    
        return $query;
    }
}
