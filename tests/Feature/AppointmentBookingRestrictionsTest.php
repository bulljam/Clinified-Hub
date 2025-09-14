<?php

use App\Models\User;
use App\Models\Appointment;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('prevents patient from booking multiple appointments with same provider on same date', function () {
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => '2025-09-01',
        'time' => '09:00:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => '2025-09-01',
        'time' => '14:00',
        'notes' => 'Second appointment attempt',
    ]);

    if ($response->status() !== 302) {
        dump('Response status: ' . $response->status());
        dump('Response content: ' . $response->getContent());
    }
    
    $response->assertRedirect();

    $secondAppointmentExists = Appointment::where('user_id', $patient->id)
        ->where('provider_id', $provider->id)
        ->where('date', '2025-09-01')
        ->where('time', '14:00:00')
        ->exists();
    
    if ($secondAppointmentExists) {
        dump('ERROR: Second appointment was created when it should have been blocked!');
    }
    
    $response->assertSessionHasErrors(['provider_id']);

    $appointmentCount = Appointment::where('user_id', $patient->id)
        ->where('provider_id', $provider->id)
        ->where('date', '2025-09-01')
        ->where('status', '!=', 'cancelled')
        ->count();
        
    expect($appointmentCount)->toBe(1);
});

it('allows patient to book with same provider on different date', function () {
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => '2025-09-01',
        'time' => '09:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => '2025-09-02',
        'time' => '14:00',
        'notes' => 'Different date appointment',
    ]);
    
    $response->assertRedirect('/appointments');
    $response->assertSessionHas('success');

    expect(Appointment::where('user_id', $patient->id)
        ->where('provider_id', $provider->id)
        ->count())->toBe(2);
});

it('allows patient to book with different provider on same date', function () {
    $patient = User::factory()->create(['role' => 'client']);
    $provider1 = User::factory()->create(['role' => 'provider']);
    $provider2 = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider1->id,
        'date' => '2025-09-01',
        'time' => '09:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider2->id,
        'date' => '2025-09-01',
        'time' => '14:00',
        'notes' => 'Different provider appointment',
    ]);
    
    $response->assertRedirect('/appointments');
    $response->assertSessionHas('success');

    expect(Appointment::where('user_id', $patient->id)
        ->where('date', '2025-09-01')
        ->count())->toBe(2);
});

it('allows patient to book with same provider if previous appointment is cancelled', function () {
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => '2025-09-01',
        'time' => '09:00',
        'status' => 'cancelled',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => '2025-09-01',
        'time' => '14:00',
        'notes' => 'New appointment after cancellation',
    ]);
    
    $response->assertRedirect('/appointments');
    $response->assertSessionHas('success');

    $activeAppointments = Appointment::where('user_id', $patient->id)
        ->where('provider_id', $provider->id)
        ->where('date', '2025-09-01')
        ->where('status', '!=', 'cancelled')
        ->count();
        
    expect($activeAppointments)->toBe(1);
});

it('still prevents booking same time slot for provider', function () {
    $patient1 = User::factory()->create(['role' => 'client']);
    $patient2 = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient1->id,
        'provider_id' => $provider->id,
        'date' => '2025-09-01',
        'time' => '09:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient2)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => '2025-09-01',
        'time' => '09:00',
        'notes' => 'Conflicting time slot',
    ]);
    
    $response->assertRedirect();
    $response->assertSessionHasErrors(['time' => 'This time slot is already booked for the selected provider.']);
});
