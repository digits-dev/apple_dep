<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Device;
use App\Models\EnrollmentList;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    public function getIndex(): Response
    {
        $data = [];
        $data['customer_count'] = Customer::count();
        $data['orders_count'] = Order::count();
        $data['dep_devices_count'] = EnrollmentList::join('orders', 'orders.sales_order_no', '=', 'enrollment_lists.sales_order_no')
        ->join('list_of_order_lines', 'list_of_order_lines.serial_number', '=', 'enrollment_lists.serial_number')
        ->where('enrollment_lists.enrollment_status', 3)
        ->count();
        $data['orders_count_wdate'] = Order::select(DB::raw('DATE(order_date) as date'), DB::raw('count(*) as count'))
                    ->groupBy('date')
                    ->orderBy('date', 'desc')
                    ->get();

        $sidebarMenus = CommonHelpers::sidebarMenu();

        
        return Inertia::render('Dashboard/Dashboard', [
            'menus' => $sidebarMenus,
            'customer' => $data['customer_count'],
            'orders' => $data['orders_count'],
            'devices' => $data['dep_devices_count'],
            'orders_count_wdate' => $data['orders_count_wdate'],
        ]);
    }
}
