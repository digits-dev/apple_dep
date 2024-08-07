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
            'customer_code' => 'required|unique:customers,customer_code',
            'customer_name' => 'required|unique:customers,customer_name',
        ]);
        
        Customer::create([
                        'party_number'=> $request->input('party_number'),
                        'customer_code'=> $request->input('customer_code'),
                        'customer_name'=> $request->input('customer_name')
                        ]);

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

        $customer->update([
            'party_number'=> $request->input('party_number'),
            'customer_code'=> $request->input('customer_code'), 
            'customer_name'=> $request->input('customer_name'), 
            'status' => $request->input('status')
        ]);

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
        $result = self::getAllData();

        return Excel::download(new CustomerExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {

        $query = Customer::query();

        $search = $query->search(request());
       
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

    public function getCustomers(Request $request) {
        $secretKey = config('services.customers.key');
        $url = config('services.customers.url');
        
        $uniqueString = time(); 
        if (php_sapi_name() == 'cli') {
            $userAgent = 'Scheduled Task';
        } else {
            $userAgent = $request->header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36');
        }
        $xAuthorizationToken = md5( $secretKey . $uniqueString . $userAgent);
        $xAuthorizationTime = $uniqueString;
        $vars = [
            "your_param"=>1
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_POST, FALSE);
        curl_setopt($ch, CURLOPT_POSTFIELDS,null);
        curl_setopt($ch, CURLOPT_HTTPGET, TRUE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_TIMEOUT, 300);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT , 30);

        $headers = [
        'X-Authorization-Token: ' . $xAuthorizationToken,
        'X-Authorization-Time: ' . $xAuthorizationTime,
        'User-Agent: '.$userAgent
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $server_output = curl_exec ($ch);
        curl_close ($ch);

        $response = json_decode($server_output, true);
        $data = [];
        if(!empty($response["data"])) {
            foreach ($response["data"] as $key => $value) {
                DB::beginTransaction();
                try {
                    Customer::updateOrInsert([
                        'customer_name'    => $value['customer_name'] 
                    ],
                    [
                        'customer_code'    => $value['customer_code'],
                        'customer_name'    => $value['customer_name'],
                        'status'           => 1,
                        'created_at'       => date('Y-m-d H:i:s')
                    ]);
                    DB::commit();
                } catch (\Exception $e) {
                    \Log::debug($e);
                    DB::rollback();
                }
                
            }
        }
        \Log::info('Customers item Create: executed! items');
    }
  
}
