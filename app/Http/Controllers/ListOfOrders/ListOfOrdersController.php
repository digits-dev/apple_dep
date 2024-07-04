<?php

namespace App\Http\Controllers\ListOfOrders;

use App\Exports\OrdersExport;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;


class ListOfOrdersController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex()
    {
        $query = Order::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('sales_order_no', 'LIKE', "%$search%");
        });

        $orders = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('ListOfOrders/ListOfOrders', [ 'orders' => $orders, 'queryParams' => request()->query()]);
    }

    
    public function show(Order $order)
    {
        return Inertia::render('ListOfOrders/OrderDetails', [ 'order' => $order]);
    }

    public function edit(Order $order){
        return Inertia::render('ListOfOrders/EnrollReturnDevices', [ 'order' => $order]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "List Of Orders - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new OrdersExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = Order::select([
            'id', 
            'sales_order_no', 
            'customer_name', 
            'order_ref_no', 
            'dep_order', 
            'enrollment_status', 
            'order_date'
        ]);

        return $query;
    }
}
