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
}