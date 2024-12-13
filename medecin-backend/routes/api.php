<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\SalleDAttenteController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\BilanController;
use App\Http\Controllers\Api\OrdonanceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\RadioController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', function (Request $request) {
      $user = $request->user();
      return $user;
    });

    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
    Route::get('consultations/{id}/payments', [PaymentController::class, 'paymentsForConsultation']);

    Route::delete('/ordonancess/{id}', [SalleDAttenteController::class, 'destroy']);
    Route::put('/ordonancess/{id}', [SalleDAttenteController::class, 'destroy']);

    Route::apiResource('Ordonances', OrdonanceController::class);
    Route::apiResource('patients', PatientController::class);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('consultations', ConsultationController::class); // Add route for ConsultationController
    Route::apiResource('payments', PaymentController::class);
    Route::post('/image', [PatientController::class, 'Image']);
    Route::post('/assign_patient_to_salle/{patientId}', [SalleDAttenteController::class, 'addPatient']);
    Route::delete('/salles/{salleId}/remove-patient/{patientId}', [SalleDAttenteController::class, 'removePatient']);
    Route::get('/salles/patients', [SalleDAttenteController::class, 'getAllPatientsInSalles']);

    Route::delete('/patients/{patient}/bilans/{bilan}', [BilanController::class, 'unlinkBilan']);
    Route::delete('/patients/{patient}/radios/{radio}', [RadioController::class, 'unlinkRadio']);
    Route::post('/link-bilan-to-patient', [BilanController::class, 'linkToPatient']);
    Route::post('/link-radio-to-patient', [RadioController::class, 'linkToPatient']);
    Route::get('/bilans', [BilanController::class, 'index']);
    Route::get('/radios', [RadioController::class, 'index']);
    Route::post('/bilans', [BilanController::class, 'store']);
    Route::post('/radios', [RadioController::class, 'store']);
    Route::get('/patients/{patientId}/bilans/date/{date}', [BilanController::class, 'getBilanByPatientAndDate']);
    Route::get('/patients/{patientId}/radios/date/{date}', [RadioController::class, 'getRadioByPatientAndDate']);
    Route::delete('/patients/{patientId}/folders/{folderId}', [PatientController::class, 'deleteFolder']);
    Route::get('/patients/{patient}/folders', [PatientController::class, 'getFolders']);
    Route::post('/patients/{patient}/folders', [PatientController::class, 'storeFolder']);
    Route::get('/patients/{patient}/folders/{folder}', [PatientController::class, 'downloadFile']);
    Route::post('/patients/{patientId}/files', [PatientController::class, 'files']);
});

    Route::get('/storage/{path}', function ($path) {
      return response()->file(storage_path('app/public/' . $path));
    })->where('path', '.*');

