<?php

namespace App\Http\Controllers\EnrollmentList;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EnrollmentListController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('EnrollmentList/EnrollmentList');
    }
}
