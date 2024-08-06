<?php
namespace App\Http\Controllers\EnrollmentHistory;
use App\Exports\EnrollmentHistoryExport;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\DepCompany;
use App\Models\DepStatus;
use App\Models\EnrollmentHistory;
use App\Models\EnrollmentList;
use App\Models\EnrollmentStatus;
use App\Models\User;
use App\Services\AppleDeviceEnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use DB;
use Maatwebsite\Excel\Facades\Excel;
class EnrollmentHistoryController extends Controller{
    protected $appleService;
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(AppleDeviceEnrollmentService $appleService){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
        $this->appleService = $appleService;
    }

    
    public function getAllData()
    {
        $query = EnrollmentHistory::query()->with([
            'dStatus:id,dep_status,color', 
            'eStatus:id,enrollment_status,color', 
            'createdBy:id,name', 
            'depCompany:id,dep_company_name as name',
        ]);

        $filter = $query->searchAndFilter(request());

        $result = $filter->sort([
            'sortBy' => $this->sortBy,
            'sortDir' => $this->sortDir,
        ]);

        return $result;
    }

    public function export(Request $request)
    {

        $filename = "Enrollment History - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new EnrollmentHistoryExport($data), $filename . '.xlsx');
    }

    public function getIndex(){

        $data = [];

        $data['enrollmentHistory'] = self::getAllData()->paginate($this->perPage)->withQueryString();

        $data['enrollmentStatuses'] = EnrollmentStatus::select('id', 'enrollment_status as name')->get();
        $data['depStatuses'] = DepStatus::select('id', 'dep_status as name')->get();
        $data['users'] = User::select('id as value', 'name as label')->get();
        $data['depCompanies'] = DepCompany::select('id as value', 'dep_company_name as label')->get();
        $data['queryParams'] = request()->query();

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }


        return Inertia("EnrollmentHistory/EnrollmentHistory", $data);
    }
}