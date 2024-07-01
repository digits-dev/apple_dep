<?php

namespace App\Http\Controllers\Test;

use App\Models\User;
use Inertia\Inertia;
use App\Exports\TestExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class TestController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getTable()
    {
        $query = User::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('name', 'LIKE', "%$search%")
                ->orWhere('email', "LIKE", "%$search%");
        });

        $users = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('Test/TestTable', [ 'users' => $users, 'queryParams' => request()->query()]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "Export Test - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new TestExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = DB::table('users')
            ->select([
                'users.id',
                'users.name',
                'users.email',
                'users.status',
                'users.created_at',
                'users.updated_at'
            ]);
        return $query;
    }
}
