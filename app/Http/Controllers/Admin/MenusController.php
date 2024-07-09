<?php

namespace App\Http\Controllers\Admin; 
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use DB;

class MenusController extends Controller{
    public static function sidebarMenu(){
        return CommonHelpers::sidebarMenu();
    }

    public function getIndex(Request $request){
        $data = [];
   
        if (!CommonHelpers::isView()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), 'Denied Access');
        }

        $data['privileges'] = DB::table('ad_privileges')->get();

        $data['id_ad_privileges'] = $request->id_ad_privileges;
        $data['id_ad_privileges'] = ($data['id_ad_privileges']) ?: CommonHelpers::myPrivilegeId();

        $data['menu_active'] = DB::table('ad_menuses')->where('parent_id', 0)->where('is_active', 1)->orderby('sorting', 'asc')->get();

        foreach ($data['menu_active'] as &$menu) {
            $child = DB::table('ad_menuses')->where('is_active', 1)->where('parent_id', $menu->id)->orderby('sorting', 'asc')->get();
            if (count($child)) {
                $menu->children = $child;
            }
        }

        $data['menu_inactive'] = DB::table('ad_menuses')->where('parent_id', 0)->where('is_active', 0)->orderby('sorting', 'asc')->get();

        foreach ($data['menu_inactive'] as &$menu) {
            $child = DB::table('ad_menuses')->where('is_active', 1)->where('parent_id', $menu->id)->orderby('sorting', 'asc')->get();
            if (count($child)) {
                $menu->children = $child;
            }
        }
  
        return view('admin/menus/view-menus',$data);
    }
}

?>