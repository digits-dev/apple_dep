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

class OrdersExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;
    public $query;

    public function __construct($query) {
        $this->query = $query;
    }

    public function headings(): array {
        $headers = [
                    "Sales Order #",
                    "Customer Name",
                    "Order Ref #",
                    "DEP Order",
                    "Enrollment Status",
                    "Order Date",
                ];
        return $headers;

    }

    public function map($item): array {

       $orders = [
                    $item->sales_order_no,
                    $item->customer_name,
                    $item->order_ref_no,
                    $item->dep_order ? "Yes" : "No",
                    $item->status->enrollment_status,
                    $item->order_date,
                ];
       
        return $orders;
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
