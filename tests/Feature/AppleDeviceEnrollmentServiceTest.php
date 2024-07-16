<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;
use App\Services\AppleDeviceEnrollmentService;
use Illuminate\Http\Client\ConnectionException;

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
        $response = $this->service->enrollDevices($payload);

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
        $this->service->enrollDevices($payload);
    }

    public function testUnEnrollDevicesApiUnavailable()
    {

        // Mocking the API response to simulate an API failure
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/bulk-enroll-devices' => Http::response(['message' => 'Network Error'], 500),
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

        $this->service->enrollDevices($payload);
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


        $requestData = [
            "requestContext" => [
                "shipTo" => "0000742682",
                "timeZone" => "420",
                "langCode" => "en"
            ],
            "depResellerId" => "0000742682",
            "deviceEnrollmentTransactionId" => "e07daa6c-b3e2-4c5b-a341-4781b8e30991_1414031280097"
        ];

        $response = $this->service->checkTransactionStatus($requestData);

        $this->assertEquals($expectedResponse['deviceEnrollmentTransactionID'], $response['deviceEnrollmentTransactionID']);
        $this->assertEquals($expectedResponse['statusCode'], $response['statusCode']);
    }


    public function testCheckTransactionStatusApiUnavailable()
    {
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/check-transaction-status' => Http::response(['message' => 'Failed to check transaction status'], 500),
        ]);


        $requestData = [
            "transactionId" => "TXN_001123",
            "depResellerId" => "0000742682",
        ];

        $this->expectException(\Exception::class);
        $this->service->checkTransactionStatus($requestData);
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


        $requestContext = [
            "shipTo" => "0000742682",
            "timeZone" => "420",
            "langCode" => "en"
        ];
        $depResellerId = "0000742682";
        $orderNumbers = ["ORDER_900130"];

        // Calling the showOrderDetails method
        $response = $this->service->showOrderDetails($requestContext, $depResellerId, $orderNumbers);

        $this->assertEquals($expectedResponse['orders'], $response['orders']);
        $this->assertEquals($expectedResponse['statusCode'], $response['statusCode']);
    }

    public function testShowOrderDetailsApiUnavailable()
    {
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/show-order-details' => Http::response(['message' => 'Network Error'], 500),
        ]);


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

        $this->service->showOrderDetails($requestContext, $depResellerId, $orderNumbers);
    }

    // EMPTY PAYLOAD

    public function testEnrollmentDevicesEmptyPayload()
    {

        //empty payload
        $payload = [];

        $response = $this->service->enrollDevices($payload);

        $this->assertIsArray($response, 'Response should be an array');
        $this->assertArrayHasKey('errorCode', $response, 'Response should contain an errorCode key');
        $this->assertEquals('GRX-16001', $response['errorCode'], 'Error code should match');
        $this->assertArrayHasKey('errorMessage', $response, 'Response should contain an errorMessage key');
        $this->assertEquals('We are experiencing problem in processing your request. Please check back later or contact AppleCare Connect support', $response['errorMessage'], 'Error message should match');
        $this->assertArrayHasKey('transactionId', $response, 'Response should contain a transactionId key');
        $this->assertNotNull($response['transactionId'], 'Transaction ID should not be null');

    }

    public function testCheckTransactionStatusEmptyPayload()
    {

        //empty payload
        $payload = [];

        $response = $this->service->checkTransactionStatus($payload);

        $this->assertIsArray($response, 'Response should be an array');
        $this->assertArrayHasKey('errorCode', $response, 'Response should contain an errorCode key');
        $this->assertEquals('GRX-16001', $response['errorCode'], 'Error code should match');
        $this->assertArrayHasKey('errorMessage', $response, 'Response should contain an errorMessage key');
        $this->assertEquals('We are experiencing problem in processing your request. Please check back later or contact AppleCare Connect support', $response['errorMessage'], 'Error message should match');
        $this->assertArrayHasKey('transactionId', $response, 'Response should contain a transactionId key');
        $this->assertNotNull($response['transactionId'], 'Transaction ID should not be null');

    }

    public function testShowOrderDetailsEmptyPayload()
    {

        //empty payload
        $requestContext = "";
        $depResellerId = "";
        $orderNumbers = "";

        $response = $this->service->showOrderDetails($requestContext, $depResellerId, $orderNumbers);

        $this->assertIsArray($response, 'Response should be an array');
        $this->assertArrayHasKey('errorCode', $response, 'Response should contain an errorCode key');
        $this->assertEquals('GRX-16001', $response['errorCode'], 'Error code should match');
        $this->assertArrayHasKey('errorMessage', $response, 'Response should contain an errorMessage key');
        $this->assertEquals('We are experiencing problem in processing your request. Please check back later or contact AppleCare Connect support', $response['errorMessage'], 'Error message should match');
        $this->assertArrayHasKey('transactionId', $response, 'Response should contain a transactionId key');
        $this->assertNotNull($response['transactionId'], 'Transaction ID should not be null');

    }

    // INVALID INPUTS

    public function testMissingTransactionId()
    {

        $payload = [
            "requestContext" => [
                "shipTo" => "0000742682",
                "timeZone" => "420",
                "langCode" => "en"
            ],
            "transactionId" => "", //EMPTY TRANSACTION ID
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

        $this->assertArrayHasKey('enrollDeviceErrorResponse', $response);
        $this->assertEquals('Transaction ID missing. Enter a valid transaction ID and resubmit your request.', $response['enrollDeviceErrorResponse']['errorMessage']);
        $this->assertEquals('DEP-ERR-3001', $response['enrollDeviceErrorResponse']['errorCode']);
    }

    public function testEnrollHandleNetworkTimeout()
    {
        // Simulate a timeout
        Http::fake([
            'https://acc-ipt.apple.com/enroll-service/1.0/bulk-enroll-devices' => function () {
                throw new ConnectionException();
            },
        ]);

        // Set up the payload
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

        // Expect an exception
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Apple Device Enrollment API timeout during bulk enroll');

        // Call the method and catch the timeout exception
        try {
            $this->service->enrollDevices($payload);
        } catch (\Exception $e) {
            $this->assertStringContainsString('timeout during bulk enroll', $e->getMessage());
            throw $e; 
        }
    }

    // VOID ORDER
    
    public function testVoidOrderSuccessfully(){
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
                    "orderType" => "VD",
                    "customerId" => "19828",
                    "poNumber" => "PO_12346",
                ]   
            ]
        ];

        $response = $this->service->voidOrder($payload);

        // Assertions for void order
        $this->assertIsArray($response, 'Response should be an array');
        $this->assertArrayHasKey('deviceEnrollmentTransactionId', $response, 'Response does not have deviceEnrollmentTransactionId key');
        $this->assertArrayHasKey('enrollDevicesResponse', $response, 'Response does not have enrollDevicesResponse key');
        $this->assertEquals('SUCCESS', $response['enrollDevicesResponse']['statusCode'], 'Failed to void orders');
        $this->assertEquals('Transaction posted successfully in DEP', $response['enrollDevicesResponse']['statusMessage']);

    }


}
