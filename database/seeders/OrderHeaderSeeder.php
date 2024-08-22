<?php

namespace Database\Seeders;

use DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderHeaderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
               "id" => 1,
               "sales_order_no" => '80000000023', 
               "customer_id" => 570, 
               "order_ref_no" => '10001', 
               "dr_number" => '90000000023', 
               "dep_order" => 1, 
               "enrollment_status" => 1, 
               "order_date" => '2024-07-30', 
               "created_at" => now(), 
               "updated_at" => now()
            ],
            [
               "id" => 2,
               "sales_order_no" => '80000000024', 
               "customer_id" => 568, 
               "order_ref_no" => '1002', 
               "dr_number" => '90000000023', 
               "dep_order" => 1, 
               "enrollment_status" => 1, 
               "order_date" => '2024-07-31', 
               "created_at" => now(), 
               "updated_at" => now()
            ],
            [
               "id" => 3,
               "sales_order_no" => '80000000025', 
               "customer_id" => 538, 
               "order_ref_no" => '1003', 
               "dr_number" => '90000000024', 
               "dep_order" => 1, 
               "enrollment_status" => 1, 
               "order_date" => '2024-08-01', 
               "created_at" => now(), 
               "updated_at" => now()
            ],
            [
               "id" => 4,
               "sales_order_no" => '80000000026', 
               "customer_id" => 571, 
               "order_ref_no" => '1004', 
               "dr_number" => '90000000023', 
               "dep_order" => 1, 
               "enrollment_status" => 1, 
               "order_date" => '2024-08-02', 
               "created_at" => now(), 
               "updated_at" => now()
            ],

        
        ];

        foreach ($data as $orderHeader) {
            DB::table('orders')->updateOrInsert(['id' => $orderHeader['id']], $orderHeader);
        }
    }
}
