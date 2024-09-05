<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Action;
use App\Models\Customer;
use App\Models\DepStatus;
use App\Models\Device;
use App\Models\EnrollmentList;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(20)->create();

        // Order::factory(20)->create();

        // Device::factory(25)->create();

        // EnrollmentList::factory(25)->create();

        // Customer::factory(25)->create();

        // Action::factory(25)->create();

        // DepStatus::factory(25)->create();

        // EnrollmentStatus::factory(25)->create();


        $this->call([
            // AdmModules::class,
            // AdmMenus::class,
            // AdmSeeders::class,
            // AdmPrivileges::class,
            // AdmMenuPrivileges::class,
            // EnrollmentStatusSeeder::class,
            // DepStatusSeeder::class,
            // AdmUsersSeeders::class,
            // AdmUsersStatuses::class,
            OrderHeaderSeeder::class,
            OrderLinesSeeder::class,

        ]);
     
    }
}
