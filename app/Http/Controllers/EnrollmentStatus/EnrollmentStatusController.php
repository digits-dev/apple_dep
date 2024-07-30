<?php

namespace App\Http\Controllers\EnrollmentStatus;
use App\Exports\EnrollmentStatusExport;
use app\Helpers\CommonHelpers;
use App\Imports\ImportEnrollmentStatus;
use App\ImportTemplates\ImportEnrollmentStatusTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\EnrollmentStatus;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class EnrollmentStatusController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'id');
        $this->sortDir = request()->get('sortDir', 'asc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex()
    {
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $query = EnrollmentStatus::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('enrollment_status', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));


        $enrollmentStatus = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('EnrollmentStatus/EnrollmentStatus', [ 'enrollment_status' => $enrollmentStatus, 'queryParams' => request()->query()]);
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
            'enrollment_status' => 'required|unique:enrollment_statuses,enrollment_status',
            'color' => 'required',
        ]);
        
        EnrollmentStatus::create(['enrollment_status'=> $request->input('enrollment_status'), 'color' => $request->input('color')]);

        $data = [
            'message' => "Successfully Added Status.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }
    
    public function update(Request $request, EnrollmentStatus $enrollment_status){
        
        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'enrollment_status' => "required|unique:enrollment_statuses,enrollment_status,$enrollment_status->id,id",
            'status' => 'required',
            'color' => 'required',
        ]);

        $enrollment_status->update(['enrollment_status'=> $request->input('enrollment_status'),  'status' => $request->input('status'), 'color' => $request->input('color')]);

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
            'ids.*' => 'exists:enrollment_statuses,id',
            'status' => 'required', 
        ]);

        EnrollmentStatus::whereIn('id', $ids)->update(['status' => $status]);

        $data = ['message'=>'Data updated!', 'status'=>'success'];

        return response()->json($data);
    }

    


    public function export()
    {

        $filename            = "Enrollment Status - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new EnrollmentStatusExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = EnrollmentStatus::select([
            'id', 
            'enrollment_status', 
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date")
        ]);

        return $query;
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

            Excel::import(new ImportEnrollmentStatus, $importFile);
    
            
            $data = [
                'message' => "Import Successful.", 
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
        $filename = "Import Enrollment Status Template".".xlsx";
        return Excel::download(new ImportEnrollmentStatusTemplate, $filename);
    }
  
}
