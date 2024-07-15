<?php

namespace App\Http\Controllers\EnrollmentList;
use App\Helpers\CommonHelpers;
use App\Exports\EnrollmentListExport;
use App\Http\Controllers\Controller;
use App\Models\EnrollmentList;
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

    public function getIndex()
    {
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }
        $query = EnrollmentList::query()->with(['dStatus', 'eStatus']); //dep status and enrollment status
        $query->when(request('search'), function ($query, $search) {
            $query->where('sales_order_no', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));

        $enrollmentLists = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();


        return Inertia::render('EnrollmentList/EnrollmentList', [ 'enrollmentLists' => $enrollmentLists, 'queryParams' => request()->query()]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "Enrollment List - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new EnrollmentListExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = EnrollmentList::select([
            'sales_order_no',
            'item_code', 
            'serial_number', 
            'transaction_id', 
            'dep_status', 
            'status_message', 
            'enrollment_status', 
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date")
        ]);

        return $query;
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
