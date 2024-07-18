<?php
use App\Helpers\CommonHelpers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Test\TestController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\MenusController;
use App\Http\Controllers\Admin\ModulsController;
use App\Http\Controllers\Action\ActionController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\Admin\PrivilegesController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\DepStatus\DepStatusController;
use App\Http\Controllers\Users\ChangePasswordController;
use App\Http\Controllers\DepDevices\DepDevicesController;
use App\Http\Controllers\Api\AppleDeviceEnrollmentController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\ListOfOrders\ListOfOrdersController;
use App\Http\Controllers\EnrollmentList\EnrollmentListController;
use App\Http\Controllers\EnrollmentStatus\EnrollmentStatusController;
use App\Http\Controllers\ItemMaster\ItemMasterController;
use Inertia\Inertia; // We are going to use this class to render React components
use App\Http\Controllers\PullErpController;
use App\Http\Controllers\Users\ProfilePageController;

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

//query from beach
Route::get('/query', [PullErpController::class, 'getListOfOrdersFromErpv2']);
Route::get('/enroll', [ListOfOrdersController::class, 'enrollDevices']);

Route::get('/', [LoginController::class, 'index']);
Route::get('login', [LoginController::class, 'index'])->name('login');

// reset password
Route::get('/reset_password', [ResetPasswordController::class, 'getIndex'])->name('reset_password');
Route::post('/send_resetpass_email',[ResetPasswordController::class, 'sendResetPasswordInstructions']);
Route::get('/reset_password_email/{email}', [ResetPasswordController::class, 'getResetIndex'])->name('reset_password_email');
Route::post('/send_resetpass_email/reset',[ResetPasswordController::class, 'resetPassword']);

Route::post('login-save', [LoginController::class, 'authenticate'])->name('login-save');

Route::group(['prefix' => 'api'], function () {
    
    // Route for testing showOrderDetails
    Route::get('/test-show-order-details', [AppleDeviceEnrollmentController::class, 'showOrderDetails'])
        ->name('test.showOrderDetails');

    // Route for testing testEnrollDevice
    Route::get('/test-enroll-device', [AppleDeviceEnrollmentController::class, 'testEnrollDevice'])
        ->name('test.enrollDevice');

    // Route for testing checkTransactionStatus
    Route::get('/test-check-transaction-status', [AppleDeviceEnrollmentController::class, 'checkTransactionStatus'])
        ->name('test.checkTransactionStatus');
    
});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/sidebar', [MenusController::class, 'sidebarMenu'])->name('sidebar');

    //USERS
    Route::post('create-user', [AdminUsersController::class, 'postAddSave'])->name('create-user');
    Route::post('/postAddSave', [AdminUsersController::class, 'postAddSave'])->name('postAddSave');
    Route::post('/postEditSave', [AdminUsersController::class, 'postEditSave'])->name('postEditSave');
    Route::post('/deactivate-users', [AdminUsersController::class, 'setStatus'])->name('postDeactivateUsers');

    //PROFILE PAGE
    Route::get('/profile', [ProfilePageController::class, 'getIndex'])->name('profile_page');

    //CHANGE PASSWORD
    Route::get('/change_password', [ChangePasswordController::class, 'getIndex'])->name('change_password');
    Route::post('/postChangePassword', [AdminUsersController::class, 'postUpdatePassword'])-> name('postChangePassword');
    
    //PRIVILEGES
    Route::get('create-privileges', [PrivilegesController::class, 'createPrivilegesView'])->name('create-privileges');
    Route::get('edit-privileges/{id}', [PrivilegesController::class, 'getEdit'])->name('edit-privileges');
    Route::post('/privilege/postAddSave', [PrivilegesController::class, 'postAddSave'])->name('postAddSave');
    Route::post('/privilege/postEditSave', [PrivilegesController::class, 'postEditSave'])->name('postEditSave');

    //MODULES
    Route::get('create-modules', [ModulsController::class, 'getAddModuls'])->name('create-modules');
    Route::post('/module_generator/postAddSave', [ModulsController::class, 'postAddSave'])->name('postAddSave');

    //MENUS
    Route::post('/menu_management/add', [MenusController::class, 'postAddSave'])->name('MenusControllerPostSaveMenu');
    Route::get('/menu_management/edit/{id}', [MenusController::class, 'getEdit'])->name('MenusControllerGetEdit');
    Route::post('/menu_management/edit-menu-save/{id}', [MenusController::class, 'postEditSave'])->name('edit-menus-save');
    Route::post('/set-status-menus', [MenusController::class, 'postStatusSave'])->name('delete-menus-save');

    //EXPORTS
    Route::get('/list-of-orders-export', [ListOfOrdersController::class, 'export']);
    Route::get('/dep-devices-export', [DepDevicesController::class, 'export']);
    Route::get('/enrollment-list-export', [EnrollmentListController::class, 'export']);
    Route::get('/customers-export', [CustomerController::class, 'export']);
    Route::get('/actions-export', [ActionController::class, 'export']);
    Route::get('/dep-status-export', [DepStatusController::class, 'export']);
    Route::get('/enrollment-status-export', [EnrollmentStatusController::class, 'export']);
    Route::get('/item-master-export', [ItemMasterController::class, 'export']);
    Route::get('/export-json/{log_type}/{order_id}', [ListOfOrdersController::class, 'exportText'])->name('export-json');
    Route::get('/export-transaction/{order_id}', [ListOfOrdersController::class, 'exportTransaction'])->name('export-transaction');

    //List of Orders
    Route::get('/list_of_orders/{order}', [ListOfOrdersController::class, 'show']);
    Route::get('/list_of_orders/{order}/edit', [ListOfOrdersController::class, 'edit']);
    Route::post('/list_of_orders/enroll', [ListOfOrdersController::class, 'enrollDevices']);
    Route::post('/list_of_orders/return', [ListOfOrdersController::class, 'unEnrollDevices']);
    Route::post('/list_of_orders/bulk-enroll', [ListOfOrdersController::class, 'bulkEnrollDevices']);
    Route::post('/list_of_orders/bulk-return', [ListOfOrdersController::class, 'bulkReturnDevices']);

    //EnrollmentList
    Route::get('/enrollment_list/{enrollmentList}', [EnrollmentListController::class, 'EnrollmentListDetails']);
    Route::get('/enrollment_list/{transactionId}/check_status', [EnrollmentListController::class, 'checkTransactionStatus']);

    //IMPORTS
    Route::post('/customers-import', [CustomerController::class, 'import']);
    Route::post('/actions-import', [ActionController::class, 'import']);
    Route::post('/dep-status-import', [DepStatusController::class, 'import']);
    Route::post('/enrollment-status-import', [EnrollmentStatusController::class, 'import']);

    //IMPORTS TEMPLATE
    Route::get('/customers-import-template', [CustomerController::class, 'downloadTemplate']);
    Route::get('/actions-import-template', [ActionController::class, 'downloadTemplate']);
    Route::get('/dep-status-import-template', [DepStatusController::class, 'downloadTemplate']);
    Route::get('/enrollment-status-import-template', [EnrollmentStatusController::class, 'downloadTemplate']);

    //SUBMASTERS

    Route::post('/item_master_create', [ItemMasterController::class, 'addItemMaster']);
    Route::put('/item_master_update/{itemMaster}', [ItemMasterController::class, 'updateItemMaster']);

    Route::post('/customers', [CustomerController::class, 'store']);
    Route::put('/customers/bulkupdate', [CustomerController::class, 'bulkUpdate']);
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);

    Route::post('/actions', [ActionController::class, 'store']);
    Route::put('/actions/bulkupdate', [ActionController::class, 'bulkUpdate']);
    Route::put('/actions/{action}', [ActionController::class, 'update']);


    Route::post('/dep_statuses', [DepStatusController::class, 'store']);
    Route::put('/dep_statuses/bulkupdate', [DepStatusController::class, 'bulkUpdate']);
    Route::put('/dep_statuses/{dep_status}', [DepStatusController::class, 'update']);

    Route::post('/enrollment_statuses', [EnrollmentStatusController::class, 'store']);
    Route::put('/enrollment_statuses/bulkupdate', [EnrollmentStatusController::class, 'bulkUpdate']);
    Route::put('/enrollment_statuses/{enrollment_status}', [EnrollmentStatusController::class, 'update']);

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