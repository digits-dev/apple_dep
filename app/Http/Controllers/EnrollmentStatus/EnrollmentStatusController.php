<?php

namespace App\Http\Controllers\EnrollmentStatus;
use App\Exports\EnrollmentStatusExport;
use Inertia\Inertia;
use App\Models\EnrollmentStatus;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class EnrollmentStatusController extends Controller
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
        $query = EnrollmentStatus::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('enrollment_status', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));


        $enrollmentStatus = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        return Inertia::render('EnrollmentStatus/EnrollmentStatus', [ 'enrollment_status' => $enrollmentStatus, 'queryParams' => request()->query()]);
    }

    public function export()
    {
        date_default_timezone_set('Asia/Manila');

        $filename            = "Enrollment Status - " . date ('Y-m-d H:i:s');
        $result = self::getAllData()->orderBy($this->sortBy, $this->sortDir);

        return Excel::download(new EnrollmentStatusExport($result), $filename . '.xlsx');
    }

    public function getAllData()
    {
        $query = EnrollmentStatus::select([
            'id', 
            'enrollment_status', 
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date")
        ]);

        return $query;
    }
  
}
