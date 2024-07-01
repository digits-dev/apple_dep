<?php

namespace App\Http\Controllers\Action;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ActionController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('Action/Action');
    }
}
