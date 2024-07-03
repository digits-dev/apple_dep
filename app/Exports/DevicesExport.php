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

class DevicesExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithColumnWidths
{
    use Exportable;
    public $query;

    public function __construct($query) {
        $this->query = $query;
    }

    public function headings(): array {
        $headers = [
                    "Item Code",
                    "Item Description",
                    "Serial Number",
                    "Customer Name",
                ];

        return $headers;
    }

    public function map($item): array {

       $devices = [
                    $item->item_code,
                    $item->item_description,
                    $item->serial_number,
                    $item->customer_name ,
                ];
       
        return $devices;
    }

    public function query(){       
        return $this->query;
    }
    
    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $sheet->getStyle($sheet->calculateWorksheetDimension())->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    }

   
    public function columnWidths(): array
    {
        return [
            'B' => 45, 
        ];
    }
}
