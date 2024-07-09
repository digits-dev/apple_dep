<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmModules extends Model
{
    use HasFactory;
    public function scopeGetData($query){
        return $query->where('is_protected', 0)->where('deleted_at', null);
    }
}
