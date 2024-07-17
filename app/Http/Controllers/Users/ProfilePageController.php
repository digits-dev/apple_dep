<?php

namespace App\Http\Controllers\Users;

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProfilePageController extends Controller
{

    public function getIndex()
    {
        $data = [];

        $data['user'] = DB::table('users')
            ->select('users.*', 'adm_privileges.name as privilege_name')
            ->leftJoin('adm_privileges', 'users.id_adm_privileges', '=', 'adm_privileges.id')
            ->where('users.id', CommonHelpers::myId())
            ->first();

        return Inertia::render('Users/ProfilePage', [
            'user' => $data['user'],
        ]);
    }
    
}
