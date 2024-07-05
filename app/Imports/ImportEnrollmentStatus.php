<?php

namespace App\Imports;

use App\Models\Action;
use App\Models\EnrollmentStatus;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ImportEnrollmentStatus implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation

{
       public function model(array $row)
    {

        $exists = DB::table('enrollment_statuses')->where('enrollment_status', $row['enrollment_status'])->first();

        if($exists) {
            return null;
        }

        return new EnrollmentStatus([
            'enrollment_status' => $row['enrollment_status'],
        ]);

    }


    public function rules(): array
    {
        return [ 
            '*.enrollment_status' => 'required',
        ];
    }
}
