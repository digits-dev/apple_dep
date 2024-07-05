<?php

namespace App\Http\Controllers\Action;
use App\Exports\ActionsExport;
use App\Http\Controllers\Controller;
use App\Imports\ImportActions;
use App\ImportTemplates\ImportActionsTemplate;
use App\Models\Action;
use Illuminate\Http\Request;
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

    
    public function store(Request $request){

        $request->validate([
            'action_name' => 'required|unique:actions,action_name',
        ]);
        
        Action::create(['action_name'=> $request->input('action_name')]);
    }
    
    public function update(Request $request, Action $action){
        $request->validate([
            'action_name' => "required|unique:actions,action_name,$action->id,id",
            'status' => 'required',
        ]);
        
        $action->update(['action_name'=> $request->input('action_name'), 'status' => $request->input('status')]);
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

    public function import(Request $request)
    {   
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);
    
        try {
            $importFile = $request->file('file');

            Excel::import(new ImportActions, $importFile);
    
            return to_route('/action');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            // Handle validation errors during import
            return back()->with('error', 'Validation error: ' . $e-> $e->getMessage());
        } catch (\Exception $e) {
            // Handle other errors
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
      
    }

    public function downloadTemplate()
    {
        $filename = "Import Actions Template".".xlsx";
        return Excel::download(new ImportActionsTemplate, $filename);
    }
  
}
