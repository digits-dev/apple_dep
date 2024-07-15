<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmMenuPrivileges extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // DB::table('cms_moduls')->where('id', '>=', 12)->delete();
        // DB::statement('ALTER TABLE cms_moduls AUTO_INCREMENT = 12');
        $data = [
            [
                'id_adm_menus' => 1,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 3,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 3,
                'id_adm_privileges' => 2
            ],
            [
                'id_adm_menus' => 4,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 5,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 6,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 7,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 8,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 9,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 10,
                'id_adm_privileges' => 1
            ],
        ];

        if (DB::table('adm_menus_privileges')->count() == 0) {
            DB::table('adm_menus_privileges')->insert($data);
        }
    }
}