<?php

namespace App\Http\Controllers\Auth;

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Providers\AppServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use DB;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Display the login view.
     */
    public function index()
    {
        if(auth()->check()){
            return redirect()->intended('dashboard');
        }
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function authenticate(Request $request): RedirectResponse
    {
        
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
    
        $users = DB::table("users")->where("email", $credentials['email'])->first();
        if(!$users){
            $error = 'The provided credentials do not match our records!';
            return redirect('login')->withErrors(['message' => $error]);
        }
        $session_details = self::getOtherSessionDetails($users->id_adm_privileges);
        if(!$session_details['priv']){
            $error = 'No privilege set! Please contact Administrator!';
            return redirect('login')->withErrors(['message' => $error]);
        }

        if($users->status == 0 || $users->status == 'INACTIVE'){
            $accDeact = "Account Doesn't Exist/Deactivated";
            Session::flush();
            return redirect('login')->withErrors(['message'=>$accDeact]);
        }

        if (Hash::check('qwerty', $users->password) || Hash::check('QWERTY', $users->password)){
            return redirect('login')->withErrors(['qwerty'=>$users->email]);
        }
     
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            Session::put('admin_id', $users->id);
            Session::put('admin_is_superadmin', $session_details['priv']->is_superadmin);
            Session::put("admin_privileges", $session_details['priv']->id);
            Session::put('admin_privileges_roles', $session_details['roles']);
            Session::put('theme_color', $session_details['priv']->theme_color);
            CommonHelpers::insertLog(trans("adm_default.log_login", ['email' => $users->email, 'ip' => $request->server('REMOTE_ADDR')]));
       
            return redirect()->intended('dashboard');
        }
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records',
            'password' => 'Incorrect email or password'
        ])->onlyInput(['email', 'password']);
    }

    public function UpdatePasswordLogin(Request $request){

        $request->validate([
            'email' => 'required',
            'new_password' => 'required',
            'confirm_password' => 'required|same:new_password',
        ]);

        $user = User::where('email', $request->email)->first();

        if (trim(strtolower($request->new_password)) == 'qwerty'){
            return redirect()->back()->withErrors(['error_qwerty' => 'Invalid Password']);
        }
        
        $user->password_updated_at = now();
        $user->password = Hash::make($request->get('new_password'));
        $user->save();

        $session_details = self::getOtherSessionDetails($user->id_adm_privileges);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->new_password])) {
            $request->session()->regenerate();
            Session::put('admin_id', $user->id);
            Session::put('admin_is_superadmin', $session_details['priv']->is_superadmin);
            Session::put("admin_privileges", $session_details['priv']->id);
            Session::put('admin_privileges_roles', $session_details['roles']);
            Session::put('theme_color', $session_details['priv']->theme_color);
            CommonHelpers::insertLog(trans("adm_default.log_login", ['email' => $user->email, 'ip' => $request->server('REMOTE_ADDR')]));
       
            return redirect()->intended('dashboard');
        }
  
        return redirect()->back()->withErrors(['login' => 'Login attempt failed']);
    }

    public function getOtherSessionDetails($id){
        $data = [];
        $data['priv'] = DB::table("adm_privileges")->where("id", $id)->first();
        $data['roles'] = DB::table('adm_privileges_roles')->where('id_adm_privileges', $id)->join('adm_modules', 'adm_modules.id', '=', 'id_adm_modules')->select('adm_modules.name', 'adm_modules.path', 'is_visible', 'is_create', 'is_read', 'is_edit', 'is_delete', 'is_void', 'is_override')->get();
		return $data;
    }

    public function logout(Request $request): RedirectResponse
    {
        CommonHelpers::insertLog(trans("adm_default.log_logout", ['email' => Auth::user()->email, 'ip' => $request->server('REMOTE_ADDR')]));
        Auth::logout();
        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
        return redirect('login');
    }

    public function endSession(Request $request){

        Auth::logout();
    
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
