<?php

namespace Database\Seeders;
use App\Models\User;
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
        User::updateOrInsert(['email' => 'admin@superadmin.ph'],
        [
            'name' => 'Super Admin',
            'email' => 'admin@superadmin.ph',
            'password' => bcrypt('qwerty'),
            'id_adm_privileges' => 1
        ]);

    }
}