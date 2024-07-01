<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmMenus extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        self::submasterMenu();
        self::mainMenu();
    }

    public function submasterMenu() {
     
    }

    public function mainMenu() {
        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Dashboard',
            ],
            [
                'name'              => 'Dashboard',
                'type'              => 'Route',
                'path'              => 'Dashboard\DashboardControllerGetIndex',
                'slug'              => 'dashboard',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 1,
                'id_adm_privileges'  => 1,
                'sorting'           => 1
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Sub Master',
            ],
            [
                'name'              => 'Sub Master',
                'type'              => 'URL',
                'path'              => '#',
                'slug'              => '#',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 1
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'List Of Orders',
            ],
            [
                'name'              => 'List Of Orders',
                'type'              => 'Route',
                'path'              => 'ListOfOrders\ListOfOrdersControllerGetIndex',
                'slug'              => 'list_of_orders',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 2,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 1
            ]
        );
    }

}