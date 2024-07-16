<?php

namespace App\Http\Controllers\DepDevices;
use App\Helpers\CommonHelpers;
use App\Exports\DevicesExport;
use App\Http\Controllers\Controller;
use App\Models\DepDevice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DepDevicesController extends Controller
{
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct(){
        $this->sortBy = request()->get('sortBy', 'created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
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
        date_default_timezone_set('Asia/Manila');

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
        $data['queryParams'] = request()->query();

        return Inertia::render('DepDevices/DepDevices', $data);
    }

}