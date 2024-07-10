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

    public function enrollDevices(array $payload)
    {
        return $this->sendRequest($payload, 'bulk enroll');
    }

    public function unEnrollDevices(array $payload)
    {
        return $this->sendRequest($payload, 'bulk un-enroll');
    }

    public function checkTransactionStatus(array $requestData)
    {
        $url = $this->baseUrl . $this->checkTransactionStatusEndpoint;

        try {
            $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept-Encoding' => '',
                ])
                ->post($url, $requestData);

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

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept-Encoding' => '',
        ])
        ->post($url, $payload);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Apple Device Enrollment API show order details request failed', [
            'message' => $response->body()
        ]);

        throw new \Exception('Failed to show order details');
    }

    private function sendRequest(array $payload, string $action)
    {
        $url = $this->baseUrl . $this->bulkEnrollEndpoint;
        try {

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept-Encoding' => '',
            ])
            ->post($url, $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error("Apple Device Enrollment API $action request failed", [
                'message' => $response->body()
            ]);

            throw new \Exception("Failed to $action devices");
        } catch (\Exception $e) {
            Log::error("Apple Device Enrollment API exception during $action", ['exception' => $e->getMessage()]);
            throw $e;
        }
    }



}
