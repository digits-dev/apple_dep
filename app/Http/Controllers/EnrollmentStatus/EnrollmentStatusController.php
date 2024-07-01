<?php

namespace App\Http\Controllers\EnrollmentStatus;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EnrollmentStatusController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('EnrollmentStatus/EnrollmentStatus');
    }
}
