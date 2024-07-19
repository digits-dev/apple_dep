<?php

namespace App\Http\Controllers\DepDevices;
use App\Helpers\CommonHelpers;
use App\Exports\DevicesExport;
use App\Http\Controllers\Controller;
use App\Models\DepDevice;
use App\Models\EnrollmentStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Services\AppleDeviceEnrollmentService;
use App\Models\OrderLines;
use App\Models\Order;
use App\Models\EnrollmentList;
use App\Models\JsonRequest;
use App\Models\JsonResponse;
use App\Models\TransactionLog;

class DepDevicesController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;
    
    private const enrollment_status = [
        'Pending' => 1,
        'Enrollment Error' => 2,
        'Enrollment Success' => 3,
        'Completed' => 4,
        'Returned' => 5,
        'Return Error' => 6,
    ];

    private const dep_status = [
        'Success' => 1,
        'GRX-50025' => 2,
    ];

    public function __construct(AppleDeviceEnrollmentService $appleService){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
        $this->appleService = $appleService;
    }

    

    public function getAllData()
    {
        $query = DepDevice::getData();

        $filter = $query->searchAndFilter(request());

        $result = $filter->orderBy($this->sortBy, $this->sortDir);

        return $result;
    }
    
    public function export(Request $request)
    {

        $filename = "DEP Devices - " . date ('Y-m-d H:i:s');

        $data = self::getAllData();

        return Excel::download(new DevicesExport($data), $filename . '.xlsx');
    }

    public function getIndex()
    {
        $data = [];

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data['devices'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['enrollmentStatuses'] = EnrollmentStatus::select('id', 'enrollment_status as name')->get();
        $data['queryParams'] = request()->query();

        return Inertia::render('DepDevices/DepDevices', $data);
    }


}