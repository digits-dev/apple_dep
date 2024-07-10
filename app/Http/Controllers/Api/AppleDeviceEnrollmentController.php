<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\AppleDeviceEnrollmentService;

class AppleDeviceEnrollmentController extends Controller
{
    protected $appleService;

    public function __construct(AppleDeviceEnrollmentService $appleService)
    {
        $this->appleService = $appleService;
    }

    public function showOrderDetails(Request $request)
    {
        //$requestData = $request->all();

        $requestContext = [
            'shipTo' => '0000742682', //replace
            'timeZone' => '420',
            'langCode' => 'en'
        ];
        $depResellerId = '0000742682'; //replace
        $orderNumbers = ['ORDER_900123']; //replace

        try {
            $response = $this->appleService->showOrderDetails($requestContext, $depResellerId, $orderNumbers);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkTransactionStatus(Request $request)
    {

        //$requestData = $request->all();

        $requestData = [
            'requestContext' => [
                'shipTo' => '0000742682', //replace
                'timeZone' => '420',
                'langCode' => 'en',
            ],
            'depResellerId' => '0000742682', //replace
            'deviceEnrollmentTransactionId' => '80a3209c-6d61-480d-a240-10dc30bd8127_1720585230422', //replace
        ];

        try {
            $response = $this->appleService->checkTransactionStatus($requestData);

            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    public function testEnrollDevice()
    {
        try {
            $payload = $this->appleService->generateSampleBulkEnrollPayload();
            $response = $this->appleService->enrollDevices($payload);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function enrollDevice(Request $request)
    {
        try {
            $requestData = $request->all(); 

            $payload = [
                'requestContext' => [
                    'shipTo' => $requestData['shipTo'],
                    'timeZone' => '420',
                    'langCode' => 'en',
                ],
                'transactionId' => 'TXN_' . uniqid(),  
                'depResellerId' => $requestData['depResellerId'],
                'orders' => [],  
            ];

            // Check if multiple orders are provided
            if (isset($requestData['orders']) && is_array($requestData['orders'])) {
                foreach ($requestData['orders'] as $orderData) {
                    
                    $orderPayload = [
                        'orderNumber' => $orderData['orderNumber'],
                        'orderDate' => $orderData['orderDate'],
                        'orderType' => 'OR',
                        'customerId' => $orderData['customerId'],
                        'poNumber' => $orderData['poNumber'],
                        'deliveries' => [],
                    ];

                    // Check if deliveries are provided
                    if (isset($orderData['deliveries']) && is_array($orderData['deliveries'])) {
                        foreach ($orderData['deliveries'] as $deliveryData) {
                            
                            $deliveryPayload = [
                                'deliveryNumber' => $deliveryData['deliveryNumber'],
                                'shipDate' => $deliveryData['shipDate'],
                                'devices' => [],
                            ];

                            // Check if devices are provided
                            if (isset($deliveryData['devices']) && is_array($deliveryData['devices'])) {
                                foreach ($deliveryData['devices'] as $deviceData) {
                                    
                                    $devicePayload = [
                                        'deviceId' => $deviceData['deviceId'],
                                        'assetTag' => $deviceData['assetTag'],
                                    ];

                                    // Add device to delivery payload
                                    $deliveryPayload['devices'][] = $devicePayload;
                                }
                            }

                            // Add delivery to order payload
                            $orderPayload['deliveries'][] = $deliveryPayload;
                        }
                    }

                    // Add order to payload
                    $payload['orders'][] = $orderPayload;
                }
            }

            // Call the service method to enroll devices
            $response = $this->appleService->enrollDevices($payload);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


}
