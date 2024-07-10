<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use Illuminate\Foundation\Testing\WithFaker;
use App\Services\AppleDeviceEnrollmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AppleDeviceEnrollmentServiceTest extends TestCase
{
    protected $service;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.apple_api.base_url', 'https://acc-ipt.apple.com/enroll-service/1.0');
        Config::set('services.apple_api.bulk_enroll_endpoint', '/bulk-enroll-devices');
        Config::set('services.apple_api.check_transaction_status_endpoint', '/check-transaction-status');
        Config::set('services.apple_api.show_order_details_endpoint', '/show-order-details');

        $this->service = new AppleDeviceEnrollmentService();
    }

    public function testEnrollDevicesSuccessfully()
    {
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/bulk-enroll-devices' => Http::response([
                "deviceEnrollmentTransactionId" => 'any_random_string_here',
                "enrollDevicesResponse" => [
                    "statusCode" => "SUCCESS",
                    "statusMessage" => "Transaction posted successfully in DEP"
                ]
            ], 200)
        ]);

        $payload = [
            "requestContext" => [
                "shipTo" => "0000742682",
                "timeZone" => "420",
                "langCode" => "en"
            ],
            "transactionId" => "TXN_001123",
            "depResellerId" => "0000742682",
            "orders" => [
                [
                    "orderNumber" => "ORDER_900123",
                    "orderDate" => "2014-08-28T10:10:10Z",
                    "orderType" => "OR",
                    "customerId" => "19827",
                    "poNumber" => "PO_12345",
                    "deliveries" => [
                        [
                            "deliveryNumber" => "D1.2",
                            "shipDate" => "2014-10-10T05:10:00Z",
                            "devices" => [
                                [
                                    "deviceId" => "33645004YAM",
                                    "assetTag" => "A123456"
                                ],
                                [
                                    "deviceId" => "33645006YAM",
                                    "assetTag" => "A123456"
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = $this->service->enrollDevices($payload);

        // Assertions for enrollDevices
        $this->assertIsArray($response, 'Response should be an array');
        $this->assertArrayHasKey('deviceEnrollmentTransactionId', $response, 'Response does not have deviceEnrollmentTransactionId key');
        $this->assertArrayHasKey('enrollDevicesResponse', $response, 'Response does not have enrollDevicesResponse key');
        $this->assertEquals('SUCCESS', $response['enrollDevicesResponse']['statusCode'], 'Failed to enroll devices');
        $this->assertEquals('Transaction posted successfully in DEP', $response['enrollDevicesResponse']['statusMessage']);
    }

    public function testUnEnrollDevicesSuccessfully()
    {

        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/bulk-enroll-devices' => Http::response([
                "deviceEnrollmentTransactionId" => 'any_random_string_here',
                "enrollDevicesResponse" => [
                    "statusCode" => "SUCCESS",
                    "statusMessage" => "Transaction posted successfully in DEP"
                ]
            ], 200)
        ]);        

        $payload = [
            "requestContext" => [
                "shipTo" => "0000742682",
                "timeZone" => "420",
                "langCode" => "en"
            ],
            "transactionId" => "TXN_001124",
            "depResellerId" => "0000742682",
            "orders" => [
                [
                    "orderNumber" => "ORDER_900124",
                    "orderDate" => "2014-08-29T10:10:10Z",
                    "orderType" => "RE",
                    "customerId" => "19828",
                    "poNumber" => "PO_12346",
                    "deliveries" => [
                        [
                            "deliveryNumber" => "D1.3",
                            "shipDate" => "2014-10-11T05:10:00Z",
                            "devices" => [
                                [
                                    "deviceId" => "33645005YAM",
                                    "assetTag" => "A123457"
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $response = $this->service->unEnrollDevices($payload);

        // Assertions for unEnrollDevices
        $this->assertIsArray($response, 'Response should be an array');
        $this->assertArrayHasKey('deviceEnrollmentTransactionId', $response, 'Response does not have deviceEnrollmentTransactionId key');
        $this->assertArrayHasKey('enrollDevicesResponse', $response, 'Response does not have enrollDevicesResponse key');
        $this->assertEquals('SUCCESS', $response['enrollDevicesResponse']['statusCode'], 'Failed to un-enroll devices');
        $this->assertEquals('Transaction posted successfully in DEP', $response['enrollDevicesResponse']['statusMessage']);
    }

}
