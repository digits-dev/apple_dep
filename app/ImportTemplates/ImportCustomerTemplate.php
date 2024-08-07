<?php 

namespace App\ImportTemplates;


use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromArray;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStyles;

class ImportCustomerTemplate implements FromArray, WithHeadings, ShouldAutoSize, WithStyles
{
    public function headings(): array
    {
        return [
            'Party Number',
            'Customer Code',
            'Customer Name',
            'Created Date',
        ];
    }

    public function array(): array
    {
        return [
            [
                '22501',
                'CUS-0001',
                'Acme Corporation',
                '29/04/2019 10:38:14'
            ],
            [   
                '22502',
                'CUS-0002',
                'Acme2 Corporation',
                '29/04/2019 10:38:14'
            ],
        ];
    }

    
    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $sheet->getStyle($sheet->calculateWorksheetDimension())->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    }
}