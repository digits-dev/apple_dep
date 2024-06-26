<?php

namespace App\Http\Controllers\Test; 
use DB;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Session;

class TestController extends Controller{

    public function getIndex(){
        return Inertia::render('Test/TestIndex');
    }

    public function getTable(){
        $query = User::query();
        $sortField = request("sortBy", 'created_at');
        $sortDirection = request("sortDir", "desc");

        $users = $query->orderBy($sortField, $sortDirection)
        ->paginate(10)->withQueryString();

        return Inertia::render('Test/TestTable', [
            'users' => $users,
            'queryParams' => request()->query() ?: null,
        ]);
    }
}

?>