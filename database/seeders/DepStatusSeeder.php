<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DepStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'dep_status' => 'Success',
                'status' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            
        ];

        foreach ($data as $item) {
            DB::table('dep_statuses')->updateOrInsert(['dep_status' => $item['dep_status']], $item);
        }
    }
}
