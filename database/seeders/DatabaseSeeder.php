<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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

        $this->call([AdmModules::class]);
        $this->call([AdmMenus::class]);
        $this->call([AdmPrivileges::class]);
        $this->call([AdmMenuPrivileges::class]);

    }
}
