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
        'status_message'
    ];

    //ENROLLMENT STATUS
    public function eStatus(){
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status', 'id');
    }
    //DEP STATUS
    public function dStatus(){
        return $this->belongsTo(DepStatus::class, 'dep_status', 'id');
    }
}
