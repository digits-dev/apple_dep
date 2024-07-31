<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    use HasFactory;

    protected $fillable = ['action_name', 'status'];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d'
    ];
}
