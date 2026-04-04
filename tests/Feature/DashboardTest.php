<?php

use App\Models\Appointment;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->withoutVite();
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('dashboard'));
});

test('upcoming appointments on the dashboard are paginated', function () {
    $this->withoutVite();
    $client = User::factory()->create(['role' => 'client']);
    $provider = User::factory()->create(['role' => 'provider']);

    foreach (range(1, 6) as $dayOffset) {
        Appointment::factory()->create([
            'user_id' => $client->id,
            'provider_id' => $provider->id,
            'date' => now()->addDays($dayOffset)->toDateString(),
            'time' => sprintf('%02d:00:00', 8 + $dayOffset),
            'status' => $dayOffset % 2 === 0 ? 'confirmed' : 'pending',
            'payment_status' => 'paid',
        ]);
    }

    Appointment::factory()->create([
        'user_id' => $client->id,
        'provider_id' => $provider->id,
        'date' => now()->addDays(10)->toDateString(),
        'time' => '09:00:00',
        'status' => 'cancelled',
        'payment_status' => 'pending',
    ]);

    $this->actingAs($client)
        ->get(route('dashboard', ['upcoming_page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('userRole', 'client')
            ->where('upcomingAppointments.current_page', 2)
            ->where('upcomingAppointments.last_page', 2)
            ->where('upcomingAppointments.per_page', 4)
            ->where('upcomingAppointments.total', 6)
            ->where('upcomingAppointments.from', 5)
            ->where('upcomingAppointments.to', 6)
            ->has('upcomingAppointments.data', 2)
            ->where('stats.0.value', '6')
            ->where('stats.0.description', '3 pending, 3 confirmed'));
});
