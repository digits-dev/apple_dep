<?php

namespace App\Http\Controllers\Admin; 
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use DB;
use App\Models\AdmPrivileges;
use Inertia\Inertia;
use Inertia\Response;

class PrivilegesController extends Controller{
    private $table_name;
    private $primary_key;
    private $sortBy;
    private $sortDir;
    private $perPage;
    public function __construct() {
        $this->table_name  =  'adm_privileges';
        $this->primary_key = 'id';
        $this->sortBy = request()->get('sortBy', 'adm_privileges.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex(){
        $query = AdmPrivileges::getData();
        $query->when(request('search'), function ($query, $search) {
            $query->where('adm_privileges.name', 'LIKE', "%$search%");
        });
        $privileges = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        return Inertia::render('Privileges/Privileges', [
            'privileges' => $privileges,
            'queryParams' => request()->query()
        ]);
    }

    public function createPrivilegesView(){
        if(!CommonHelpers::isCreate()) {
            echo 'error!';
        }
        $id = 0;
        $row = [];
        $modules = DB::table("adm_modules")->where('is_protected', 0)->whereNull('deleted_at')
         ->select("adm_modules.*", 
                DB::raw("(select is_visible from adm_privileges_roles where id_adm_modules = adm_modules.id and id_adm_privileges = '$id') as is_visible"), 
                DB::raw("(select is_create from adm_privileges_roles where id_adm_modules  = adm_modules.id and id_adm_privileges = '$id') as is_create"), 
                DB::raw("(select is_read from adm_privileges_roles where id_adm_modules    = adm_modules.id and id_adm_privileges = '$id') as is_read"), 
                DB::raw("(select is_edit from adm_privileges_roles where id_adm_modules    = adm_modules.id and id_adm_privileges = '$id') as is_edit"), 
                DB::raw("(select is_delete from adm_privileges_roles where id_adm_modules  = adm_modules.id and id_adm_privileges = '$id') as is_delete")
                )
         ->orderby("name", "asc")->get();
         $roles = DB::table('adm_privileges_roles')
         ->whereIn('id_adm_modules', $modules->pluck('id'))
         ->get()
         ->groupBy('id_adm_modules');
        
         return Inertia::render('Privileges/CreatePrivilege', [
            'modules' => $modules,
            'row'=> $row,
            'role_data' => $roles
        ]);
    }

    public function getEdit($id){
        if (!CommonHelpers::isCreate()){
            echo 'error!';
        }
        
        $data = [];
        $data['row'] = DB::table($this->table_name)->where("id", $id)->first();
        $data['page_title'] = "Edit Data";
        $data['modules'] = DB::table("adm_modules")->where('is_protected', 0)->where('deleted_at', null)->select("ad_modules.*")->orderby("name", "asc")->get();
        return view('admin/privileges/create-privilege', $data);
        
    }

    public function postAddSave(Request $request){
    
        if (!CommonHelpers::isCreate()) {
            echo 'error';
        }

        $savePriv = [
            "name" => $request->name,
            "is_superadmin" => $request->is_superadmin,
            "theme_color" => $request->theme_color
        ];

        $id = DB::table($this->table_name)->insertGetId($savePriv);

        //set theme
        Session::put('theme_color', $request->theme_color);

        $priv = $request->privileges;
  
        if ($priv) {
            foreach ($priv as $id_modul => $data) {
                $arrs = [];
                $arrs['is_visible'] = @$data['is_visible'] ?: 0;
                $arrs['is_create'] = @$data['is_create'] ?: 0;
                $arrs['is_read'] = @$data['is_read'] ?: 0;
                $arrs['is_edit'] = @$data['is_edit'] ?: 0;
                $arrs['is_delete'] = @$data['is_delete'] ?: 0;
                $arrs['id_ad_privileges'] = $id;
                $arrs['id_ad_modules'] = $id_modul;
                DB::table("ad_privileges_roles")->insert($arrs);

                $module = DB::table('ad_modules')->where('id', $id_modul)->first();
            }
        }

        //Refresh Session Roles
        $roles = DB::table('ad_privileges_roles')->where('id_ad_privileges', CommonHelpers::myPrivilegeId())->join('ad_modules', 'ad_modules.id', '=', 'id_ad_modules')->select('ad_modules.name', 'ad_modules.path', 'is_visible', 'is_create', 'is_read', 'is_edit', 'is_delete')->get();
        Session::put('admin_privileges_roles', $roles);

        CommonHelpers::redirect(CommonHelpers::mainpath(), "Created Successfully", 'success');
    }

    public function postEditSave(Request $request, $id){
        if (!CommonHelpers::isUpdate()){
            echo 'error!';
        }
    
        $savePriv = [
            "name" => $request->name,
            "is_superadmin" => $request->is_superadmin,
            "theme_color" => $request->theme_color
        ];

        DB::table($this->table_name)->where($this->primary_key, $id)->update($savePriv);

        $priv = $request->privileges;

        // This solves issue #1074
        DB::table("ad_privileges_roles")->where("id_ad_privileges", $id)->delete();

        if ($priv) {

            foreach ($priv as $id_modul => $data) {
                //Check Menu
                $module = DB::table('ad_modules')->where('id', $id_modul)->first();
                $currentPermission = DB::table('ad_privileges_roles')->where('id_ad_modules', $id_modul)->where('id_ad_privileges', $id)->first();

                if ($currentPermission) {
                    $arrs = [];
                    $arrs['is_visible'] = @$data['is_visible'] ?: 0;
                    $arrs['is_create'] = @$data['is_create'] ?: 0;
                    $arrs['is_read'] = @$data['is_read'] ?: 0;
                    $arrs['is_edit'] = @$data['is_edit'] ?: 0;
                    $arrs['is_delete'] = @$data['is_delete'] ?: 0;
                    DB::table('ad_privileges_roles')->where('id', $currentPermission->id)->update($arrs);
                } else {
                    $arrs = [];
                    $arrs['is_visible'] = @$data['is_visible'] ?: 0;
                    $arrs['is_create'] = @$data['is_create'] ?: 0;
                    $arrs['is_read'] = @$data['is_read'] ?: 0;
                    $arrs['is_edit'] = @$data['is_edit'] ?: 0;
                    $arrs['is_delete'] = @$data['is_delete'] ?: 0;
                    $arrs['id_ad_privileges'] = $id;
                    $arrs['id_ad_modules'] = $id_modul;
                    DB::table("ad_privileges_roles")->insert($arrs);
                }
            }
        }

        //Refresh Session Roles
        if ($id == CommonHelpers::myPrivilegeId()) {
            $roles = DB::table('ad_privileges_roles')->where('id_ad_privileges', CommonHelpers::myPrivilegeId())->join('ad_modules', 'ad_modules.id', '=', 'id_ad_modules')->select('ad_modules.name', 'ad_modules.path', 'is_visible', 'is_create', 'is_read', 'is_edit', 'is_delete')->get();
            Session::put('admin_privileges_roles', $roles);

            Session::put('theme_color', $request->theme_color);
        }

        CommonHelpers::redirect(CommonHelpers::mainpath(), "Data updated!", [
            'module' => "Privilege",
        ], 'success');
    }
}

?>