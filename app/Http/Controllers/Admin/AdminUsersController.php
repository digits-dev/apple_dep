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
        private $sortBy;
        private $sortDir;
        private $perPage;

        public function __construct() {
            $this->table_name  = 'users';
            $this->primary_key = 'id';
            $this->sortBy = request()->get('sortBy', 'users.created_at');
            $this->sortDir = request()->get('sortDir', 'desc');
            $this->perPage = request()->get('perPage', 10);
        }
        
      
    
        public function getIndex(){
            $query = User::getData();
            $query->when(request('search'), function ($query, $search) {
                $query->where('users.name', 'LIKE', "%$search%")
                    ->orWhere('users.email', "LIKE", "%$search%");
            });
    
            $data_users = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
            $submasters = self::getSubmaster();
            return Inertia::render('Users/Users', [
                'users' => $data_users,
                'options' => ['privileges'=>$submasters['privileges'], 'status'=>$submasters['status']],
                'queryParams' => request()->query()
            ]);
        }

        public function postGetUsers(){
            $query = User::getData();
            $query->when(request('search'), function ($query, $search) {
                $query->where('users.name', 'LIKE', "%$search%")
                    ->orWhere('users.email', "LIKE", "%$search%");
            });

            $data_users = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
            return ['users'=>$data_users,'queryParams' => request()->query()];
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
                return json_encode(["message"=>"Data Saved!", "type"=>"success"]);
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
            $oldPass = User::where('id',$request->u_id)->first();
            if($request->password){
                $password = hash::make($request->password);
            }else{
                $password = $oldPass->password;
            }
            $update = User::where('id',$request->u_id)->update([
                'name' => $request->name,
                'email' => $request->email,
                'password'  => $password,
                'id_adm_privileges' => $request->privilege_id,
                'status'  => $request->status,
              
            ]);
            if($update){
                return json_encode(["message"=>"Update success!", "type"=>"success"]);
            }
        }

        public function getSubmaster(){
            $data = [];
            $data['status'] = DB::table('statuses')->select('*')->get();
            $data['privileges'] = DB::table('adm_privileges')->select('*')->get();
    
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
                return json_encode(["message"=>"Password Updated, You Will Be Logged-Out.", "type"=>"success"]);
            } else {
                return json_encode(["message"=>"Incorrect Current Password.", "type"=>"error"]);
            }
        }

        public function getProfileUser(){
            $data = [];
            $data['page_title'] = "Profile";
            return view('admin/users/profile', $data);
        }

        public function setStatus(Request $request){
   
            if($request->bulk_action_type == 1){
                foreach($request->Ids as $set_ids){
                    User::where('id',$set_ids)->update(['status'=> 1]);
                }
            }else{
                foreach($request->Ids as $set_ids){
                    User::where('id',$set_ids)->update(['status'=> 0]);
                }
            }
          
           $data = ['message'=>'Data updated!', 'status'=>'success'];
           return json_encode($data);
        }
    }

?>