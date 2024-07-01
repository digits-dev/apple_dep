<?php

namespace App\Http\Controllers\Admin; 
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use DB;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

    class AdminUsersController extends Controller{

        private $table_name;
        private $primary_key;
        public function __construct() {
            $this->table_name  = 'users';
            $this->primary_key = 'id';
        }

        public function getIndex(){
            $data_users = User::getData();
            $privileges = DB::table('adm_privileges')->select('*')->get();
            return Inertia::render('Users/Users', [
                'users' => $data_users,
                'options' => $privileges
            ]);
        }

        public function getAddUser(){
            if(!CommonHelpers::isCreate()) {
                CommonHelpers::redirect(CommonHelpers::adminPath(), trans("ad_default.denied_access"));
            }
            $data = [];
            $data['page_title'] = "Add User";
            $submasters = self::getSubmaster();
            $data = array_merge($submasters, $data);
            return view('admin/users/add-user', $data);

        }

        public function postAddSave(Request $request){
            $users = DB::table("users")->where("email", $request->email)->first();
            $request->validate([
                'email' => 'required',
                'name' => 'required',
                'privilege_id' => 'required'
            ]);
         
            if(!$users){
                User::create([$request]);
                return json_encode(["message"=>"Date Saved!", "type"=>"success"]);
            }else{
                return json_encode(["message"=>"Users Exist!", "type"=>"danger"]);
            }
        }

        public function getEditUser($id){
            $data = [];
            $datA['page_title'] = 'Edit user';
            $data['user'] = User::getDataPerUser($id);
            $submasters = self::getSubmaster();
            $data = array_merge($submasters, $data);
            return view('admin/users/add-user', $data);
        }

        public function postEditSave(Request $request){
            User::where('id',$request->user_id)->update([
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name ?? 'N/A',
                'last_name' => $request->last_name,
                'employee_id' => $request->employee_id,
                'department_id' => $request->department,
                'password'  => hash::make('qwerty'),
                'hire_location_id' => $request->location,
                'id_ad_privileges' => $request->privilege,
                'company_id'       => $request->company,
                'hire_date' => $request->hire_date,
                'position' => $request->position,
                'status' => $request->status
            ]);
            return CommonHelpers::redirect(CommonHelpers::adminpath('users'), "Data updated!", "success");
        }

        public function getSubmaster(){
            $data = [];
            $data['departments'] = DB::table('departments')->select('*')->where('status','ACTIVE')->get();
            $data['privileges'] = DB::table('ad_privileges')->select('*')->get();
            $data['companies'] = DB::table('companies')->select('*')->where('status','ACTIVE')->get();
            $data['locations'] = DB::table('locations')->select('*')->where('status','ACTIVE')->get();
            return $data;
        }

        public function getChangePasswordView(){
            $data = [];
            $data['page_title'] = "Change Password";
            return view('admin/users/change-password', $data);
        }

        public function postUpdatePassword(Request $request){
            $user = User::find(CommonHelpers::myId());
            if (Hash::check($request->all()['current_password'], $user->password)){
          
                $request->validate([
                    'new_password' => 'required',
                    'confirmation_password' => 'required|same:new_password'
                ]);
          
                $user->password = Hash::make($request->get('new_password'));
                $user->save();
  
                return CommonHelpers::redirect(url('/change-password'), "Password Updated, You Will Be Logged-Out.", "success");
                
            } else {
                return CommonHelpers::redirect(url('/change-password'), "Incorrect Current Password.", "danger");
            }
        }

        public function getProfileUser(){
            $data = [];
            $data['page_title'] = "Profile";
            return view('admin/users/profile', $data);
        }

        public function setStatus(Request $request){
            if($request->bulk_action_type == 0){
                foreach($request->Ids as $set_ids){
                    User::where('id',$set_ids)->update(['status'=> 0]);
                }
            }else{
                foreach($request->Ids as $set_ids){
                    User::where('id',$set_ids)->update(['status'=> 1]);
                }
            }
          
           $data = ['msg'=>'Data updated!', 'status'=>'success'];
           return json_encode($data);
        }
    }

?>