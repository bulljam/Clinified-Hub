<?php

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('patient can successfully update their pending appointment', function () {
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    $appointment = Appointment::create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => now()->addDays(3)->format('Y-m-d'),
        'time' => '10:00:00',
        'status' => 'pending',
        'payment_status' => 'pending',
        'notes' => 'Original notes',
    ]);

    $this->actingAs($patient);

    $response = $this->patch("/appointments/{$appointment->id}/patient", [
        'date' => now()->addDays(5)->format('Y-m-d'),
        'time' => '14:00',
        'notes' => 'Updated notes',
    ]);

    $response->assertRedirect(route('appointments.index'));
    $response->assertSessionHas('success');

    $appointment->refresh();
    expect($appointment->date->format('Y-m-d'))->toBe(now()->addDays(5)->format('Y-m-d'));
    expect($appointment->time->format('H:i:s'))->toBe('14:00:00');
    expect($appointment->notes)->toBe('Updated notes');
});

test('patient cannot update confirmed appointment', function () {
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    $appointment = Appointment::create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => now()->addDays(3)->format('Y-m-d'),
        'time' => '10:00:00',
        'status' => 'confirmed',
        'payment_status' => 'pending',
    ]);

    $this->actingAs($patient);

    $response = $this->patch("/appointments/{$appointment->id}/patient", [
        'date' => now()->addDays(5)->format('Y-m-d'),
        'time' => '14:00',
        'notes' => 'Should not update',
    ]);

    $response->assertForbidden();
});

test('patient cannot schedule appointment in past', function () {
    $patient = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    $appointment = Appointment::create([
        'user_id' => $patient->id,
        'provider_id' => $provider->id,
        'date' => now()->addDays(3)->format('Y-m-d'),
        'time' => '10:00:00',
        'status' => 'pending',
        'payment_status' => 'pending',
    ]);

    $this->actingAs($patient);

    $response = $this->patch("/appointments/{$appointment->id}/patient", [
        'date' => now()->subDays(1)->format('Y-m-d'),
        'time' => '14:00',
        'notes' => 'Past appointment',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasErrors(['date']);
});
