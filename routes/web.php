<?php
use App\Http\Controllers\Action\ActionController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\DepDevices\DepDevicesController;
use App\Http\Controllers\DepStatus\DepStatusController;
use App\Http\Controllers\EnrollmentList\EnrollmentListController;
use App\Http\Controllers\ListOfOrders\ListOfOrdersController;
use App\Http\Controllers\Test\TestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia; // We are going to use this class to render React components
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Admin\MenusController;
use App\Http\Controllers\Admin\AdminUsersController;
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

    //USERS
    Route::post('create-user', [AdminUsersController::class, 'postAddSave'])->name('create-user');
    Route::post('/postAddSave', [AdminUsersController::class, 'postAddSave'])->name('postAddSave');
    Route::post('/postEditSave', [AdminUsersController::class, 'postEditSave'])->name('postEditSave');
    Route::post('/deactivate-users', [AdminUsersController::class, 'setStatus'])->name('postDeactivateUsers');

    //EXPORTS
    Route::get('/test-export', [TestController::class, 'export']);
    Route::get('/list-of-orders-export', [ListOfOrdersController::class, 'export']);
    Route::get('/dep-devices-export', [DepDevicesController::class, 'export']);
    Route::get('/enrollment-list-export', [EnrollmentListController::class, 'export']);
    Route::get('/customers-export', [CustomerController::class, 'export']);
    Route::get('/actions-export', [ActionController::class, 'export']);
    Route::get('/dep-status-export', [DepStatusController::class, 'export']);

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

//ADMIN ROUTE
Route::group([
    'middleware' => ['auth'],
    'prefix' => config('ad_url.ADMIN_PATH'),
    'namespace' => 'App\Http\Controllers\Admin',
], function () {
   
    // Todo: change table
    if (request()->is(config('ad_url.ADMIN_PATH'))) {
        $menus = DB::table('adm_menuses')->where('is_dashboard', 1)->first();
        if ($menus) {
            Route::get('/', 'Dashboard\DashboardContentGetIndex');
        } else {
            CommonHelpers::routeController('/', 'AdminController', 'App\Http\Controllers\Admin');
        }
    }

    // Todo: change table
    $modules = [];
    try {
        $modules = DB::table('adm_modules')->whereIn('controller', CommonHelpers::getMainControllerFiles())->get();
    } catch (\Exception $e) {
        Log::error("Load ad moduls is failed. Caused = " . $e->getMessage());
    }

    foreach ($modules as $v) {
        if (@$v->path && @$v->controller) {
            try {
                CommonHelpers::routeController($v->path, $v->controller, 'app\Http\Controllers\Admin');
            } catch (\Exception $e) {
                Log::error("Path = ".$v->path."\nController = ".$v->controller."\nError = ".$e->getMessage());
            }
        }
    }
})->middleware('auth');

