<?php

namespace App\Http\Controllers\Auth;

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\PasswordHistory;
use App\Models\User;
use App\Providers\AppServiceProvider;
use Carbon\Carbon;
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
    
        // Check if user is exist
        $users = DB::table("users")->where("email", $credentials['email'])->first();
        if(!$users){
            $error = 'The provided credentials do not match our records!';
            return redirect('login')->withErrors(['message' => $error]);
        }
        // dd(Hash::check($request->password, $users->password));

        // Check if the password is correct
        if (!Hash::check($request->password, $users->password)){
            $message = 'Incorrect Password';
            return redirect('login')->withErrors(['password'=>$message]);
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

        // Check the password is qwerty
        if (Hash::check('qwerty', $users->password) || Hash::check('QWERTY', $users->password)){
            $qwerty_message = 'We have detected that your password is still set to the default, posing a security risk, and recommend updating it immediately to a strong, unique password';
            return redirect('login')->withErrors(['qwerty'=>$users->email, 'qwerty_message' => $qwerty_message]);
        }

        //Check if the password is 3 months old
        if ($users->password_updated_at){
            $passwordLastUpdated = Carbon::parse($users->password_updated_at);
            $threeMonthsAgo = Carbon::now()->subMonths(3);

            if ($passwordLastUpdated->lt($threeMonthsAgo)){
                $qwerty_message = 'Our records indicate that it has been 90 days since you last updated your password. To safeguard your account, we ask that you change your password immediately. Please ensure that your new password is strong and unique to help maintain the security of your account';
                $three_months = '1';
                return redirect('login')->withErrors(['qwerty'=>$users->email, 'qwerty2'=>$request->password, 'qwerty_message' => $qwerty_message, 'three_months' => $three_months]);
            }
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
            'password' => 'Incorrect email or password'
        ])->onlyInput(['email', 'password']);
    }

    public function UpdatePasswordLogin(Request $request){

     
        $user = User::where('email', $request->email)->first();
        $passwordHistories = PasswordHistory::where('user_id', $user->id)->get();

        
        if ($request->is_waive == null){

            $request->validate([
                'email' => 'required',
                'new_password' => 'required|min:8|regex:/[A-Z]/|regex:/[a-z]/|regex:/[0-9]/|regex:/[^A-Za-z0-9]/',
                'confirm_password' => 'required|same:new_password',
            ]);
    
            if (trim(strtolower($request->new_password)) == 'qwerty'){
                return redirect()->back()->withErrors(['error_qwerty' => 'Invalid Password']);
            }
    
            if (Hash::check($request->new_password, $user->password)){
                return redirect()->back()->withErrors(['error_qwerty' => 'The new password cannot be the same as the current password']);
            }
    
           
            if ($passwordHistories){
                foreach($passwordHistories as $passwordHistory) {
                    if (Hash::check($request->new_password, $passwordHistory->password)){
                        return redirect()->back()->withErrors(['error_qwerty' => 'Your new password must be different from any of your previous passwords']);
                    }
                }
            }
    
            PasswordHistory::insert(['user_id'=>$user->id, 'password'=>$user->password, 'created_at'=>now()]);
    
            $user->waiver_count = 0;
            $user->password_updated_at = now();
            $user->password = Hash::make($request->get('new_password'));
            $user->save();

            $session_details = self::getOtherSessionDetails($user->id_adm_privileges);

            if (Auth::attempt(['email' => $user->email, 'password' => $request->new_password])) {
                $request->session()->regenerate();
                Session::put('admin_id', $user->id);
                Session::put('admin_is_superadmin', $session_details['priv']->is_superadmin);
                Session::put("admin_privileges", $session_details['priv']->id);
                Session::put('admin_privileges_roles', $session_details['roles']);
                Session::put('theme_color', $session_details['priv']->theme_color);
                CommonHelpers::insertLog(trans("adm_default.log_login", ['email' => $user->email, 'ip' => $request->server('REMOTE_ADDR')]));
        
                return redirect()->intended('dashboard');
            }
        }

        else {

            if ($user->waiver_count == 4) {
                $error_message = "You can't waive anymore, you need to change your password";
                return redirect('login')->withErrors(['message'=>$error_message]);
            }
            else{

                $session_details = self::getOtherSessionDetails($user->id_adm_privileges);
                $password = is_array($request->pp) ? $request->pp[0] : $request->pp;

                if (Auth::attempt(['email' => $request->email, 'password' => $password])) {
                   
                   
                    $request->session()->regenerate();
                    Session::put('admin_id', $user->id);
                    Session::put('admin_is_superadmin', $session_details['priv']->is_superadmin);
                    Session::put("admin_privileges", $session_details['priv']->id);
                    Session::put('admin_privileges_roles', $session_details['roles']);
                    Session::put('theme_color', $session_details['priv']->theme_color);
                    CommonHelpers::insertLog(trans("adm_default.log_login", ['email' => $user->email, 'ip' => $request->server('REMOTE_ADDR')]));

                     
                    $user->waiver_count = $user->waiver_count + 1;
                    $user->password_updated_at = now();
                    $user->save();
            
                    return redirect()->intended('dashboard');
                }
            }

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
