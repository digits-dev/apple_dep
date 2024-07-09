<?php

namespace App\Http\Controllers\DepStatus;
use App\Exports\DepStatusExport;
use App\Http\Controllers\Controller;
use App\Imports\ImportDepStatus;
use App\ImportTemplates\ImportDepStatusTemplate;
use App\Models\DepStatus;
use Illuminate\Http\Request;
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

    public function store(Request $request){

        $request->validate([
            'dep_status' => 'required|unique:dep_statuses,dep_status',
        ]);
        
        DepStatus::create(['dep_status'=> $request->input('dep_status')]);
    }
    
    public function update(Request $request, DepStatus $dep_status){
        $request->validate([
            'dep_status' => "required|unique:dep_statuses,dep_status,$dep_status->id,id",
            'status' => 'required',
        ]);

        $dep_status->update(['dep_status'=> $request->input('dep_status'), 'status' => $request->input('status')]);
    }

    public function bulkUpdate(Request $request){

        $ids = $request->input('ids');
        $status = $request->input('status');

        $request->validate([
            'ids' => 'required',
            'ids.*' => 'exists:dep_statuses,id',
            'status' => 'required', 
        ]);

        DepStatus::whereIn('id', $ids)->update(['status' => $status]);

        $data = ['message'=>'Data updated!', 'status'=>'success'];

        return response()->json($data);
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

    public function import(Request $request)
    {   
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);
    
        try {
            $importFile = $request->file('file');

            Excel::import(new ImportDepStatus, $importFile);
    
            return to_route('/dep_status');
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
        $filename = "Import Dep Status Template".".xlsx";
        return Excel::download(new ImportDepStatusTemplate, $filename);
    }
}
