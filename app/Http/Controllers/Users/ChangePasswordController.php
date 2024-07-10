<?php

namespace App\Http\Controllers\Users;

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ChangePasswordController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('Users/ChangePassword');
    }
    
}
