<?php

namespace App\Http\Controllers\ItemMaster;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\ItemMaster;
use Illuminate\Support\Facades\DB;

class ItemMasterController extends Controller
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
        $data = [];
        $query = ItemMaster::query();

        $query->when(request('search'), function ($query, $search) {
            $query->where('digits_code', 'LIKE', "%$search%");
        });

        $query->select('*', DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as created_date"));


        $data['itemMaster'] = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();
        

        return Inertia::render('ItemMaster/ItemMaster', $data);
    }

  
}
