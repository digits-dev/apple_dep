<?php

namespace App\Http\Controllers\DepStatus;
use App\Exports\DepStatusExport;
use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Imports\ImportDepStatus;
use App\ImportTemplates\ImportDepStatusTemplate;
use App\Models\DepStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;

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
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];
        $data['dep_statuses'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia::render('DepStatus/DepStatus', $data);
    }

    public function store(Request $request){

        if(!CommonHelpers::isCreate()) {

            $data = [
                'message' => "You don't have permission to add.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'dep_status' => 'required|unique:dep_statuses,dep_status',
            'color' => 'required',
        ]);
        
        DepStatus::create(['dep_status'=> $request->input('dep_status'), 'color' => $request->input('color')]);

        $data = [
            'message' => "Successfully Added Status.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }
    
    public function update(Request $request, DepStatus $dep_status){

        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'dep_status' => "required|unique:dep_statuses,dep_status,$dep_status->id,id",
            'status' => 'required',
            'color' => 'required',
        ]);

        $dep_status->update(['dep_status'=> $request->input('dep_status'), 'status' => $request->input('status'), 'color' => $request->input('color') ]);

        $data = [
            'message' => "Successfully Updated.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }

    public function bulkUpdate(Request $request){

        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return response()->json($data);
        }

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

        $filename            = "DEP Status - " . date ('Y-m-d H:i:s');
        $result = self::getAllData();

        return Excel::download(new DepStatusExport($result), $filename . '.xlsx');
    }

  
    public function getAllData()
    {

        $query = DepStatus::query();

        $search =   $query->when(request('search'), function ($query, $search) {
            $query->where('dep_status', 'LIKE', "%$search%");
        });
       
        $result =  $search->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }

    public function import(Request $request)
    {   

        if(!CommonHelpers::isCreate()) {

            $data = [
                'message' => "You don't have permission to import.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);
    
        try {
            $importFile = $request->file('file');

            Excel::import(new ImportDepStatus, $importFile);

            $data = [
                'message' => "Import Success", 
                'status' => 'success'
            ];
    
            return  back()->with($data);
        } catch (ValidationException $e) {
            // Handle validation errors during import

            $data = [
                'message' => "Import Failed, Please check template file.", 
                'status' => 'error',
                'error', 'Validation error: ' .  $e->getMessage()
            ];
    
            return  back()->with($data);

        } catch (\Exception $e) {
            // Handle other errors

            $data = [
                'message' => "Something went wrong, Please try again later.", 
                'status' => 'error',
                'error', 'Error: ' .  $e->getMessage()
            ];
    
            return  back()->with($data);
        }
      
    }

    public function downloadTemplate()
    {
        $filename = "Import Dep Status Template".".xlsx";
        return Excel::download(new ImportDepStatusTemplate, $filename);
    }
}
