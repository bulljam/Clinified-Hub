<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorApplicationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('doctor-application', [DoctorApplicationController::class, 'create'])->name('doctor-application.create');
Route::post('doctor-application', [DoctorApplicationController::class, 'store'])->name('doctor-application.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('appointments', AppointmentController::class);
    Route::patch('appointments/{appointment}/patient', [AppointmentController::class, 'updatePatient'])->name('appointments.update-patient');
    Route::get('api/appointments/availability', [AppointmentController::class, 'availability'])->name('appointments.availability');

    Route::middleware(['can:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('doctor-applications', [DoctorApplicationController::class, 'index'])->name('doctor-applications.index');
        Route::post('doctor-applications/{application}/approve', [DoctorApplicationController::class, 'approve'])->name('doctor-applications.approve');
        Route::post('doctor-applications/{application}/reject', [DoctorApplicationController::class, 'reject'])->name('doctor-applications.reject');
        Route::get('doctor-applications/{application}/credential/{filename}', [DoctorApplicationController::class, 'viewCredential'])->name('doctor-applications.view-credential');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
