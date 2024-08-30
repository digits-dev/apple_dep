<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],



    'apple_api' => [
        'base_url' => env('APPLE_API_BASE_URL'),
        'bulk_enroll_endpoint' => env('APPLE_API_BULK_ENROLL_ENDPOINT'),
        'show_order_details_endpoint' => env('APPLE_API_SHOW_ORDER_DETAILS_ENDPOINT'),
        'check_transaction_status_endpoint' => env('APPLE_API_CHECK_TRANSACTION_STATUS_ENDPOINT'),
        'certificate_path' => env('CLIENT_CERT_PATH', ''),
        'certificate_key_path' => env('CLIENT_KEY_PATH', ''),
        'ship_to' => env('APPLE_API_SHIP_TO','0000742682'),
        'timezone' => env('APPLE_API_TIMEZONE','420'),   
        'langCode' => env('APPLE_API_LANGCODE','en'),
        'depResellerId' => env('APPLE_API_DEP_RESELLER_ID'),
        'deviceEnrollmentTransactionId' => env('APPLE_API_DEVICE_ENROLLMENT_TRANSACTION_ID', 'e07daa6c-b3e2-4c5b-a341-4781b8e30991_1414031280097'),
        'orderNumber' => env('APPLE_API_ORDER_NUMBER', 'ORDER_900123'),
        'certificate_key_pass' => env('CLIENT_KEY_PASS')
    ],

    'item_master' => [
        'url' => env('ITEM_MASTER_URL'),
        'key' => env('ITEM_MASTER_KEY')
    ],
    
    'customers' => [
        'url' => env('CUSTOMERS_URL'),
        'key' => env('CUSTOMERS_KEY')
    ]
];