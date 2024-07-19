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

class PullErpErrorsExport implements  FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
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
                    "Line Number",
                    "Order Ref Number",
                    "Dr",
                    "Digits Code",
                    "Item Description",
                    "Brand",
                    "Wh Category",
                    "Shipped Quantity",
                    "Confirm date",
                    "Serial1",
                    "Serial2",
                    "Serial3",
                    "Serial4",
                    "Serial5",
                    "Serial6",
                    "Serial7",
                    "Serial8",
                    "Serial9",
                    "Serial10",
                    "Error",
                    "Created_at"
                ];

        return $headers;
    }

    public function map($item): array {

       $enrollmentLists = [
                    $item->order_number,
                    $item->customer_name,
                    $item->line_number,
                    $item->order_ref_no,
                    $item->dr_number,
                    $item->digits_code,
                    $item->item_description,
                    $item->brand,
                    $item->wh_category,
                    $item->shipped_quantity,
                    $item->confirm_date,
                    $item->serial1,
                    $item->serial2,
                    $item->serial3,
                    $item->serial4,
                    $item->serial5,
                    $item->serial6,
                    $item->serial7,
                    $item->serial8,
                    $item->serial9,
                    $item->serial10,
                    $item->errors_message,
                    $item->created_at
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
