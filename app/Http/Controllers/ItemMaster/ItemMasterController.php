<?php

namespace App\Http\Controllers\ItemMaster;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

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
        $data['queryParams'] = request()->query();

        return Inertia::render('ItemMaster/ItemMaster', $data);
    }

  
}
