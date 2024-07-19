<?php
    namespace App\Http\Controllers\PullErrors;
    use App\Helpers\CommonHelpers;
    use App\Http\Controllers\Controller;
    use Illuminate\Http\Request;
    use Illuminate\Http\RedirectResponse;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Session;
    use Inertia\Inertia;
    use Inertia\Response;
    use DB;
    use App\Models\PullErpErros;
    use Maatwebsite\Excel\Facades\Excel;
    use App\Exports\PullErpErrorsExport;

    class PullErrorsController extends Controller{
        private $sortBy;
        private $sortDir;
        private $perPage;

        public function __construct() {
            $this->table_name  = 'pull_erp_erros';
            $this->primary_key = 'id';
            $this->sortBy = request()->get('sortBy', 'pull_erp_erros.created_at');
            $this->sortDir = request()->get('sortDir', 'desc');
            $this->perPage = request()->get('perPage', 10);
        }

        public function getAllData()
        {
            $query = PullErpErros::query();
            $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));
            $filter = $query->searchAndFilter(request());
            $result = $filter->orderBy($this->sortBy, $this->sortDir);
            return $result;
        }
    
        public function getIndex(){
            if(!CommonHelpers::isView()) {
                return Inertia::render('Errors/RestrictionPage');
            }
            $data = [];
            $data['PullErrors'] = self::getAllData()->paginate($this->perPage)->withQueryString();
            $data['queryParams'] = request()->query();
            return
            Inertia("PullErrors/PullErrors", $data);
        }

        public function export(Request $request){
            $filename = "Pull-errors - " . date ('Y-m-d H:i:s');
            $data = self::getAllData();
            return Excel::download(new PullErpErrorsExport($data), $filename . '.xlsx');
        }
    }
?>