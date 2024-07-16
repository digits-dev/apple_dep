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

class EnrollmentListExport implements  FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;
    public $query;

    public function __construct($query) {
        $this->query = $query;
    }

    public function headings(): array {
        $headers = [
                    "Sales Order #",
                    "Item Code",
                    "Serial Number",
                    "Transaction ID",
                    "DEP Status",
                    "Status Message",
                    "Enrollment Status",
                    "Created Date",
                ];

        return $headers;
    }

    public function map($item): array {

       $enrollmentLists = [
                    $item->sales_order_no,
                    $item->item_code,
                    $item->serial_number,
                    $item->transaction_id,
                    $item->dStatus->dep_status,
                    $item->status_message,
                    $item->eStatus->enrollment_status,
                    $item->created_date,
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
