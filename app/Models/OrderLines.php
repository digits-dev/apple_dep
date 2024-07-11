<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrderLines extends Model
{
    use HasFactory;
    protected $table = 'list_of_order_lines';
    protected $fillable = ['order_id', 'digits_code','item_description','brand','wh_category','quantity','serial_number', 'enrollment_status_id'];


    public function status(){
        return $this->belongsTo(EnrollmentStatus::class, 'enrollment_status_id', 'id');
    }
    
    public function scopeGetOrderLines()
    {
        $query = "
        SELECT *
        FROM
        (select     
            OEH.ORDER_NUMBER, -- SALES ORDER HEADER
            OEH.CUST_PO_NUMBER, -- SALES ORDER HEADER REF/PO NUMBER
            OEL.LINE_NUMBER,  -- SALES ORDER LINES LINES NUM
            OEL.ORDERED_ITEM, --  SALE ORDER LINES ITEM CODE
            MSI.DESCRIPTION, -- SALES ORDER LINES ITEM DESCRIPTION
            MSI.ATTRIBUTE7 AS BRAND, -- SALES ORDER LINES BRAND
            MSI.ATTRIBUTE8 AS WH_CATEGORY,-- SALES ORDER LINE WH CATEGORY
            OEL.SHIPPED_QUANTITY, -- SALES ORDER LINE QTY SHIPPED
            (1) AS SPLIT_QUANTITY,
            CustName.PARTY_NAME as Customer_name, -- SALES ORDER HEADER CUST NAME
            wnd.Confirm_Date, -- SALES ORDER CONFIRM DATE
            wnd.NAME as DR,-- SALES ORDER DR NUMBER
            
            -- SALES ORDER LINES SERIAL NUMBER START
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
            -- SALES ORDER LINES SERIAL NUMBER END     
            
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
            AND MSI.ORGANIZATION_ID = OOD.ORGANIZATION_ID -- INVENTORY ORG 
            AND MSI.ATTRIBUTE8 IN ('APPLE IPHONE' ,'APPLE IMAC', 'APPLE IPAD', 'APPLE MAC', 'APPLE DEMO') -- WH_CATEGORY
            and wnd.Confirm_Date between TO_DATE('2024/01/01 00:00:00','RRRR/MM/DD HH24:MI:SS') and TO_DATE('2024/01/31 00:00:00','RRRR/MM/DD HH24:MI:SS')
            and (SUBSTR(CustName.PARTY_NAME,LENGTH(CustName.PARTY_NAME)-2,3) = 'CRP' or
                SUBSTR(CustName.PARTY_NAME,LENGTH(CustName.PARTY_NAME)-2,3) = 'DLR' or
                SUBSTR(CustName.PARTY_NAME,LENGTH(CustName.PARTY_NAME)-2,3) = 'CON'
                )
        
        ) X

        UNPIVOT (
                
                SERIAL_NUM
                FOR SERIAL_LINE
                IN (
                    
                SERIAL1 AS 'S1',
                SERIAL2 AS 'S2',
                SERIAL3 AS 'S3',
                SERIAL4 AS 'S4',
                SERIAL5 AS 'S5',
                SERIAL6 AS 'S6',
                SERIAL7 AS 'S7',
                SERIAL8 AS 'S8',
                SERIAL9 AS 'S9',
                SERIAL10 AS 'S10'
                
                )
        )";

        $results = DB::connection('oracle')->select($query);


        return $results;
    }
}
