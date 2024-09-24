<?php

namespace App\Http\Controllers\Admin; 

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class NotificationManagementController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('Notification/NotificationManagement');
    }
    
}
