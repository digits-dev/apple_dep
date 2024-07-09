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
        $data = [];

        return Inertia::render('Users/ChangePassword');
    }

    public function postChangePassword(Request $request) {

        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:5|confirmed',
        ]);

        $user = User::find(CommonHelpers::myId());

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['errors' => ['current_password' => ['The current password is incorrect.']]], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password changed successfully.']);
        
    }
}
