<?php

namespace App\Http\Controllers\Admin; 
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use DB;
use Inertia\Inertia;
use Inertia\Response;

class MenusController extends Controller{
    private $sortBy;
    private $sortDir;
    private $perPage;
    public function __construct() {
        $this->table_name  = 'adm_modules';
        $this->primary_key = 'id';
        $this->sortBy = request()->get('sortBy', 'adm_modules.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public static function sidebarMenu(){
        return CommonHelpers::sidebarMenu();
    }

    public function getIndex(Request $request){
   
        if (!CommonHelpers::isView()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), 'Denied Access');
        }

        $privileges = DB::table('adm_privileges')->get();

        $id_adm_privileges = $request->id_adm_privileges;
        $id_adm_privileges = ($id_adm_privileges) ?: CommonHelpers::myPrivilegeId();

        $menu_active = DB::table('adm_menuses')->where('parent_id', 0)->where('is_dashboard',0)->where('is_active', 1)->orderby('sorting', 'asc')->get();

        foreach ($menu_active as &$menu) {
            $child = DB::table('adm_menuses')->where('is_active', 1)->where('parent_id', $menu->id)->orderby('sorting', 'asc')->get();
            if (count($child)) {
                foreach($child as &$c){
                    $priv = DB::table('adm_menus_privileges')
                    ->join('adm_privileges','adm_privileges.id','=','adm_menus_privileges.id_adm_privileges')
                    ->where('id_adm_menus',$c->id)->pluck('adm_privileges.name')->toArray();
                    if (count($priv)) {
                        $c->privileges = $priv;
                    }
                }
                $menu->children = $child;
                $menu->children = $child;
            }
            $priv = DB::table('adm_menus_privileges')
            ->join('adm_privileges','adm_privileges.id','=','adm_menus_privileges.id_adm_privileges')
            ->where('id_adm_menus',$menu->id)->pluck('adm_privileges.name')->toArray();
            if (count($priv)) {
                $menu->privileges = $priv;
            }
        }

        $menu_inactive = DB::table('adm_menuses')->where('parent_id', 0)->where('is_active', 0)->orderby('sorting', 'asc')->get();

        foreach ($menu_inactive as &$menu) {
            $child = DB::table('adm_menuses')->where('is_active', 1)->where('parent_id', $menu->id)->orderby('sorting', 'asc')->get();
            if (count($child)) {
                foreach($child as &$c){
                    $priv = DB::table('adm_menus_privileges')
                    ->join('adm_privileges','adm_privileges.id','=','adm_menus_privileges.id_adm_privileges')
                    ->where('id_adm_menus',$c->id)->pluck('adm_privileges.name')->toArray();
                    if (count($priv)) {
                        $c->privileges = $priv;
                    }
                }
                $menu->children = $child;
            }
            $priv = DB::table('adm_menus_privileges')
            ->join('adm_privileges','adm_privileges.id','=','adm_menus_privileges.id_adm_privileges')
            ->where('id_adm_menus',$menu->id)->pluck('adm_privileges.name')->toArray();
            if (count($priv)) {
                $menu->privileges = $priv;
            }
        }
     
        return Inertia::render('Menus/Menus',[
            'privileges' => $privileges,
            'id_adm_privileges' => $id_adm_privileges,
            'menu_active' => $menu_active,
            'menu_inactive' => $menu_inactive,
            'queryParams' => request()->query()
        ]);
    }

    public function postAddSave(Request $request){
        $post = $request->menus;
        $isActive = $request->isActive;
        $post = json_decode($post, true);
        $i = 1;
        foreach ($post as $ro) {
            $pid = $ro['id'];
    
            if (isset($ro['children'])) {
                $ci = 1;
                foreach ($ro['children'] as $c) {
                    $id = $c['id'];
                    DB::table('adm_menuses')->where('id', $id)->update(['sorting' => $ci, 'parent_id' => $pid, 'is_active' => $isActive]);
                    $ci++;
                }
            }
            DB::table('adm_menuses')->where('id', $pid)->update(['sorting' => $i, 'parent_id' => 0, 'is_active' => $isActive]);
            $i++;
        }

        return json_encode(["message"=>"Menu Saved!", "type"=>"success"]);
    }

    public function getEdit($id){

        if (!CommonHelpers::isView()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), 'Denied Access');
        }

        $menus = DB::table('adm_menuses')->where('id',$id)->first();
        $privileges = DB::table('adm_privileges')->get();
        $menu_priv = DB::table('adm_menus_privileges')
                    ->join('adm_privileges','adm_privileges.id','=','adm_menus_privileges.id_adm_privileges')
                    ->where('id_adm_menus',$id)->pluck('adm_privileges.name')->toArray();
        $menuData = DB::table('adm_menus_privileges')
                    ->join('adm_privileges','adm_privileges.id','=','adm_menus_privileges.id_adm_privileges')
                    ->where('id_adm_menus',$id)->get();
 
        return Inertia::render('Menus/EditMenus',[
            'privileges' => $privileges,
            'menus' => $menus,
            'menuPriv' => $menu_priv,
            'menuData' => $menuData
        ]);
    }

    public function postEditSave(Request $request, $id){
        $privileges = $request->privileges_id;
        $menuId     = $id;
        DB::table('adm_menus_privileges')->where('id_adm_menus',$menuId)->delete();
        foreach($privileges as $privs){
            DB::table('adm_menus_privileges')->updateOrInsert(
                [
                    'id_adm_menus'       => $menuId,
                    'id_adm_privileges'  => $privs
                ],
                [
                    'id_adm_menus'       => $menuId,
                    'id_adm_privileges'  => $privs
                ]
            );
        }

        DB::table('adm_menuses')->where('id',$menuId)->update([
            'name' => $request->menu_name,
            'slug' => $request->slug,
            'icon' => $request->icon
        ]);

        return json_encode(["message"=>"Edit Successfully!", "type"=>"success"]);
    }

    public function postStatusSave(Request $request){
        $id = $request->id;
        $message = $request->bulk_action_type == 0 ? "Inactive" : "Active";
        DB::table('adm_menuses')->where('id',$id)->update([
            'parent_id' => 0,
            'is_active' => $request->bulk_action_type
        ]);

        $child = DB::table('adm_menuses')->where('parent_id',$id)->get();
        if($child){
            foreach($child as $val){
                DB::table('adm_menuses')->where('parent_id',$id)->update([
                    'parent_id' => 0,
                    'is_active' => $request->bulk_action_type
                ]);
            }
        }
        
        return json_encode(["message"=>"Menus Set to ".$message, "status"=>"success"]);
    }
}

?>