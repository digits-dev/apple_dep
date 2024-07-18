<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\Mailer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ResetPasswordController extends Controller
{

    public function sendResetPasswordInstructions(Request $request){
        $key = Str::random(32);
        $iv = Str::random(16);
        
        $request->validate([
            'email' => 'required',
        ]);
        
        $encryptedEmail = openssl_encrypt($request->email, 'aes-256-cbc', $key, 0, $iv);
        $encryptedEmailBase64 = base64_encode($encryptedEmail);

        session(['encryption_key' => $key, 'encryption_iv' => $iv]);
       
        $subject = "Reset Password";
        $cleanEncryptedEmail = str_replace('/', '_', $encryptedEmailBase64);


        Mail::to($request->email)->send(new Mailer($subject,$cleanEncryptedEmail));

    }

    public function resetPassword(Request $request){
        $key = session('encryption_key');
        $iv = session('encryption_iv');

        if (!$key || !$iv) {

            return json_encode(["message"=>"Request expired, please request another one", "type"=>"error"]);
        }

        $encryptedEmail = base64_decode(str_replace('_', '/', $request->email));
        $decryptedEmail = openssl_decrypt($encryptedEmail, 'aes-256-cbc', $key, 0, $iv);

        if ($decryptedEmail === false) {
            return json_encode(["message"=>"Request expired, please request another one", "type"=>"error"]);
        }

        $user = User::where('email', $decryptedEmail)->first();

        $request->validate([
            'new_password' => 'required',
            'confirm_password' => 'required|same:new_password'
        ]);

        $user->password = Hash::make($request->get('new_password'));
        $user->save();

        session()->forget('encryption_key');
        session()->forget('encryption_iv');

        return json_encode(["message"=>"Reset Password Success, you may login your account", "type"=>"success"]);
        
    }

    public function getIndex()
    {
        return Inertia::render('Auth/ResetPassword');
    }

    public function getResetIndex($email){

        return Inertia::render('Auth/ResetPasswordEmail', [
            'email' => $email
        ]);

    }
    
}
