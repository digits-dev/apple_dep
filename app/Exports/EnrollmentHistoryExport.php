<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStyles;

class EnrollmentHistoryExport implements  FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;
    public $query;

    public function __construct($query) {
        $this->query = $query;
    }

    public function headings(): array {
        $headers = [
                    "DEP Status",
                    "Enrollment Status",
                    "Sales Order #",
                    "Item Code",
                    "Serial Number",
                    "Transaction ID",
                    "DEP Company",
                    "Status Message",
                    "Date",
                    "User",
                ];

        return $headers;
    }

    public function map($item): array {

       $enrollmentLists = [
                    $item->dStatus?->dep_status,
                    $item->eStatus?->enrollment_status,
                    $item->sales_order_no,
                    $item->item_code,
                    $item->serial_number,
                    $item->transaction_id,
                    $item->depCompany->name,
                    $item->status_message,
                    !empty($item->created_at) ? date('Y-m-d', strtotime($item->created_at)) : null,
                    $item->createdBy?->name,
                ];
       
        return $enrollmentLists;
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
