<?php

namespace App\Http\Controllers\ListOfOrders;

use App\Http\Controllers\Controller;
use Inertia\Inertia;


class ListOfOrdersController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('ListOfOrders/ListOfOrders');
    }
}
