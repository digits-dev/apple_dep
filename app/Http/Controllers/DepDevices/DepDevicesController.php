<?php

namespace App\Http\Controllers\DepDevices;
use App\Helpers\CommonHelpers;
use App\Exports\DevicesExport;
use App\Http\Controllers\Controller;
use App\Models\Device;
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

    public function getIndex()
    {
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }
        $query = Device::query();
        $query->when(request('search'), function ($query, $search) {
            $query->where('item_code', 'LIKE', "%$search%");
        });

        $devices = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('DepDevices/DepDevices', [ 'devices' => $devices, 'queryParams' => request()->query()]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "DEP Devices - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new DevicesExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = Device::select([
            'item_code', 
            'item_description', 
            'serial_number', 
            'customer_name', 
        ]);

        return $query;
    }
}
