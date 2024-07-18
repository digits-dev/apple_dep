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
            CommonHelpers::redirect(CommonHelpers::adminPath(), 'Access denied!');
        }

        if($request->type === 'route'){
             //CREATE FILE
            $folderName = $request->controller;
            $contentName = $request->controller.'Controller';
            $viewFolderName = preg_split('/(?=[A-Z])/',$request->controller);
            $viewContentName = preg_split('/(?=[A-Z])/',$request->controller);

            if(!isset($viewFolderName[1]) && !isset($viewFolderName[2])){
                return json_encode(["message"=>"Invalid Controller name! please refer tot this example(SampleModule)", "type"=>"danger"]);
            }
            $finalViewFolderName = strtolower($viewFolderName[1])."-".strtolower($viewFolderName[2]);
            $finalViewContentName = strtolower($viewContentName[1])."-".strtolower($viewContentName[2]).'-'.'Controller';
            
            if(file_exists(base_path('app/Http/Controllers/'.$folderName.'/'.$contentName.'.php'))){
                return json_encode(["message"=>"Controller already exist!", "type"=>"danger"]);
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
                $makeFolderViewContent = base_path('resources/js/Pages/'.$viewFolderName[1]);
                File::makeDirectory($makeFolderViewContent, $mode = 0777, true, true);

                //MAKE FILE CONTROLLER
                $pathViewController = base_path("resources/js/Pages/".$viewFolderName[1]."/");
                $viewContent = self::viewContent();
                $viewContent = trim($viewContent);
                file_put_contents($pathViewController.$viewFolderName[1].'.jsx', $viewContent);

                //CREATE MODULE
                DB::table('adm_modules')->updateOrInsert([
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
                $isExist = DB::table('adm_menuses')->where('name',$request->name)->where('path',$folderName."\\".$contentName.'GetIndex')->exists();
                if(!$isExist){
                    $menusId = DB::table('adm_menuses')->insertGetId([
                        'name'                => $request->name,
                        'type'                => 'Route',
                        'icon'                => $request->icon,
                        'path'                => $folderName."\\".$contentName.'GetIndex',
                        'slug'                => $request->path,
                        'color'               => NULL,
                        'parent_id'           => 0,
                        'is_active'           => 1,
                        'is_dashboard'        => 0,
                        'id_adm_privileges'    => 1,
                        'sorting'             => 0,
                        'created_at'          => date('Y-m-d H:i:s')
                    ]);
                    //CREATE MENUS PRIVILEGE
                    DB::table('adm_menus_privileges')->insert(['id_adm_menus' => $menusId, 'id_adm_privileges' => CommonHelpers::myPrivilegeId()]);
                }

                return json_encode(["message"=>"Created successfully!", "type"=>"success"]);
            }
            
        }else{
            //CREATE MENUS
            $isExist = DB::table('adm_menuses')->where('name',$request->name)->exists();
            if(!$isExist){
                $menusId = DB::table('adm_menuses')->insertGetId(
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
                        'id_adm_privileges'    => 1,
                        'sorting'             => 0,
                        'created_at'          => date('Y-m-d H:i:s')
                    ]
                );
                //CREATE MENUS PRIVILEGE
                DB::table('adm_menus_privileges')->insert(['id_adm_menus' => $menusId, 'id_adm_privileges' => CommonHelpers::myPrivilegeId()]);
            }
            return json_encode(["message"=>"Created successfully!", "type"=>"success"]);

        }

    }

    public function controllerContent($controllerName, $finalViewFileName,$finalViewFolderName,$finalViewContentName){
        return '<?php
                    namespace App\Http\Controllers\NameOfFolder;
                    use App\Helpers\CommonHelpers;
                    use App\Http\Controllers\Controller;
                    use Illuminate\Http\Request;
                    use Illuminate\Http\RedirectResponse;
                    use Illuminate\Support\Facades\Auth;
                    use Illuminate\Support\Facades\Session;
                    use Inertia\Inertia;
                    use Inertia\Response;
                    use DB;
                class '.$controllerName.' extends Controller{
                    public function getIndex(){
                        return Inertia("'.$finalViewFolderName.'/'.$finalViewContentName.'");
                    }
                }
                ?>';
    }

    public function viewContent(){
        return '
        import { Head, Link, router, usePage } from "@inertiajs/react";
        import React, { useState } from "react";
        const JsxName = () => {
          return(
            <></>
           );
        };
        export default JsxName;
        ';
    }

}

?>
