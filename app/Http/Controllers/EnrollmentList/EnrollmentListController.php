<?php

namespace App\Http\Controllers\EnrollmentList;
use App\Helpers\CommonHelpers;
use App\Exports\EnrollmentListExport;
use App\Http\Controllers\Controller;
use App\Models\DepCompany;
use App\Models\DepStatus;
use App\Models\EnrollmentList;
use App\Models\EnrollmentStatus;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\AppleDeviceEnrollmentService;

class EnrollmentListController extends Controller
{

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
        $query = EnrollmentList::query()->with([
            'dStatus:id,dep_status,color', 
            'eStatus:id,enrollment_status,color', 
            'createdBy:id,name', 
            'updatedBy:id,name', 
            'returnedBy:id,name',
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

        $filename = "Enrollment List - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new EnrollmentListExport($data), $filename . '.xlsx');
    }

    public function getIndex(Request $request)
    {
        $data = [];

        $data['enrollmentLists'] = self::getAllData()->paginate($this->perPage)->withQueryString();

        $data['enrollmentStatuses'] = EnrollmentStatus::select('id', 'enrollment_status as name')->get();
        $data['depStatuses'] = DepStatus::select('id', 'dep_status as name')->get();
        $data['users'] = User::select('id as value', 'name as label')->get();
        $data['depCompanies'] = DepCompany::select('id as value', 'dep_company_name as label')->get();
        $data['queryParams'] = request()->query();

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        return Inertia::render('EnrollmentList/EnrollmentList', $data);

    }

    public function EnrollmentListDetails(EnrollmentList $enrollmentList)
    {
        $enrollmentListWithRelations = $enrollmentList->load(['dStatus', 'eStatus']);

        return Inertia::render('EnrollmentList/EnrollmentListDetails', [ 'enrollmentList' => $enrollmentListWithRelations ]);
    }

    public function checkTransactionStatus($transactionId)
    {
        $requestData = [
            'requestContext' => [
                'shipTo' => config('services.apple_api.ship_to'),
                'timeZone' => config('services.apple_api.timeZone'),
                'langCode' => config('services.apple_api.langCode')
            ],
            'depResellerId' => config('services.apple_api.depResellerId'),
            'deviceEnrollmentTransactionId' => $transactionId
        ];

        try {
            $response = $this->appleService->checkTransactionStatus($requestData);
            return json_encode(["message"=>response()->json($response)]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
