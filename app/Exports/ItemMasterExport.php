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

class ItemMasterExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    use Exportable;
    public $query;

    public function __construct($query) {
        $this->query = $query;
    }

    public function headings(): array {
        $headers = [
                    "Digits Code",
                    "UPC Code Up 1",
                    "UPC Code Up 2",
                    "UPC Code Up 3",
                    "UPC Code Up 4",
                    "UPC Code Up 5",
                    "WH Category",
                    "Supplier Item Code",
                    "Item Description",
                    "Brand Description",
                ];
        return $headers;

    }

    public function map($item): array {

       $itemMaster = [
                    $item->digits_code,
                    $item->upc_code_up_1,
                    $item->upc_code_up_2,
                    $item->upc_code_up_3,
                    $item->upc_code_up_4,
                    $item->upc_code_up_5,
                    $item->wh_category,
                    $item->supplier_item_code,
                    $item->item_description,
                    $item->brand_description,
                ];
       
        return $itemMaster;
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
