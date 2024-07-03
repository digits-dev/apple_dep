<?php

namespace App\Http\Controllers\EnrollmentList;
use App\Exports\EnrollmentListExport;
use App\Http\Controllers\Controller;
use App\Models\EnrollmentList;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EnrollmentListController extends Controller
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
        $query = EnrollmentList::query();

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

}
