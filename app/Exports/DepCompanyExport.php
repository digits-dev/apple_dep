<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStyles;

class DepCompanyExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;
    public $query;

    public function __construct($query) {
        $this->query = $query;
    }

    public function headings(): array {
        $headers = [
                    "DEP Company ID",
                    "DEP Company Name",
                    "Customer Name",
                    "Created By",
                    "Created Date",
                    "Updated By",
                    "Updated Date",
                    "Status"
                ];

        return $headers;
    }

    public function map($item): array {

       $customers = [
                    $item->id,
                    $item->dep_company_name,
                    $item->customers->customer_name,
                    $item->createdBy->name ?? '',
                    $item->created_at,
                    $item->updatedBy->name ?? '',
                    $item->updated_at,
                    $item->status ? "Active" : "Inactive"
                ];
       
        return $customers;
    }

    public function query(){       
        return $this->query;
    }
    
    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $sheet->getStyle($sheet->calculateWorksheetDimension())->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    }

}
