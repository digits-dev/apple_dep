<?php

namespace App\Http\Controllers\Action;
use App\Exports\ActionsExport;
use app\Helpers\CommonHelpers;
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

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data['actions'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia::render('Action/Action', $data);
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
            'action_name' => 'required|unique:actions,action_name',
        ]);
        
        Action::create(['action_name'=> $request->input('action_name')]);

        $data = [
            'message' => "Successfully Added Action.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }
    
    public function update(Request $request, Action $action){

        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'action_name' => "required|unique:actions,action_name,$action->id,id",
            'status' => 'required',
        ]);
        
        $action->update(['action_name'=> $request->input('action_name'), 'status' => $request->input('status')]);

        $data = [
            'message' => "Successfully Updated.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }

    public function bulkUpdate(Request $request){

        $ids = $request->input('ids');
        $status = $request->input('status');

        $request->validate([
            'ids' => 'required',
            'ids.*' => 'exists:actions,id',
            'status' => 'required', 
        ]);

        Action::whereIn('id', $ids)->update(['status' => $status]);

        $data = ['message'=>'Data updated!', 'status'=>'success'];

        return response()->json($data);
    }


    public function export()
    {

        $filename            = "Actions - " . date ('Y-m-d H:i:s');
        $result = self::getAllData();

        return Excel::download(new ActionsExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {

        $query = Action::query();

        $search =  $query->when(request('search'), function ($query, $search) {
            $query->where('action_name', 'LIKE', "%$search%");
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

            Excel::import(new ImportActions, $importFile);
    
            $data = [
                'message' => "Import Success", 
                'status' => 'success'
            ];
    
            return  back()->with($data);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
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
        $filename = "Import Actions Template".".xlsx";
        return Excel::download(new ImportActionsTemplate, $filename);
    }
  
}
