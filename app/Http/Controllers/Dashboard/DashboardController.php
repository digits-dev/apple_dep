<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Device;
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
        $data['devices'] = Device::count();
        $data['orders_count_wdate'] = Order::select(DB::raw('DATE(order_date) as date'), DB::raw('count(*) as count'))
                    ->groupBy('date')
                    ->orderBy('date', 'desc')
                    ->get();

        $sidebarMenus = CommonHelpers::sidebarMenu();
        
        return Inertia::render('Dashboard/Dashboard', [
            'menus' => $sidebarMenus,
            'customer' => $data['customer_count'],
            'orders' => $data['orders_count'],
            'devices' => $data['devices'],
            'orders_count_wdate' => $data['orders_count_wdate'],
        ]);
    }
}
