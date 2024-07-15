<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepStatus extends Model
{
    use HasFactory;

    protected $fillable = ['dep_status', 'status', 'color'];
}
