<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('inspire')->hourly();
        $schedule->call('\App\Http\Controllers\PullErpController@getListOfOrdersFromErpv1')->dailyAt('04:00');
        $schedule->call('\App\Http\Controllers\ItemMaster\ItemMasterController@getItemMasterDataApi')->hourly()->between('9:00', '23:00');
        $schedule->call('\App\Http\Controllers\Customer\CustomerController@getCustomers')->hourly()->between('9:00', '23:00');
        
        $schedule->command('mysql:backup')->daily()->at('06:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
