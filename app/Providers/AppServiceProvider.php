<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Http::macro('withClientCertificate', function () {
            return Http::withOptions([
                'cert' => config('services.apple_api.certificate_path'),
                'ssl_key' => [config('services.apple_api.certificate_key_path'), config('services.apple_api.certificate_key_pass')],
            ]);
        });

    }
}
