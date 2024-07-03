<?php

namespace App\Http\Controllers\Action;
use App\Exports\ActionsExport;
use App\Http\Controllers\Controller;
use App\Models\Action;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ActionController extends Controller
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
        $query = Action::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('action_name', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));


        $actions = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('Action/Action', [ 'actions' => $actions, 'queryParams' => request()->query()]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "Actions - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new ActionsExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = Action::select([
            'id', 
            'action_name', 
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date")
        ]);

        return $query;
    }
  
}
