<?php

namespace App\Imports;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ImportCustomer implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation
{
    public function model(array $row)
    {

        $exists = DB::table('customers')->where('customer_name', $row['customer_name'])->first();

        if($exists) {
            return null;
        }

        return new Customer([
            'customer_name' => $row['customer_name'],
        ]);

    }


    public function rules(): array
    {
        return [ 
            '*.customer_name' => 'required',
        ];
    }
}
