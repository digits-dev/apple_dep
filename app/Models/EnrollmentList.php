<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentList extends Model
{
    use HasFactory;

    //ENROLLMENT STATUS
    public function eStatus(){
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status', 'id');
    }
    //DEP STATUS
    public function dStatus(){
        return $this->belongsTo(DepStatus::class, 'dep_status', 'id');
    }
}
