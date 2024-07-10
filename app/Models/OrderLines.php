<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderLines extends Model
{
    use HasFactory;
    protected $table = 'list_of_order_lines';
    protected $fillable = ['order_id', 'digits_code','item_description','brand','wh_category','quantity','serial_number'];

}
