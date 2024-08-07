<?php

namespace App\Imports;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;


class ImportCustomer implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation
{
    public function model(array $row)
    {

        $exists = DB::table('customers')->where('customer_name', trim($row['customer_name']))->first();

        if($exists) {
            return null;
        }

        return new Customer([
            'party_number' => trim($row['party_number']),
            'created_at' => $this->transformDate($row['created_at']),
            'customer_code' => trim($row['customer_code']),
            'customer_name' => trim($row['customer_name']),
        ]);

    }

    private function transformDate($value)
    {
        
        if (is_numeric($value)) {
            $date = Date::excelToDateTimeObject($value);
            $carbonDate = Carbon::instance($date);
        } else {
            $carbonDate = Carbon::createFromFormat('Y-m-d', $value);
        }

        $carbonDate->addDay();

        return $carbonDate->format('Y-m-d');
    }


    public function rules(): array
    {
        return [ 
            '*.party_number' => 'required',
            '*.created_at' => 'required',
            '*.customer_name' => 'required',
        ];
    }
}
