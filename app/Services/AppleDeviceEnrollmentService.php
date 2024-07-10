<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AppleDeviceEnrollmentService
{
    protected $baseUrl;
    protected $bulkEnrollEndpoint;
    protected $showOrderDetailsEndpoint;
    protected $checkTransactionStatusEndpoint;

    public function __construct()
    {
        $this->baseUrl = config('services.apple_api.base_url');
        $this->bulkEnrollEndpoint = config('services.apple_api.bulk_enroll_endpoint');
        $this->checkTransactionStatusEndpoint = config('services.apple_api.check_transaction_status_endpoint');
        $this->showOrderDetailsEndpoint = config('services.apple_api.show_order_details_endpoint');
    }

    public function enrollDevice(array $payload)
    {
        $url = $this->baseUrl . $this->bulkEnrollEndpoint;
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($url, $payload);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Apple Device Enrollment API request failed', [
            'message' => $response->body()
        ]);

        throw new \Exception('Failed to enroll devices');
    }

    public function checkTransactionStatus(array $requestData)
    {
        $url = $this->baseUrl . $this->checkTransactionStatusEndpoint;

        try {
            $response = Http::post($url, $requestData);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Apple Device Enrollment API check transaction status request failed', [
                'message' => $response->body()
            ]);

            throw new \Exception('Failed to check transaction status');
        } catch (\Exception $e) {
            Log::error('Apple Device Enrollment API exception', ['exception' => $e->getMessage()]);
            throw $e;
        }
    }


    public function showOrderDetails($requestContext, $depResellerId, $orderNumbers)
    {
        $url = $this->baseUrl . $this->showOrderDetailsEndpoint;
        $payload = [
            'requestContext' => $requestContext,
            'depResellerId' => $depResellerId,
            'orderNumbers' => $orderNumbers,
        ];

        $response = Http::post($url, $payload);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Apple Device Enrollment API show order details request failed', [
            'message' => $response->body()
        ]);

        throw new \Exception('Failed to show order details');
    }

    public function enrollDevices(array $payload){
        $url = $this->baseUrl . $this->bulkEnrollEndpoint;
        try {
            $response = Http::post($url, $payload);
    
            if ($response->successful()) {
                return $response->json();
            }
    
            Log::error('Apple Device Enrollment API bulk enroll request failed', [
                'message' => $response->body()
            ]);
    
            throw new \Exception('Failed to enroll devices');
        } catch (\Exception $e) {
            Log::error('Apple Device Enrollment API exception', ['exception' => $e->getMessage()]);
            throw $e;
        }
    }


    public function generateSampleBulkEnrollPayload()
    {
        return [
            'requestContext' => [
                'shipTo' => '0000742682',
                'timeZone' => '420',
                'langCode' => 'en',
            ],
            'transactionId' => 'TXN_001132',
            'depResellerId' => '0000742682',
            'orders' => [
                [
                    'orderNumber' => 'ORDER_900123',
                    'orderDate' => '2014-08-28T10:10:10Z',
                    'orderType' => 'OR',
                    'customerId' => '19827',
                    'poNumber' => 'PO_12345',
                    'deliveries' => [
                        [
                            'deliveryNumber' => 'D1.2',
                            'shipDate' => '2014-10-10T05:10:00Z',
                            'devices' => [
                                [
                                    'deviceId' => '33645013YAM',
                                    'assetTag' => 'A123456',
                                ],
                                [
                                    'deviceId' => '33645005YAM',
                                    'assetTag' => 'A123456',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }
}
