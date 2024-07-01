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
                'sorting'           => 4
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
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 1
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'DEP Devices',
            ],
            [
                'name'              => 'DEP Devices',
                'type'              => 'Route',
                'path'              => 'DepDevices\DepDevicesControllerGetIndex',
                'slug'              => 'dep_devices',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 2
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Enrollment List',
            ],
            [
                'name'              => 'Enrollment List',
                'type'              => 'Route',
                'path'              => 'EnrollmentList\EnrollmentListControllerGetIndex',
                'slug'              => 'enrollment_list',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 3
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Customer',
            ],
            [
                'name'              => 'Customer',
                'type'              => 'Route',
                'path'              => 'Customer\CustomerControllerGetIndex',
                'slug'              => 'customer',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 2,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 1
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Actions',
            ],
            [
                'name'              => 'Actions',
                'type'              => 'Route',
                'path'              => 'Action\ActionControllerGetIndex',
                'slug'              => 'action',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 2,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 2
            ]
        );


        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'DEP Status',
            ],
            [
                'name'              => 'DEP Status',
                'type'              => 'Route',
                'path'              => 'DepStatus\DepStatusControllerGetIndex',
                'slug'              => 'dep_status',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 2,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 3
            ]
        );

        DB::table('adm_menuses')->updateOrInsert(
            [
                'name'              => 'Enrollment Status',
            ],
            [
                'name'              => 'Enrollment Status',
                'type'              => 'Route',
                'path'              => 'EnrollmentStatus\EnrollmentStatusControllerGetIndex',
                'slug'              => 'enrollment_status',
                'color'             => NULL,
                'icon'              => 'images/navigation/dashboard-icon.png',
                'parent_id'         => 2,
                'is_active'         => 1,
                'is_dashboard'      => 0,
                'id_adm_privileges' => 1,
                'sorting'           => 4
            ]
        );
    }

}