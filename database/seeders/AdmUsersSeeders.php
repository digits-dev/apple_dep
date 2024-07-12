<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmUsersSeeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [

                'name' => 'Admin',
                'email' => 'admin@superadmin.ph',
                'password' => bycryt('qwerty'),
                'id_adm_privileges' => '1',
                'status' => '1'
            ]
        ];

        foreach ($data as $user) {
            DB::table('users')->updateOrInsert(['email ' => $user['email ']], $user);
        }

    }
}