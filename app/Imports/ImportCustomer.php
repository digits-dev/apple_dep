<?php

namespace App\Imports;

use app\Helpers\CommonHelpers;
use App\Models\Customer;
use App\Models\DepCompany;
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

        $customerCreate = Customer::create([
            'customer_name' => trim($row['customer_name']),
            'created_at' => now(),
            'note' => 'From Import',
        ]);

        DepCompany::create([
            'dep_company_name'=> trim($row['customer_name']),
            'dep_organization_id' => null,
            'customer_id' => $customerCreate->id,
            'note' => 'From Import',
            'created_by' => CommonHelpers::myId(),
        ]);


        return $customerCreate; 

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
            '*.customer_name' => 'required',
        ];
    }
}
