<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;

class ApplePayloadController
{
    public function generatePayload()
    {
        $payload = [
            'requestContext' => [
                'shipTo' => Config::get('services.apple_api.ship_to'),
                'timeZone' => Config::get('services.apple_api.timeZone'),
                'langCode' => Config::get('services.apple_api.langCode'),
                // 'sold_to' => Config::get('services.apple_api.sold_to'),
                // 'sales_org' => Config::get('services.apple_api.sales_org')
            ],
            'transactionId' => 'TXN_' . uniqid(),
            'depResellerId' => Config::get('services.apple_api.depResellerId'),
            // 'orders' => [$orderPayload],
        ];

        return $payload;
    }

    public function generateOrdersPayload($header_data, $dep_company, $orderType, $devicePayload = null, $counter = null){
        $formattedDate = date('Y-m-d\TH:i:s\Z', strtotime($header_data->order_date));
        $formattedShipDate = date('Y-m-d\TH:i:s\Z', strtotime($header_data->ship_date));
        $depCompanyId = is_object($dep_company) ? $dep_company->id : $dep_company;
        $deliveryPayload = [];
        $dPayload = [];

        $dPayload = $devicePayload ?? [
            [
            'deviceId' => $header_data['serial_number'],
            'assetTag' => $header_data['serial_number'],
            ]
        ];

        $deliveryPayload = [
            'deliveryNumber' => $header_data['dr_number'],
            'shipDate' => $formattedShipDate,
            'devices' => $dPayload,
        ];

        $orderPayload = [
            'orderNumber' => $counter ? $header_data['sales_order_no'].'_'.$orderType.''.$counter->code : $header_data['sales_order_no'],
            'orderDate' => $formattedDate,
            'orderType' => $orderType,
            'customerId' => (string)$depCompanyId,
            'poNumber' => $header_data['order_ref_no'],
            'deliveries' => [
                $deliveryPayload
            ],
        ];

        return $orderPayload;
    }

    public function generateVoidOrdersPayload($header_data, $dep_company, $orderType){
       $formattedDate = date('Y-m-d\TH:i:s\Z', strtotime($header_data->order_date));
       $depCompanyId = is_object($dep_company) ? $dep_company->id : $dep_company;
   
        $orderPayload = [
            'orderNumber' => $header_data['sales_order_no'],
            'orderDate' => $formattedDate,
            'orderType' => $orderType,
            'customerId' => (string)$depCompanyId,
            'poNumber' => $header_data['order_ref_no'],
        ];

        return $orderPayload;
    }
}