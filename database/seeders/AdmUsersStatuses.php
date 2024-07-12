<?php

namespace Database\Seeders;
use App\Models\Status;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmUsersStatuses extends Seeder
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
                'name' => 'Active',
                'type' => 'users'
            ],
            [
                'name' => 'In Active',
                'type' => 'users'
            ]
        ];

        foreach ($data as $status) {
            DB::table('statuses')->updateOrInsert(['name' => $status['name']], $status);
        }
    }
}