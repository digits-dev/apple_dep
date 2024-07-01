<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmModules extends Seeder
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

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Notifications',
                'icon' => 'fa fa-cog',
                'path' => 'notifications',
                'table_name' => 'cms_notifications',
                'controller' => 'NotificationsController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Privileges',
                'icon' => 'fa fa-cog',
                'path' => 'privileges',
                'table_name' => 'cms_privileges',
                'controller' => 'PrivilegesController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Privileges_Roles',
                'icon' => 'fa fa-cog',
                'path' => 'privileges_roles',
                'table_name' => 'cms_privileges_roles',
                'controller' => 'PrivilegesRolesController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Users Management',
                'icon' => 'fa fa-users',
                'path' => 'users',
                'table_name' => 'cms_users',
                'controller' => 'AdminUsersController',
                'is_protected' => 0,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'settings',
                'icon' => 'fa fa-cog',
                'path' => 'settings',
                'table_name' => 'cms_settings',
                'controller' => 'SettingsController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Module Generator',
                'icon' => 'fa fa-database',
                'path' => 'module_generator',
                'table_name' => 'cms_moduls',
                'controller' => 'ModulsController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Menu Management',
                'icon' => 'fa fa-bars',
                'path' => 'menu_management',
                'table_name' => 'cms_menus',
                'controller' => 'MenusController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Email Templates',
                'icon' => 'fa fa-envelope-o',
                'path' => 'email_templates',
                'table_name' => 'cms_email_templates',
                'controller' => 'EmailTemplatesController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Statistic Builder',
                'icon' => 'fa fa-dashboard',
                'path' => 'statistic_builder',
                'table_name' => 'cms_statistics',
                'controller' => 'StatisticBuilderController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'API Generator',
                'icon' => 'fa fa-cloud-download',
                'path' => 'api_generator',
                'table_name' => '',
                'controller' => 'ApiCustomController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Log User Access',
                'icon' => 'fa fa-flag-o',
                'path' => 'logs',
                'table_name' => 'cms_logs',
                'controller' => 'LogsController',
                'is_protected' => 1,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Dashboard',
                'icon' => 'images/navigation/dashboard-icon.png',
                'path' => 'dashboard',
                'table_name' => 'dashboard',
                'controller' => 'Dashboard\DashboardController',
                'is_protected' => 0,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'List of Orders',
                'icon' => 'fa-solid fa-list-ul',
                'path' => 'list_of_orders',
                'table_name' => 'list_of_orders',
                'controller' => 'ListOfOrders\ListOfOrdersController',
                'is_protected' => 0,
                'is_active' => 1,
            ],
            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'DEP Devices',
                'icon' => 'fa-solid fa-mobile-screen-button',
                'path' => 'dep_devices',
                'table_name' => 'dep_devices',
                'controller' => 'DepDevices\DepDevicesController',
                'is_protected' => 0,
                'is_active' => 1,
            ],

            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Enrollment List',
                'icon' => 'fa-solid fa-list-check',
                'path' => 'enrollment_list',
                'table_name' => 'enrollment_list',
                'controller' => 'EnrollmentList\EnrollmentListController',
                'is_protected' => 0,
                'is_active' => 1,
            ],

            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Customer',
                'icon' => 'fa-solid fa-user',
                'path' => 'customer',
                'table_name' => 'customer',
                'controller' => 'Customer\CustomerController',
                'is_protected' => 0,
                'is_active' => 1,
            ],

            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Actions',
                'icon' => 'fa-solid fa-circle-exclamation',
                'path' => 'action',
                'table_name' => 'action',
                'controller' => 'Action\ActionController',
                'is_protected' => 0,
                'is_active' => 1,
            ],

            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'DEP Status',
                'icon' => 'fa-solid fa-check',
                'path' => 'dep_status',
                'table_name' => 'dep_status',
                'controller' => 'DepStatus\DepStatusController',
                'is_protected' => 0,
                'is_active' => 1,
            ],

            [

                'created_at' => date('Y-m-d H:i:s'),
                'name' => 'Enrollment Status',
                'icon' => 'fa-solid fa-check',
                'path' => 'enrollment_status',
                'table_name' => 'enrollment_status',
                'controller' => 'EnrollmentStatus\EnrollmentStatusController',
                'is_protected' => 0,
                'is_active' => 1,
            ]
        ];

        foreach ($data as $module) {
            DB::table('adm_modules')->updateOrInsert(['name' => $module['name']], $module);
        }

    }
}