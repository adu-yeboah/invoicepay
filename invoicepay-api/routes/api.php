<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\ClientController;
use Illuminate\Support\Facades\Route;

//--- Public Routes -----
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware("auth:sanctum")->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'logout']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/profile/logo', [AuthController::class, 'upLoadLogo']);

    //Client
    Route::apiResource('clients', ClientController::class);
});
