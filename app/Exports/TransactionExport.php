<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\TransactionLog;

class TransactionExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */

    function __construct($id) {
        $this->order_id = $id;
    }

    public function collection()
    {
        return TransactionLog::join('dep_statuses', 'dep_statuses.id', '=', 'transaction_logs.dep_status')
        ->select(
            'transaction_logs.order_id',
            'transaction_logs.order_lines_id',
            'transaction_logs.order_type',
            'transaction_logs.dep_transaction_id',
            'dep_statuses.dep_status as dep_status_name',
            'transaction_logs.created_at'
        )
        ->where('transaction_logs.order_id',  $this->order_id)->get();
    }

    public function headings(): array
    {
        return ["Order ID", "Order Lines ID", "Order Type", "Transaction ID", "DEP Status", 'Created Date'];
    }
}