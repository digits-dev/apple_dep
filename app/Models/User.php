<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',

    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function scopeGetData($query){
        return $query->leftJoin('adm_privileges','users.id_adm_privileges','adm_privileges.id')
            ->select('users.*',
            'users.name as user_name',
                    'users.id as u_id',
                    'adm_privileges.*',
                    'adm_privileges.name as privilege_name');
                
    }

    public static function boot(){
        parent::boot();
        static::creating(function($model){
            $model->email = request()->input('email');
            $model->name = request()->input('name');
            $model->id_adm_privileges = request()->input('privilege_id');
            $model->password = 'qwerty';
        });
    }
}
