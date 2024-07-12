<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Client\RequestException;
use App\Services\AppleDeviceEnrollmentService;

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

    // ENROLL

    public function testEnrollDevicesSuccessfully()
    {
        
        $service = new AppleDeviceEnrollmentService();

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

        // Call the actual method that performs enrollment
        $response = $service->enrollDevices($payload);

        // Assertions against the actual response returned
        $this->assertIsArray($response, 'Response should be an array');
        $this->assertArrayHasKey('deviceEnrollmentTransactionId', $response, 'Response does not have deviceEnrollmentTransactionId key');
        $this->assertArrayHasKey('enrollDevicesResponse', $response, 'Response does not have enrollDevicesResponse key');
        $this->assertEquals('SUCCESS', $response['enrollDevicesResponse']['statusCode'], 'Failed to enroll devices');
        $this->assertEquals('Transaction posted successfully in DEP', $response['enrollDevicesResponse']['statusMessage']);
    }


    public function testUnEnrollDevicesSuccessfully()
    {

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



    //ENROLL DEVICES UNAVAILABLE

    public function testEnrollDevicesApiUnavailable()
    {

        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/bulk-enroll-devices' => Http::response(['message' => 'Network Error'], 500),
        ]);

        $service = new AppleDeviceEnrollmentService();

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

        $this->expectException(\Exception::class);
        $service->enrollDevices($payload);
    }

    public function testUnEnrollDevicesApiUnavailable()
    {

        // Mocking the API response to simulate an API failure
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/bulk-enroll-devices' => Http::response(['message' => 'Network Error'], 500),
        ]);

        $service = new AppleDeviceEnrollmentService();

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
                    "orderType" => "RE",
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

        // Expecting an exception to be thrown when the API is unavailable
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Failed to bulk enroll devices');

        $service->enrollDevices($payload);
    }

    // CHECK TRANSACTION STATUS

    public function testCheckTransactionStatusSuccess()
    {
        $expectedResponse = [
            "deviceEnrollmentTransactionID" => "e07daa6c-b3e2-4c5b-a341-4781b8e30991_1414031280097",
            "statusCode" => "COMPLETE",
            "orders" => [
                [
                    "orderNumber" => "ORDER_900123",
                    "orderPostStatus" => "COMPLETE",
                    "deliveries" => [
                        [
                            "deliveryNumber" => "D1.2",
                            "deliveryPostStatus" => "COMPLETE",
                            "devices" => [
                                [
                                    "devicePostStatus" => "COMPLETE",
                                    "deviceId" => "33645004YAM"
                                ],
                                [
                                    "devicePostStatus" => "COMPLETE",
                                    "deviceId" => "33645006YAM"
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $service = new AppleDeviceEnrollmentService();

        $requestData = [
            "requestContext" => [
                "shipTo" => "0000742682",
                "timeZone" => "420",
                "langCode" => "en"
            ],
            "depResellerId" => "0000742682",
            "deviceEnrollmentTransactionId" => "e07daa6c-b3e2-4c5b-a341-4781b8e30991_1414031280097"
        ];

        $response = $service->checkTransactionStatus($requestData);

        $this->assertEquals($expectedResponse['deviceEnrollmentTransactionID'], $response['deviceEnrollmentTransactionID']);
        $this->assertEquals($expectedResponse['statusCode'], $response['statusCode']);
    }


    public function testCheckTransactionStatusApiUnavailable()
    {
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/check-transaction-status' => Http::response(['message' => 'Failed to check transaction status'], 500),
        ]);

        $service = new AppleDeviceEnrollmentService();

        $requestData = [
            "transactionId" => "TXN_001123",
            "depResellerId" => "0000742682",
        ];

        $this->expectException(\Exception::class);
        $service->checkTransactionStatus($requestData);
    }

    // SHOW ORDER DETAILS

    public function testShowOrderDetailsSuccess()
    {
        $expectedResponse = [
            "statusCode" => "COMPLETE",
            "orders" => [
                [
                    "orderNumber" => "ORDER_900130",
                    "deliveries" => [
                        [
                            "deliveryNumber" => "D1.2",
                            "shipDate" => "2014-10-10T05:10:00Z",
                            "devices" => [
                                [
                                    "assetTag" => "A123462",
                                    "deviceId" => "33645011YAM"
                                ]
                            ]
                        ]
                    ],
                    "orderDate" => "2014-08-28T10:10:10Z",
                    "orderType" => "OR",
                    "poNumber" => "PO_12352",
                    "customerId" => "19834"
                ]
            ]
        ];

        $service = new AppleDeviceEnrollmentService();

        $requestContext = [
            "shipTo" => "0000742682",
            "timeZone" => "420",
            "langCode" => "en"
        ];
        $depResellerId = "0000742682";
        $orderNumbers = ["ORDER_900130"]; // Example order number

        // Calling the showOrderDetails method
        $response = $service->showOrderDetails($requestContext, $depResellerId, $orderNumbers);
        
        $this->assertEquals($expectedResponse['orders'], $response['orders']);
        $this->assertEquals($expectedResponse['statusCode'], $response['statusCode']);
    }

    public function testShowOrderDetailsApiUnavailable()
    {
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/show-order-details' => Http::response(['message' => 'Network Error'], 500),
        ]);

        $service = new AppleDeviceEnrollmentService();

        $requestContext = [
            "shipTo" => "0000742682",
            "timeZone" => "420",
            "langCode" => "en"
        ];
        $depResellerId = "0000742682";
        $orderNumbers = ["ORDER_900130"];

        // Calling the showOrderDetails method
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Failed to show order details');

        $service->showOrderDetails($requestContext, $depResellerId, $orderNumbers);
    }

}
