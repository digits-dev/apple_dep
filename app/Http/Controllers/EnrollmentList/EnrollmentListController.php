<?php

namespace App\Http\Controllers\EnrollmentList;
use App\Helpers\CommonHelpers;
use App\Exports\EnrollmentListExport;
use App\Http\Controllers\Controller;
use App\Models\DepStatus;
use App\Models\EnrollmentList;
use App\Models\EnrollmentStatus;
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
        $query = EnrollmentList::query()->with(['dStatus', 'eStatus']);

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));

        $filter = $query->searchAndFilter(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }
    
    public function export(Request $request)
    {
        date_default_timezone_set('Asia/Manila');

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
                'shipTo' => '0000742682',
                'timeZone' => '420',
                'langCode' => 'en',
            ],
            'depResellerId' => '0000742682',
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
