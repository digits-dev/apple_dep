<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    
    protected $fillable = [
        'title',
        'subject',
        'content',
        'changes',
        'fixes',
        'created_by',
        'notif_type',
        'created_at',
        'updated_at',
       
    ];

    public function user(){
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
