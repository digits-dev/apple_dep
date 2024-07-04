<?php

namespace App\Imports;

use App\Models\Action;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ImportActions implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation
{
    public function model(array $row)
    {

        $exists = DB::table('actions')->where('action_name', $row['action_name'])->first();

        if($exists) {
            return null;
        }

        return new Action([
            'action_name' => $row['action_name'],
        ]);

    }


    public function rules(): array
    {
        return [ 
            '*.action_name' => 'required',
        ];
    }
}
