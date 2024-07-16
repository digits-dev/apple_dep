<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;

class AppleDeviceEnrollmentService
{
    protected $baseUrl;
    protected $bulkEnrollEndpoint;
    protected $showOrderDetailsEndpoint;
    protected $checkTransactionStatusEndpoint;
    protected $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.apple_api.base_url');
        $this->bulkEnrollEndpoint = config('services.apple_api.bulk_enroll_endpoint');
        $this->checkTransactionStatusEndpoint = config('services.apple_api.check_transaction_status_endpoint');
        $this->showOrderDetailsEndpoint = config('services.apple_api.show_order_details_endpoint');
        $this->timeout = 15;
    }

    public function enrollDevices(array $payload)
    {
        return $this->sendRequest($payload, 'bulk enroll');
    }

    public function unEnrollDevices(array $payload)
    {
        return $this->sendRequest($payload, 'bulk un-enroll');
    }

    public function overrideOrder(array $payload)
    {
        return $this->sendRequest($payload, 'override order');
    }

    public function voidOrder(array $payload){
        return $this->sendRequest($payload, 'void order');
    }

    public function checkTransactionStatus(array $requestData)
    {
        $url = $this->baseUrl . $this->checkTransactionStatusEndpoint;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept-Encoding' => '',
            ])
                ->timeout($this->timeout)
                ->post($url, $requestData);

            if ($response->successful()) {
                return $response->json();
            }


            $this->handleErrorResponse('check transaction status', $response);
        } catch(ConnectionException $e){
            $this->handleTimeoutException('check transaction status', $e);
        } catch (RequestException $e) {
            $this->handleRequestException('check transaction status', $e);
        } catch (\Exception $e) {
            $this->handleGeneralException('check transaction status', $e);
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

        try{
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept-Encoding' => '',
            ])
                ->timeout($this->timeout)
                ->post($url, $payload);
    
            if ($response->successful()) {
                return $response->json();
            }
            $this->handleErrorResponse('show order details', $response);
        } catch(ConnectionException $e){
            $this->handleTimeoutException('show order details', $e);
        } catch (RequestException $e) {
            $this->handleRequestException('show order details', $e);
        } catch (\Exception $e) {
            $this->handleGeneralException('show order details', $e);
        }
    }

    private function sendRequest(array $payload, string $action)
    {
        return $this->sendPostRequest($this->bulkEnrollEndpoint, $payload, $action);
    }

    private function sendPostRequest(string $endpoint, array $payload, string $action)
    {
        $url = $this->baseUrl . $endpoint;

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept-Encoding' => '',
            ])
            ->timeout($this->timeout)
            ->post($url, $payload);

            if ($response->successful()) {
                return $response->json();
            }

            $this->handleErrorResponse($action, $response);
        } catch (ConnectionException $e) {
            $this->handleTimeoutException($action, $e);
        } catch (RequestException $e) {
            $this->handleRequestException($action, $e);
        } catch (\Exception $e) {
            $this->handleGeneralException($action, $e);
        }
    }

    private function handleErrorResponse(string $action, $response)
    {
        $errorMessage = "Failed to $action devices";
        Log::error("Apple Device Enrollment API $action request failed", [
            'message' => $response->body()
        ]);
        throw new \Exception($errorMessage);
    }

    private function handleTimeoutException(string $action, ConnectionException $e)
    {
        $errorMessage = "Apple Device Enrollment API timeout during $action: " . $e->getMessage();
        Log::error($errorMessage);
        throw new \Exception($errorMessage);
    }

    private function handleRequestException(string $action, RequestException $e)
    {
        $errorMessage = "Apple Device Enrollment API exception during $action: " . $e->getMessage();
        Log::error($errorMessage);
        throw new \Exception($errorMessage);
    }

    private function handleGeneralException(string $action, \Exception $e)
    {
        $errorMessage = "General exception during $action: " . $e->getMessage();
        Log::error($errorMessage);
        throw new \Exception($errorMessage);
    }

    

}
