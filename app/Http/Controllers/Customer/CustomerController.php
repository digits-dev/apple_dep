<?php

namespace App\Http\Controllers\Customer;
use App\Helpers\CommonHelpers;
use App\Exports\CustomerExport;
use App\Http\Controllers\Controller;
use App\Imports\ImportCustomer;
use App\ImportTemplates\ImportCustomerTemplate;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
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

        $data = [];
        $data['customers'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia::render('Customer/Customer', $data);
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
            'customer_name' => 'required|unique:customers,customer_name',
        ]);
        
        Customer::create(['customer_name'=> $request->input('customer_name')]);

        $data = [
            'message' => "Successfully Added Customer.", 
            'status' => 'success'
        ];

        return back()->with($data);
    }
    public function update(Request $request, Customer $customer){

        if(!CommonHelpers::isUpdate()) {

            $data = [
                'message' => "You don't have permission to update.", 
                'status' => 'error'
            ];

            return back()->with($data);
        }

        $request->validate([
            'customer_name' => "required|unique:customers,customer_name,$customer->id,id",
            'status' => 'required',
        ]);

        $customer->update(['customer_name'=> $request->input('customer_name'), 'status' => $request->input('status')]);

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
            'ids.*' => 'exists:customers,id',
            'status' => 'required', 
        ]);

        Customer::whereIn('id', $ids)->update(['status' => $status]);

        $data = ['message'=>'Data updated!', 'status'=>'success'];

        return response()->json($data);
    }

    public function export()
    {

        $filename            = "Customers - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new CustomerExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {

        $query = Customer::query();

        $search =  $query->when(request('search'), function ($query, $search) {
            $query->where('customer_name', 'LIKE', "%$search%");
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

            Excel::import(new ImportCustomer, $importFile);

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
        $filename = "Import Customer Template".".xlsx";
        return Excel::download(new ImportCustomerTemplate, $filename);
    }
  
}
