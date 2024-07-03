<?php

namespace App\Http\Controllers\DepStatus;
use App\Exports\DepStatusExport;
use App\Http\Controllers\Controller;
use App\Models\DepStatus;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DepStatusController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex()
    {
        $query = DepStatus::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('dep_status', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));


        $dep_statuses = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('DepStatus/DepStatus', [ 'dep_statuses' => $dep_statuses, 'queryParams' => request()->query()]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "DEP Status - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new DepStatusExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = DepStatus::select([
            'id', 
            'dep_status', 
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date")
        ]);

        return $query;
    }
}
