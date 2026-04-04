<?php

use App\Models\DoctorApplication;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('admin can view doctor application credential files', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $applicant = User::factory()->create(['role' => 'doctor_pending']);

    $credentialPath = 'doctor-credentials/test-credential.png';
    Storage::disk('local')->put(
        $credentialPath,
        base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9pGNsq0AAAAASUVORK5CYII=')
    );

    $application = DoctorApplication::create([
        'user_id' => $applicant->id,
        'full_name' => 'Dr. Pending',
        'email' => 'pending@example.com',
        'phone' => '1234567890',
        'specialty' => 'Cardiology',
        'license_number' => 'LIC-12345',
        'years_of_experience' => 5,
        'office_address' => 'Clinic Street',
        'credentials' => [$credentialPath],
        'photo' => null,
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.doctor-applications.view-credential', [
            'application' => $application->id,
            'filename' => basename($credentialPath),
        ]))
        ->assertOk()
        ->assertHeader('content-disposition', 'inline; filename="'.basename($credentialPath).'"');
});
