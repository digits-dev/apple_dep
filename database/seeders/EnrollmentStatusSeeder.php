<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class EnrollmentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'enrollment_status' => 'Pending',
                'status' => 1,
                'color' => 'orange',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Enrollment Error',
                'status' => 1,
                'color' => 'darkred',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Enrollment Success',
                'status' => 1,
                'color' => 'green',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Completed',
                'status' => 1,
                'color' => 'green',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Returned',
                'status' => 1,
                'color' => '#322e2e',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Return Error',
                'status' => 1,
                'color' => 'darkred',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Partially Enrolled',
                'status' => 1,
                'color' => '#41c7e1',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Voided',
                'status' => 1,
                'color' => '#f57b47',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Cancelled',
                'status' => 1,
                'color' => '#d33636',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'enrollment_status' => 'Void Error',
                'status' => 1,
                'color' => 'darkred',
                'created_at' => date('Y-m-d H:i:s'),
            ]
        ];

        foreach ($data as $item) {
            DB::table('enrollment_statuses')->updateOrInsert(['enrollment_status' => $item['enrollment_status']], $item);
        }
    }
}