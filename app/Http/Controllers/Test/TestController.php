<?php

namespace App\Http\Controllers\Test;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestController extends Controller
{
    public function getTable()
    {
        $query = User::query();

        $sortBy  = request()->get('sortBy', 'created_at');
        $sortDir = request()->get('sortDir', 'desc');
        $perPage = request()->get('perPage', 10);

        $query->when(request('search'), function ($query, $search) {
            $query->where('name', 'LIKE', "%$search%")
                ->orWhere('email', "LIKE", "%$search%");
        });

        $users = $query->orderBy($sortBy, $sortDir)->paginate($perPage)->withQueryString();

        return Inertia::render('Test/TestTable', [ 'users' => $users, 'queryParams' => request()->query() ]);
    }
}
