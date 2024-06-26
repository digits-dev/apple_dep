<?php
use App\Http\Controllers\Test\TestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia; // We are going to use this class to render React components
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Admin\MenusController;
use App\Helpers\CommonHelpers;
use Illuminate\Support\Facades\DB;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [LoginController::class, 'index']);
Route::get('login', [LoginController::class, 'index'])->name('login');
Route::post('login-save', [LoginController::class, 'authenticate'])->name('login-save');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/sidebar', [MenusController::class, 'sidebarMenu'])->name('sidebar');
    Route::get('/table', [TestController::class, 'getTable']);
});

Route::group([
    'middleware' => ['auth'],
    'prefix' => config('adm_url.ADMIN_PATH'),
    'namespace' => 'App\Http\Controllers',
], function () {
   
    // Todo: change table
    $modules = [];
    try {
        $modules = DB::table('adm_modules')->whereIn('controller', CommonHelpers::getOthersControllerFiles())->get();
    } catch (\Exception $e) {
        Log::error("Load adm moduls is failed. Caused = " . $e->getMessage());
    }

    foreach ($modules as $v) {
        if (@$v->path && @$v->controller) {
            try {
                CommonHelpers::routeOtherController($v->path, $v->controller, 'app\Http\Controllers');
            } catch (\Exception $e) {
                Log::error("Path = ".$v->path."\nController = ".$v->controller."\nError = ".$e->getMessage());
            }
        }
    }
})->middleware('auth');