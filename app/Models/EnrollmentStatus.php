<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentStatus extends Model
{
    use HasFactory;
    
    protected $fillable = ['enrollment_status', 'status', 'color'];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d'
    ];
}
