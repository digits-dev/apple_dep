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

    const PENDING = [
        'id' => 1,
        'value' => 'Pending'
    ];
    
    const ENROLLMENT_ERROR = [
        'id' => 2,
        'value' => 'Enrollment Error'
    ];
    
    const ENROLLMENT_SUCCESS = [
        'id' => 3,
        'value' => 'Enrollment Success'
    ];
    
    const COMPLETED = [
        'id' => 4,
        'value' => 'Completed'
    ];
    
    const RETURNED = [
        'id' => 5,
        'value' => 'Returned'
    ];
    
    const RETURN_ERROR = [
        'id' => 6,
        'value' => 'Return Error'
    ];
    
    const PARTIALLY_ENROLLED = [
        'id' => 7,
        'value' => 'Partially Enrolled'
    ];
    
    const VOIDED = [
        'id' => 8,
        'value' => 'Voided'
    ];
    
    const CANCELED = [
        'id' => 9,
        'value' => 'Canceled'
    ];
    
    const VOID_ERROR = [
        'id' => 10,
        'value' => 'Void Error'
    ];
    
    const OVERRIDE = [
        'id' => 11,
        'value' => 'Override'
    ];
    
    const OVERRIDE_ERROR = [
        'id' => 12,
        'value' => 'Override Error'
    ];
    
    const IN_PROGRESS = [
        'id' => 13,
        'value' => 'In Progress'
    ];
}
