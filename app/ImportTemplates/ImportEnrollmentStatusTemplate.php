<?php

namespace App\ImportTemplates;

use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromArray;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStyles;

class ImportEnrollmentStatusTemplate implements FromArray, WithHeadings, ShouldAutoSize, WithStyles
{
    public function headings(): array
    {
        return [
            'Enrollment Status',
        ];
    }

    public function array(): array
    {
        return [
            [
                'Complete',
            ],
            [
                'Failed',
            ],
        ];
    }

    
    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('1:1')->getFont()->setBold(true);
        $sheet->getStyle($sheet->calculateWorksheetDimension())->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
    }
}