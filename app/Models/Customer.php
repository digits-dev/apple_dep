<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'party_number',
        'customer_name',
        'status',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d'
    ];
}
