<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\OperationController;

use App\Http\Controllers\SuboperationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('operations')->group(function () {
    Route::get('/', [OperationController::class, 'index']);
    Route::post('/', [OperationController::class, 'store']);
    Route::get('{uuid}', [OperationController::class, 'show']);
    Route::put('{uuid}', [OperationController::class, 'update']);
    Route::delete('{uuid}', [OperationController::class, 'destroy']); // Soft delete
    Route::delete('{uuid}/force', [OperationController::class, 'forceDestroy']); // Hard delete

    Route::prefix('{operationUuid}/suboperations')->group(function () {
        Route::get('/', [SuboperationController::class, 'index']);
        Route::post('/', [SuboperationController::class, 'store']);
        Route::get('{suboperationUuid}', [SuboperationController::class, 'show']);
        Route::put('{suboperationUuid}', [SuboperationController::class, 'update']);
        Route::delete('{suboperationUuid}', [SuboperationController::class, 'destroy']); // Soft delete
        Route::delete('{suboperationUuid}/force', [SuboperationController::class, 'forceDestroy']); // Hard delete
    });
});
