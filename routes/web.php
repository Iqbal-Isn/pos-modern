<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

use App\Http\Controllers\POSController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProcurementController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\SettingsController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AnalyticsController::class, 'dashboard'])->name('dashboard');
    
    Route::get('pos', [POSController::class, 'index'])->name('pos.index');
    Route::post('pos/checkout', [POSController::class, 'checkout'])->name('pos.checkout');

    Route::get('shifts/status', [ShiftController::class, 'status'])->name('shifts.status');
    Route::post('shifts/open', [ShiftController::class, 'open'])->name('shifts.open');
    Route::post('shifts/close', [ShiftController::class, 'close'])->name('shifts.close');

    Route::post('payments/snap-token', [PaymentController::class, 'createSnapToken'])->name('payments.snap-token');

    Route::get('customers/search', [CustomerController::class, 'search'])->name('customers.search');
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');

    Route::get('procurements', [ProcurementController::class, 'index'])->name('procurements.index');
    Route::post('procurements', [ProcurementController::class, 'store'])->name('procurements.store');
    Route::post('procurements/{id}/receive', [ProcurementController::class, 'receive'])->name('procurements.receive');

    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('settings', [SettingsController::class, 'update'])->name('settings.update');
});

Route::post('payments/notification', [PaymentController::class, 'handleNotification'])->name('payments.notification');

require __DIR__.'/settings.php';
