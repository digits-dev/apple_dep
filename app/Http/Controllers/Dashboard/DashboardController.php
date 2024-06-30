<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\AppServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use DB;
use Illuminate\Contracts\Session\Session;

class DashboardController extends Controller
{

    public function GetIndex(): Response
    {
        $data         = [];
        $sidebarMenus = CommonHelpers::sidebarMenu();
        return Inertia::render('Dashboard/Dashboard', [
            'menus' => $sidebarMenus,
        ]);
    }
}
