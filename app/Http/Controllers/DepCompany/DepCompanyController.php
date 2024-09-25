<?php
namespace App\Http\Controllers\DepCompany;
use App\Exports\DepCompanyExport;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Imports\ImportDepCompany;
use App\ImportTemplates\ImportDepCompanyTemplate;
use App\Models\Customer;
use App\Models\DepCompany;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use DB;
use Maatwebsite\Excel\Facades\Excel;
class DepCompanyController extends Controller{
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

        $data['depCompanies'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();
        $data['customers'] = Customer::select('id as value', 'customer_name as label')->get();

        return Inertia::render('DepCompany/DepCompany', $data);
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
            'customer_id' => 'required',
            'note' => 'required',
            'dep_organization_id' => 'required|unique:dep_companies,dep_organization_id',
            'dep_company_name' => 'required|unique:dep_companies,dep_company_name'
        ], [
            'customer_id.required' => 'The Customer Name is required.',
            'note.required' => 'You must add a Note.',
            'dep_organization_id.required' => 'The DEP Organization Id is required.',
            'dep_organization_id.unique' => 'The DEP Organization Id exist.',
            'dep_company_name.required' => 'The DEP Company Name is required.'
        ]);
        

        DepCompany::create([
            'dep_company_name'=> trim($request->input('dep_company_name')),
            'dep_organization_id' => $request->input('dep_organization_id'),
            'customer_id' => $request->input('customer_id'),
            'note' => $request->input('note'),
            'created_by' => CommonHelpers::myId(),
        ]);

        $data = [
            'message' => "DEP Company added successfully", 
            'status' => 'success'
        ];

        return back()->with($data);
    }
    
    public function update(Request $request, DepCompany $depCompany){

        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'customer_id' => 'required',
            'note' => 'required',
            'dep_organization_id' => 'required|unique:dep_companies,dep_organization_id,' . $depCompany->id,
            'dep_company_name' => "required|unique:dep_companies,dep_company_name,$depCompany->id,id",
            'status' => 'required',
        ], [
            'customer_id.required' => 'The Customer Name is required.',
            'note.required' => 'You must add a Note.',
            'dep_organization_id.required' => 'The DEP Organization Id is required.',
            'dep_organization_id.unique' => 'The DEP Organization Id exist.',
            'dep_company_name.required' => 'The DEP Company Name is required.'
        ]);

        
        $depCompany->update([
            'dep_company_name'=> trim($request->input('dep_company_name')),
            'dep_organization_id' => $request->input('dep_organization_id'),
            'customer_id' => $request->input('customer_id'),
            'note' => $request->input('note'), 
            'status' => $request->input('status'),
            'updated_by' => CommonHelpers::myId(),
        ]);

        $data = [
            'message' => "DEP Company updated successfully", 
            'status' => 'success'
        ];

        return back()->with($data);
    }

    public function bulkUpdate(Request $request){

        $ids = $request->input('ids');
        $status = $request->input('status');

        $request->validate([
            'ids' => 'required',
            'ids.*' => 'exists:dep_companies,id',
            'status' => 'required', 
        ]);

        DepCompany::whereIn('id', $ids)->update(['status' => $status]);

        $data = ['message'=>'Data updated!', 'status'=>'success'];

        return response()->json($data);
    }


    public function export()
    {

        $filename            = "DEP Company - " . date ('Y-m-d H:i:s');
        $result = self::getAllData();

        return Excel::download(new DepCompanyExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = DepCompany::query()->with(['createdBy:id,name', 'updatedBy:id,name', 'customers:id,customer_name']);

        $search = $query->search(request());

        $result = $search->sort([
            'sortBy' => $this->sortBy,
            'sortDir' => $this->sortDir,
        ]);

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

            Excel::import(new ImportDepCompany, $importFile);
    
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
                'message' => $e->getMessage() ??  "Something went wrong, Please try again later.", 
                'status' => 'error',
                'error', 'Error: ' .  $e->getMessage()
            ];

            return  back()->with($data);

        }
      
    }

    public function downloadTemplate()
    {
        $filename = "Import Dep Company Template".".xlsx";
        return Excel::download(new ImportDepCompanyTemplate, $filename);
    }
}