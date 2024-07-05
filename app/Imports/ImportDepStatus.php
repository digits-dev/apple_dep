<?php

namespace App\Imports;

use App\Models\DepStatus;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ImportDepStatus implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation
{
 
    public function model(array $row)
    {

        $exists = DB::table('dep_statuses')->where('dep_status', $row['dep_status'])->first();

        if($exists) {
            return null;
        }

        return new DepStatus([
            'dep_status' => $row['dep_status'],
        ]);

    }


    public function rules(): array
    {
        return [ 
            '*.dep_status' => 'required',
        ];
    }
}
