<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdmLogs extends Model
{
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class, 'id_adm_users', 'id');
    }
 
}
