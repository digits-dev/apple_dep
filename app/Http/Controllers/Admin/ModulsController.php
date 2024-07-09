<?php

namespace App\Http\Controllers\Admin;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use DB;
use App\Models\AdmModules;
use App\Models\AdmMenus;
use File;
use Inertia\Inertia;
use Inertia\Response;

class ModulsController extends Controller{

    private $table_name;
    private $primary_key;
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

    public function getIndex(){
        $query = AdmModules::getData();
        $query->when(request('search'), function ($query, $search) {
            $query->where('adm_modules.name', 'LIKE', "%$search%");
        });
        $modules = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        return Inertia::render('Modules/Modules', [
            'modules' => $modules,
            'queryParams' => request()->query()
        ]);
    }

    public function getAddModuls(){
        if(!CommonHelpers::isCreate()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), trans("ad_default.denied_access"));
        }
        $data = [];
        $data['page_title'] = "Add Module";
        return view('admin/modules/add-module', $data);
    }

    public function postAddSave(Request $request){
        if (!CommonHelpers::isCreate()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), trans("ad_default.denied_access"));
        }
        if($request->route_type === 'Route'){
             //CREATE FILE
            if($request->type === 'Livewire'){
                $folderName = $request->controller;
                $contentName = $request->controller.'Content';
                $viewFolderName = preg_split('/(?=[A-Z])/',$request->controller);
                $viewContentName = preg_split('/(?=[A-Z])/',$request->controller);

                $finalViewFolderName = strtolower($viewFolderName[1])."-".strtolower($viewFolderName[2]);
                $finalViewContentName = strtolower($viewContentName[1])."-".strtolower($viewContentName[2]).'-'.'content';

                if(file_exists(base_path('app/Livewire/Component/ModuleContents/'.$folderName.'/'.$contentName.'.php'))){
                return CommonHelpers::redirect(CommonHelpers::mainpath(), "Content already exist", 'error');
                }
                //MAKE FOLDER
                $folder = base_path('app/Livewire/Component/ModuleContents/'.$folderName);
                File::makeDirectory($folder, $mode = 0777, true, true);
                //MAKE FILE CONTENT
                $path = base_path("app/Livewire/Component/ModuleContents/$folderName/");
                $php = self::livewireContent($contentName,$folderName,$finalViewFolderName,$finalViewContentName);
                $php = trim($php);
                file_put_contents($path.$contentName.'.php', $php);
                //MAKE FOLDER VIEW CONTENT
                $makeFolderViewContent = base_path('resources/views/livewire/component/module-contents/'.$finalViewFolderName);
                File::makeDirectory($makeFolderViewContent, $mode = 0777, true, true);
                //MAKE VIEW CONTENT
                $pathView = base_path("resources/views/livewire/component/module-contents/$finalViewFolderName/");
                $viewContent = self::viewContentLivewire();
                $viewContent = trim($viewContent);
                file_put_contents($pathView.$finalViewContentName.'.blade.php', $viewContent);

                //CREATE VIEW MODULE CONTENT LIVEWIRE
                //MAKE FOLDER VIEW CONTENT MODULE
                $makeFolderViewContentModule = base_path('resources/views/modules/'.$finalViewFolderName);
                File::makeDirectory($makeFolderViewContentModule, $mode = 0777, true, true);
                $pathViewModule = base_path("resources/views/modules/$finalViewFolderName/");
                $viewContentModule = self::viewContent();
                $viewContentModule = trim($viewContentModule);
                $finalViewModuleName = strtolower($viewContentName[1])."-".strtolower($viewContentName[2]);
                file_put_contents($pathViewModule.$finalViewModuleName.'.blade.php', $viewContentModule);

                //CREATE MODULE
                DB::table('ad_modules')->updateOrInsert([
                        'name'         => $request->name,
                        'path'         => $request->path,
                        'controller'   => $folderName."\\".$contentName
                    ],
                    [
                        'name'         => $request->name,
                        'icon'         => $request->icon,
                        'path'         => $request->path,
                        'table_name'   => NULL,
                        'controller'   => $folderName."\\".$contentName,
                        'is_protected' => 0,
                        'is_active'    => 1,
                        'created_at'   => date('Y-m-d H:i:s')
                    ]
                );
                //CREATE MENUS
                $isExist = DB::table('ad_menuses')->where('name',$request->name)->where('path',$folderName."\\".$contentName.'GetIndex')->exists();
                if(!$isExist){
                    $menusId = DB::table('ad_menuses')->insertGetId(
                        [
                            'name'                => $request->name,
                            'type'                => 'Route',
                            'icon'                => $request->icon,
                            'path'                => $folderName."\\".$contentName.'GetIndex',
                            'slug'                => $request->path,
                            'color'               => NULL,
                            'parent_id'           => 0,
                            'is_active'           => 1,
                            'is_dashboard'        => 0,
                            'id_ad_privileges'    => 1,
                            'sorting'             => 0,
                            'created_at'          => date('Y-m-d H:i:s')
                        ]
                    );
                    //CREATE MENUS PRIVILEGE
                    DB::table('ad_menus_privileges')->insert(['id_ad_menus' => $menusId, 'id_ad_privileges' => CommonHelpers::myPrivilegeId()]);
                }
                CommonHelpers::redirect(CommonHelpers::mainpath(), "Modules created successfully", 'success');
            }else if($request->type === 'Admin Controller'){
                $controllerName = $request->controller.'Controller';
                $viewFileName = preg_split('/(?=[A-Z])/',$request->controller);
                $finalViewFileName = strtolower($viewFileName[1])."-".strtolower($viewFileName[2]);

                if(file_exists(base_path('app/Http/Controllers/Admin/'.$controllerName.'.php'))){
                return CommonHelpers::redirect(CommonHelpers::mainpath(), "Controller already exist", 'error');
                }

                //MAKE FILE CONTROLLER
                $path = base_path("app/Http/Controllers/Admin/");
                $php = self::adminControllerContent($controllerName, $finalViewFileName);
                $php = trim($php);
                file_put_contents($path.$controllerName.'.php', $php);
                //MAKE FILE VIEW
                //MAKE FOLDER FILE VIEW
                $makeFolderAdminFile = base_path('resources/views/admin/'.$finalViewFileName);
                File::makeDirectory($makeFolderAdminFile, $mode = 0777, true, true);
                $pathView = base_path("resources/views/admin/$finalViewFileName/");
                $viewContent = self::viewContent();
                $viewContent = trim($viewContent);
                file_put_contents($pathView.$finalViewFileName.'.blade.php', $viewContent);
                //CREATE MODULE
                DB::table('ad_modules')->updateOrInsert([
                        'name'         => $request->name,
                        'path'         => $request->path,
                        'controller'   => $controllerName
                    ],
                    [
                        'name'         => $request->name,
                        'icon'         => $request->icon,
                        'path'         => $request->path,
                        'table_name'   => NULL,
                        'controller'   => $controllerName,
                        'is_protected' => 0,
                        'is_active'    => 1,
                        'created_at'   => date('Y-m-d H:i:s')
                    ]
                );
                //CREATE MENUS
                $isExist = DB::table('ad_menuses')->where('name',$request->name)->where('path',$controllerName.'GetIndex')->exists();
                if(!$isExist){
                    $menusId = DB::table('ad_menuses')->insertGetId(
                        [
                            'name'                => $request->name,
                            'type'                => 'Route',
                            'icon'                => $request->icon,
                            'path'                => $controllerName.'GetIndex',
                            'slug'                => $request->path,
                            'color'               => NULL,
                            'parent_id'           => 0,
                            'is_active'           => 1,
                            'is_dashboard'        => 0,
                            'id_ad_privileges'    => 1,
                            'sorting'             => 0,
                            'created_at'          => date('Y-m-d H:i:s')
                        ]
                    );
                    //CREATE MENUS PRIVILEGE
                    DB::table('ad_menus_privileges')->insert(['id_ad_menus' => $menusId, 'id_ad_privileges' => CommonHelpers::myPrivilegeId()]);
                }
                CommonHelpers::redirect(CommonHelpers::mainpath(), "Modules created successfully", 'success');
            }else{
                $folderName = $request->controller;
                $contentName = $request->controller.'Controller';
                $viewFolderName = preg_split('/(?=[A-Z])/',$request->controller);
                $viewContentName = preg_split('/(?=[A-Z])/',$request->controller);

                $finalViewFolderName = strtolower($viewFolderName[1])."-".strtolower($viewFolderName[2]);
                $finalViewContentName = strtolower($viewContentName[1])."-".strtolower($viewContentName[2]).'-'.'content';

                if(file_exists(base_path('app/Http/Controllers/'.$folderName.'/'.$contentName.'.php'))){
                return CommonHelpers::redirect(CommonHelpers::mainpath(), "Controller already exist", 'danger');
                }else{
                    //MAKE FOLDER
                    $folder = base_path('app/Http/Controllers/'.$folderName);
                    File::makeDirectory($folder, $mode = 0777, true, true);
                    //MAKE FILE CONTENT
                    $path = base_path("app/Http/Controllers/$folderName/");
                    $php = self::controllerContent($contentName,$folderName,$finalViewFolderName,$finalViewContentName);
                    $php = trim($php);
                    file_put_contents($path.$contentName.'.php', $php);
                    //MAKE FOLDER VIEW CONTENT
                    $makeFolderViewContent = base_path('resources/views/'.$finalViewFolderName);
                    File::makeDirectory($makeFolderViewContent, $mode = 0777, true, true);

                    //MAKE FILE CONTROLLER
                    $pathViewController = base_path("resources/views/$finalViewFolderName/");
                    $viewContent = self::viewContent();
                    $viewContent = trim($viewContent);
                    file_put_contents($pathViewController.$finalViewContentName.'.blade.php', $viewContent);

                    //CREATE MODULE
                    DB::table('ad_modules')->updateOrInsert([
                            'name'         => $request->name,
                            'path'         => $request->path,
                            'controller'   => $folderName."\\".$contentName
                        ],
                        [
                            'name'         => $request->name,
                            'icon'         => $request->icon,
                            'path'         => $request->path,
                            'table_name'   => NULL,
                            'controller'   => $folderName."\\".$contentName,
                            'is_protected' => 0,
                            'is_active'    => 1,
                            'created_at'   => date('Y-m-d H:i:s')
                        ]
                    );
                    //CREATE MENUS
                    $isExist = DB::table('ad_menuses')->where('name',$request->name)->where('path',$folderName."\\".$contentName.'GetIndex')->exists();
                    if(!$isExist){
                        $menusId = DB::table('ad_menuses')->insertGetId([
                            'name'                => $request->name,
                            'type'                => 'Route',
                            'icon'                => $request->icon,
                            'path'                => $folderName."\\".$contentName.'GetIndex',
                            'slug'                => $request->path,
                            'color'               => NULL,
                            'parent_id'           => 0,
                            'is_active'           => 1,
                            'is_dashboard'        => 0,
                            'id_ad_privileges'    => 1,
                            'sorting'             => 0,
                            'created_at'          => date('Y-m-d H:i:s')
                        ]);
                        //CREATE MENUS PRIVILEGE
                        DB::table('ad_menus_privileges')->insert(['id_ad_menus' => $menusId, 'id_ad_privileges' => CommonHelpers::myPrivilegeId()]);
                    }

                    CommonHelpers::redirect(CommonHelpers::mainpath(), "Modules created successfully", 'success');
                }
            }
        }else{
            //CREATE MENUS
            $isExist = DB::table('ad_menuses')->where('name',$request->name)->exists();
            if(!$isExist){
                $menusId = DB::table('ad_menuses')->insertGetId(
                    [
                        'name'                => $request->name,
                        'type'                => 'URL',
                        'icon'                => $request->icon,
                        'path'                => '#',
                        'slug'                => NULL,
                        'color'               => NULL,
                        'parent_id'           => 0,
                        'is_active'           => 1,
                        'is_dashboard'        => 0,
                        'id_ad_privileges'    => 1,
                        'sorting'             => 0,
                        'created_at'          => date('Y-m-d H:i:s')
                    ]
                );
                //CREATE MENUS PRIVILEGE
                DB::table('ad_menus_privileges')->insert(['id_ad_menus' => $menusId, 'id_ad_privileges' => CommonHelpers::myPrivilegeId()]);
            }
            CommonHelpers::redirect(CommonHelpers::mainpath(), "Modules created successfully", 'success');

        }

    }

    public function controllerContent($controllerName, $finalViewFileName,$finalViewFolderName,$finalViewContentName){
        return '<?php

                namespace App\Http\Controllers\"'.$finalViewFileName.'";
                use App\Helpers\CommonHelpers;
                use App\Http\Controllers\Controller;
                use Illuminate\Http\Request;
                use Illuminate\Http\RedirectResponse;
                use Illuminate\Support\Facades\Auth;
                use Illuminate\Support\Facades\Session;
                use DB;

                class '.$controllerName.' extends Controller{
                    public function getIndex(){
                        return view("'.$finalViewFolderName.'/'.$finalViewContentName.'");
                    }
                }
                ?>';
    }

    public function viewContentLivewire(){
        return '<div> This is livewire view content</div>';
    }

    public function viewContent(){
        return '@extends("layout")
                @section("content")
                Extend livewire here if content is livewire...
                @endsection';
    }

}

?>
