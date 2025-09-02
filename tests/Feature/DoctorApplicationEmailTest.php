<?php

use App\Mail\DoctorApplicationApproved;
use App\Mail\DoctorApplicationRejected;
use App\Models\DoctorApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->doctorUser = User::factory()->create(['role' => 'doctor_pending']);
    
    $this->application = DoctorApplication::factory()->create([
        'user_id' => $this->doctorUser->id,
        'email' => $this->doctorUser->email,
        'status' => 'pending'
    ]);
});

it('sends approval email when doctor application is approved', function () {
    Mail::fake();
    
    $this->actingAs($this->admin)
        ->post("/admin/doctor-applications/{$this->application->id}/approve");

    Mail::assertSent(DoctorApplicationApproved::class, function ($mail) {
        return $mail->hasTo($this->application->email) &&
               $mail->application->id === $this->application->id &&
               !empty($mail->temporaryPassword);
    });
});

it('sends rejection email when doctor application is rejected', function () {
    Mail::fake();
    
    $rejectionReason = 'Insufficient documentation provided.';
    
    $this->actingAs($this->admin)
        ->post("/admin/doctor-applications/{$this->application->id}/reject", [
            'rejection_reason' => $rejectionReason
        ]);

    Mail::assertSent(DoctorApplicationRejected::class, function ($mail) use ($rejectionReason) {
        return $mail->hasTo($this->application->email) &&
               $mail->application->id === $this->application->id &&
               $mail->application->rejection_reason === $rejectionReason;
    });
});

it('updates doctor user role and password when approved', function () {
    Mail::fake();
    
    $this->actingAs($this->admin)
        ->post("/admin/doctor-applications/{$this->application->id}/approve");

    $this->doctorUser->refresh();
    
    expect($this->doctorUser->role)->toBe('provider');
    expect($this->application->refresh()->status)->toBe('approved');
});

it('updates application status and rejection reason when rejected', function () {
    Mail::fake();
    
    $rejectionReason = 'Invalid license number provided.';
    
    $this->actingAs($this->admin)
        ->post("/admin/doctor-applications/{$this->application->id}/reject", [
            'rejection_reason' => $rejectionReason
        ]);

    $this->application->refresh();
    
    expect($this->application->status)->toBe('rejected');
    expect($this->application->rejection_reason)->toBe($rejectionReason);
});

it('generates a temporary password with correct format', function () {
    Mail::fake();
    
    $this->actingAs($this->admin)
        ->post("/admin/doctor-applications/{$this->application->id}/approve");

    Mail::assertSent(DoctorApplicationApproved::class, function ($mail) {
        $password = $mail->temporaryPassword;
        return str_starts_with($password, 'Clinify-') && 
               strlen($password) > 15 &&
               preg_match('/^Clinify-[A-Za-z0-9]{8}-\d{4}$/', $password);
    });
});
