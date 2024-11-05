<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = [];

    protected $filterable = [
        'sales_order_no',
        'customer_id',
        'order_ref_no',
        'dep_order',
        'enrollment_status',
        'order_date'
    ];

    public function scopeSearchAndFilter($query, $request)
    {
        //search function
        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if ($field === 'enrollment_status') {
                        $query->orWhereHas('status', function ($query) use ($search) {
                            $query->where('enrollment_status', 'LIKE', "%$search%");
                        });
                    } else if ($field === 'customer_id') {
                        $query->orWhereHas('customer', function ($query) use ($search) {
                            $query->where('customer_name', 'LIKE', "%$search%");
                        });
                    } else if ($field === 'order_date') {
                        $query->orWhereDate($field, $search);
                    } else {
                        $query->orWhere($field, 'LIKE', "%$search%");
                    }
                }
            });
        } else {

            //filter function
            foreach ($this->filterable as $field) {
                if ($request->filled($field)) {
                    $value = $request->input($field);

                    if (in_array($field, [ 'dep_order', 'enrollment_status', 'customer_id' ])) {
                        $query->where($field, '=', $value);

                    }  else if ($field === 'order_date') {
                        $query->whereDate($field, $value);

                    } else {
                        $query->where($field, 'LIKE', "%$value%");

                    }

                }
            }
        }

        return $query;
    }


    public function status()
    {
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status', 'id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }


    public function scopeGetOrdersFromErp($query, $datefrom, $dateto)
    {
        $sql = "
        SELECT
            OEH.ORDER_NUMBER,
            OEH.CUST_PO_NUMBER,
            OEL.LINE_NUMBER,
            OEL.ORDERED_ITEM,
            MSI.DESCRIPTION,
            OEH.CREATION_DATE AS order_date,
            MSI.ATTRIBUTE7 AS BRAND,
            MSI.ATTRIBUTE8 AS WH_CATEGORY,
            OEL.SHIPPED_QUANTITY,
            CustName.PARTY_NAME as Customer_name,
            wnd.Confirm_Date,
            wnd.NAME as DR,
            MTRL.ATTRIBUTE12 SERIAL1,
            MTRL.ATTRIBUTE13 SERIAL2,
            MTRL.ATTRIBUTE14 SERIAL3,
            MTRL.ATTRIBUTE15 SERIAL4,
            MTRL.ATTRIBUTE4 SERIAL5,
            MTRL.ATTRIBUTE5 SERIAL6,
            MTRL.ATTRIBUTE6 SERIAL7,
            MTRL.ATTRIBUTE7 SERIAL8,
            MTRL.ATTRIBUTE8 SERIAL9,
            MTRL.ATTRIBUTE9 SERIAL10
        FROM
            OE_ORDER_HEADERS_ALL OEH,
            OE_ORDER_LINES_ALL OEL,
            org_organization_definitions OOD,
            wsh_delivery_details wdd,
            wsh_new_deliveries wnd,
            Wsh_delivery_assignments wda,
            hz_parties CustName,
            hz_cust_accounts CustAccount,
            MTL_TXN_REQUEST_LINES MTRL,
            MTL_system_items MSI
        WHERE
            OEH.HEADER_ID = OEL.HEADER_ID(+)
            AND OEH.SHIP_FROM_ORG_ID = OOD.ORGANIZATION_ID (+)
            AND OEL.LINE_ID = wdd.source_line_id (+)
            AND wdd.delivery_detail_id = wda.delivery_detail_id(+)
            AND wda.delivery_id = wnd.delivery_id(+)
            AND OEH.ORDER_CATEGORY_CODE != 'RETURN'
            AND wdd.CUSTOMER_ID = CustAccount.cust_account_id
            AND CustAccount.Party_id = CustName.PARTY_ID
            AND OOD.ORGANIZATION_ID = 224
            AND wdd.INV_INTERFACED_FLAG = 'Y'
            AND wdd.OE_INTERFACED_FLAG = 'Y'
            AND wdd.MOVE_ORDER_LINE_ID = MTRL.LINE_ID
            AND OEL.INVENTORY_ITEM_ID = MSI.INVENTORY_ITEM_ID
            AND MSI.ORGANIZATION_ID = OOD.ORGANIZATION_ID
            AND MSI.ATTRIBUTE8 IN ('APPLE IPHONE', 'APPLE IMAC', 'APPLE IPAD', 'APPLE MAC', 'APPLE DEMO')
            AND wnd.Confirm_Date BETWEEN TO_DATE(:datefrom || ' 00:00:00','YYYY/MM/DD HH24:MI:SS') 
            AND TO_DATE(:dateto || ' 23:59:59','YYYY/MM/DD HH24:MI:SS')
            AND (
                SUBSTR(CustName.PARTY_NAME, LENGTH(CustName.PARTY_NAME) - 2, 3) IN ('CRP', 'DLR', 'DIG', 'CON')
            )
        ";
    
        $results = DB::connection('oracle')->select($sql, [
            'datefrom' => $datefrom,
            'dateto' => $dateto,
        ]);
    
        return $results;
    }
    

}
