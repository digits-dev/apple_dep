<?php

namespace App\Imports;

use App\Models\Customer;
use App\Models\DepCompany;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ImportDepCompany implements ToModel, SkipsEmptyRows, WithHeadingRow,  WithValidation
{
    public function model(array $row)
    {
        $customer = Customer::where('customer_name', trim($row['customer_name']))->first();
 
        if (!$customer) {
            throw new \Exception('Customer with name "' . $row['customer_name'] . '" is not found. Make sure it is in the Customer List.');
        }

        $existingDepCompany = DepCompany::where(function ($query) use ($row, $customer) {
            $query->where('dep_company_name', trim($row['dep_company_name']))
                  ->where('customer_id', $customer->id);
        })->first();

        if ($existingDepCompany) {
            return null;
        } else {
            return new DepCompany([
                'customer_id' => $customer->id,
                'dep_company_name' => trim($row['dep_company_name']),
            ]);
        }
    }


    public function rules(): array
    {
        return [ 
            '*.customer_name' => 'required',
            '*.dep_company_name' => 'required',
        ];
    }
}
