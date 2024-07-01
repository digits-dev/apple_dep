<?php

namespace App\Http\Controllers\DepStatus;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DepStatusController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('DepStatus/DepStatus');
    }
}
