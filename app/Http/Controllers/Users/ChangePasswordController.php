<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChangePasswordController extends Controller
{

    public function getIndex()
    {
        $data = [];
        
        return Inertia::render('Users/ChangePassword');
    }

    public function postChangePassword(Request $request) {
        dd($request);
        
    }
}
