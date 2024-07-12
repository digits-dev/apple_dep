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
                $menu->children = $child;
            }
        }

        $menu_inactive = DB::table('adm_menuses')->where('parent_id', 0)->where('is_active', 0)->orderby('sorting', 'asc')->get();

        foreach ($menu_inactive as &$menu) {
            $child = DB::table('adm_menuses')->where('is_active', 1)->where('parent_id', $menu->id)->orderby('sorting', 'asc')->get();
            if (count($child)) {
                $menu->children = $child;
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
}

?>