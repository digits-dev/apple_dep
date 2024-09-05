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
                "sales_order_no" => '80000000021', 
                "customer_id" => 10000, 
                "order_ref_no" => '10001', 
                "dr_number" => '90000000021', 
                "dep_order" => 1, 
                "enrollment_status" => 1, 
                "order_date" => '2024-07-30', 
                "ship_date" => '2024-08-01', 
                "created_at" => now(), 
                "updated_at" => now()
            ],
            [
                "id" => 2,
                "sales_order_no" => '80000000022', 
                "customer_id" => 10000, 
                "order_ref_no" => '10002', 
                "dr_number" => '90000000022', 
                "dep_order" => 1, 
                "enrollment_status" => 1, 
                "order_date" => '2024-07-31', 
                "ship_date" => '2024-08-01',
                "created_at" => now(), 
                "updated_at" => now()
            ],
            [
                "id" => 3,
                "sales_order_no" => '80000000023', 
                "customer_id" => 10000, 
                "order_ref_no" => '10003', 
                "dr_number" => '90000000023', 
                "dep_order" => 1, 
                "enrollment_status" => 1, 
                "order_date" => '2024-07-31', 
                "ship_date" => '2024-08-01',
                "created_at" => now(), 
                "updated_at" => now()
            ],
            [
                "id" => 4,
                "sales_order_no" => '80000000024', 
                "customer_id" => 10000, 
                "order_ref_no" => '10004', 
                "dr_number" => '90000000024', 
                "dep_order" => 1, 
                "enrollment_status" => 1, 
                "order_date" => '2024-07-31', 
                "ship_date" => '2024-08-01',
                "created_at" => now(), 
                "updated_at" => now()
            ],
            [
                "id" => 5,
                "sales_order_no" => '80000000025', 
                "customer_id" => 10002, 
                "order_ref_no" => '10005', 
                "dr_number" => '90000000025', 
                "dep_order" => 1, 
                "enrollment_status" => 1, 
                "order_date" => '2024-07-31', 
                "ship_date" => '2024-08-01',
                "created_at" => now(), 
                "updated_at" => now()
            ],
            [
                "id" => 6,
                "sales_order_no" => '80000000026', 
                "customer_id" => 10002, 
                "order_ref_no" => '10006', 
                "dr_number" => '90000000026', 
                "dep_order" => 1, 
                "enrollment_status" => 1, 
                "order_date" => '2024-07-31', 
                "ship_date" => '2024-08-01',
                "created_at" => now(), 
                "updated_at" => now()
            ],
            [
                "id" => 7,
                "sales_order_no" => '80000000027', 
                "customer_id" => 10002, 
                "order_ref_no" => '10007', 
                "dr_number" => '90000000027', 
                "dep_order" => 1, 
                "enrollment_status" => 1, 
                "order_date" => '2024-07-31', 
                "ship_date" => '2024-08-01',
                "created_at" => now(), 
                "updated_at" => now()
            ],
            
        ];

        foreach ($data as $orderHeader) {
            DB::table('orders')->updateOrInsert(['id' => $orderHeader['id']], $orderHeader);
        }
    }
}
