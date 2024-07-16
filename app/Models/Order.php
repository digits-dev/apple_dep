<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $filterable = ['sales_order_no', 'customer_name', 'order_ref_no', 'dep_order', 'enrollment_status', 'order_date'];

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    $query->orWhere($field, 'LIKE', "%$search%");
                }
            });
        }

        foreach ($this->filterable as $field) {
            if ($request->filled($field)) {
                $value = $request->input($field);
                $query->where($field, 'LIKE', "%$value%");
            }
        }
    
        return $query;
    }

    public function status(){
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status', 'id');
    }


    public function scopeGetOrdersFromErp(){
        $query = "
        select 
            
            OEH.ORDER_NUMBER, 
            OEH.CUST_PO_NUMBER, 
            OEL.LINE_NUMBER,  
            OEL.ORDERED_ITEM,
            MSI.DESCRIPTION, 
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
            
            
        from 
            OE_ORDER_HEADERS_ALL OEH, 
            OE_ORDER_LINES_ALL OEL,
            org_organization_definitions OOD,
            wsh_delivery_details wdd,
            wsh_new_deliveries wnd,
            Wsh_delivery_assignments wda,
            hz_parties CustName,
            hz_cust_accounts CustAccount,
            MTL_TXN_REQUEST_LINES  MTRL,
            MTL_system_items MSI
            
        where

            OEH.HEADER_ID = OEL.HEADER_ID(+)
            and OEH.SHIP_FROM_ORG_ID = OOD.ORGANIZATION_ID (+)
            and OEL.LINE_ID = wdd.source_line_id (+)
            and wdd.delivery_detail_id = wda.delivery_detail_id(+) 
            and wda.delivery_id = wnd.delivery_id(+) 
            and OEH.ORDER_CATEGORY_CODE != 'RETURN'
            AND wdd.CUSTOMER_ID = CustAccount.cust_account_id
            AND CustAccount.Party_id = CustName.PARTY_ID
            and OOD.ORGANIZATION_ID = 224
            and wdd.INV_INTERFACED_FLAG = 'Y'
            and wdd.OE_INTERFACED_FLAG = 'Y'
            AND wdd.MOVE_ORDER_LINE_ID = MTRL.LINE_ID
            AND OEL.INVENTORY_ITEM_ID = MSI.INVENTORY_ITEM_ID
            AND MSI.ORGANIZATION_ID = OOD.ORGANIZATION_ID 
            AND MSI.ATTRIBUTE8 IN ('APPLE IPHONE' ,'APPLE IMAC', 'APPLE IPAD', 'APPLE MAC', 'APPLE DEMO') 
            and wnd.Confirm_Date between TO_DATE('2024/01/01 00:00:00','RRRR/MM/DD HH24:MI:SS') and TO_DATE('2024/07/31 00:00:00','RRRR/MM/DD HH24:MI:SS')
            and (SUBSTR(CustName.PARTY_NAME,LENGTH(CustName.PARTY_NAME)-2,3) = 'CRP' or
                SUBSTR(CustName.PARTY_NAME,LENGTH(CustName.PARTY_NAME)-2,3) = 'DLR' or
                SUBSTR(CustName.PARTY_NAME,LENGTH(CustName.PARTY_NAME)-2,3) = 'CON'
                )";

        $results = DB::connection('oracle')->select($query);

        return $results;

    }

}
