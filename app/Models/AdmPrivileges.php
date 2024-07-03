<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmPrivileges extends Model
{
    use HasFactory;

    public function scopeGetData($query){
        return $query;
    }
}
