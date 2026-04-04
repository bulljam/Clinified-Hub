<?php

use App\Models\Appointment;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('prevents patient from booking multiple appointments with same provider on same date', function () {
    $appointmentDate = now()->addDays(10)->toDateString();
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => $appointmentDate,
        'time' => '09:00:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => $appointmentDate,
        'time' => '14:00',
        'notes' => 'Second appointment attempt',
    ]);

    if ($response->status() !== 302) {
        dump('Response status: '.$response->status());
        dump('Response content: '.$response->getContent());
    }

    $response->assertRedirect();

    $secondAppointmentExists = Appointment::where('user_id', $patient->id)
        ->where('provider_id', $provider->id)
        ->where('date', $appointmentDate)
        ->where('time', '14:00:00')
        ->exists();

    if ($secondAppointmentExists) {
        dump('ERROR: Second appointment was created when it should have been blocked!');
    }

    $response->assertSessionHasErrors(['provider_id']);

    $appointmentCount = Appointment::where('user_id', $patient->id)
        ->where('provider_id', $provider->id)
        ->whereDate('date', $appointmentDate)
        ->where('status', '!=', 'cancelled')
        ->count();

    expect($appointmentCount)->toBe(1);
});

it('allows patient to book with same provider on different date', function () {
    $firstDate = now()->addDays(10)->toDateString();
    $secondDate = now()->addDays(11)->toDateString();
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => $firstDate,
        'time' => '09:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => $secondDate,
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
    $appointmentDate = now()->addDays(10)->toDateString();
    $patient = User::factory()->create(['role' => 'client']);
    $provider1 = User::factory()->create(['role' => 'provider']);
    $provider2 = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider1->id,
        'date' => $appointmentDate,
        'time' => '09:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider2->id,
        'date' => $appointmentDate,
        'time' => '14:00',
        'notes' => 'Different provider appointment',
    ]);

    $response->assertRedirect('/appointments');
    $response->assertSessionHas('success');

    expect(Appointment::where('user_id', $patient->id)
        ->whereDate('date', $appointmentDate)
        ->count())->toBe(2);
});

it('allows patient to book with same provider if previous appointment is cancelled', function () {
    $appointmentDate = now()->addDays(10)->toDateString();
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => $appointmentDate,
        'time' => '09:00',
        'status' => 'cancelled',
    ]);

    $response = $this->actingAs($patient)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => $appointmentDate,
        'time' => '14:00',
        'notes' => 'New appointment after cancellation',
    ]);

    $response->assertRedirect('/appointments');
    $response->assertSessionHas('success');

    $activeAppointments = Appointment::where('user_id', $patient->id)
        ->where('provider_id', $provider->id)
        ->whereDate('date', $appointmentDate)
        ->where('status', '!=', 'cancelled')
        ->count();

    expect($activeAppointments)->toBe(1);
});

it('still prevents booking same time slot for provider', function () {
    $appointmentDate = now()->addDays(10)->toDateString();
    $patient1 = User::factory()->create(['role' => 'client']);
    $patient2 = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    Appointment::factory()->create([
        'user_id' => $patient1->id,
        'provider_id' => $provider->id,
        'date' => $appointmentDate,
        'time' => '09:00',
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($patient2)->post('/appointments', [
        'provider_id' => $provider->id,
        'date' => $appointmentDate,
        'time' => '09:00',
        'notes' => 'Conflicting time slot',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['time' => 'This time slot is already booked for the selected provider.']);
});
