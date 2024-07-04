<?php

namespace App\Http\Controllers\Customer;
use App\Exports\CustomerExport;
use App\Http\Controllers\Controller;
use App\Imports\ImportCustomer;
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
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex()
    {
        $query = Customer::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('customer_name', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));


        $customers = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('Customer/Customer', [ 'customers' => $customers, 'queryParams' => request()->query()]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "Customers - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new CustomerExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = Customer::select([
            'id', 
            'customer_name', 
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

            Excel::import(new ImportCustomer, $importFile);
    
            return to_route('/customer');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            // Handle validation errors during import
            return back()->with('error', 'Validation error: ' . $e->getMessage());
        } catch (\Exception $e) {
            // Handle other errors
            return back()->with('error', 'Error: ' . $e->getMessage());
        }
      
    }
  
}
