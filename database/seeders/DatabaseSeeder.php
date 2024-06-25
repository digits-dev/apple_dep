<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([AdmModules::class]);
        $this->call([AdmMenus::class]);
        $this->call([AdmPrivileges::class]);
        $this->call([AdmMenuPrivileges::class]);
    }
}
