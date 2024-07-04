<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmPrivileges extends Seeder
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
                'name' => 'Super Administrator',
                'is_superadmin' => 1,
                'theme_color'   => 'skin-green',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'User',
                'is_superadmin' => 0,
                'theme_color'   => 'skin-green',
                'created_at' => date('Y-m-d H:i:s'),
            ],
        ];

        foreach ($data as $priv) {
            DB::table('adm_privileges')->updateOrInsert(['name' => $priv['name']], $priv);
        }

    }
}