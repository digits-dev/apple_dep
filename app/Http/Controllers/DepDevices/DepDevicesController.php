<?php

namespace App\Http\Controllers\DepDevices;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DepDevicesController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('DepDevices/DepDevices');
    }
}
