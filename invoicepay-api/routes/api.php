<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ClientController;
use App\Http\Controllers\api\DashboardController;
use App\Http\Controllers\api\InvoiceController;
use App\Http\Controllers\api\InvoiceItemController;
use App\Http\Controllers\api\PaymentController;
use App\Http\Controllers\api\ReminderController;
use Illuminate\Support\Facades\Route;

//--- Public Routes -----
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// payment routes
Route::get('/pay/{token}',                    [PaymentController::class, 'show']);
Route::post('/pay/{token}/initiate',          [PaymentController::class, 'initiate']);
Route::get('/pay/{token}/verify/{reference}', [PaymentController::class, 'verify']);

Route::middleware("auth:sanctum")->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/profile/logo', [AuthController::class, 'upLoadLogo']);

    // Client
    Route::apiResource('clients', ClientController::class);

    // Invoice
    Route::apiResource('invoices', InvoiceController::class);
    Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send']);
    Route::post('/invoices/{invoice}/mark-paid', [InvoiceController::class, 'markPaid']);

    // Invoice Items
    Route::apiResource('invoices.items', InvoiceItemController::class);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Reminders
    Route::post('/invoices/{invoice}/reminders', [ReminderController::class, 'store']);
    Route::get('/invoices/{invoice}/reminders', [ReminderController::class, 'index']);
    Route::delete('/reminders/{reminder}', [ReminderController::class, 'destroy']);

    // Paystack webhook
    Route::post('/paystack/webhook', [PaymentController::class, 'webhook']);
});
