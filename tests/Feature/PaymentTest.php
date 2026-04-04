<?php

use App\Models\Transaction;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('admin payments table paginates filtered results', function () {
    $this->withoutVite();

    $admin = User::factory()->create(['role' => 'admin']);
    $patientA = User::factory()->create(['role' => 'client', 'name' => 'Patient A']);
    $patientB = User::factory()->create(['role' => 'client', 'name' => 'Patient B']);
    $providerA = User::factory()->create(['role' => 'provider', 'name' => 'Provider A']);
    $providerB = User::factory()->create(['role' => 'provider', 'name' => 'Provider B']);

    foreach (range(1, 12) as $index) {
        Transaction::create([
            'user_id' => $index <= 11 ? $patientA->id : $patientB->id,
            'doctor_id' => $index <= 11 ? $providerA->id : $providerB->id,
            'amount' => 100 + $index,
            'card_last4' => '4242',
            'status' => $index <= 7 ? 'paid' : 'on_hold',
            'created_at' => now()->subDays(20 - $index),
            'updated_at' => now()->subDays(20 - $index),
        ]);
    }

    $this->actingAs($admin)
        ->get(route('payments.index', ['patient' => $patientA->id, 'page' => 3]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Payments')
            ->where('filters.patient', (string) $patientA->id)
            ->where('transactions.current_page', 3)
            ->where('transactions.last_page', 3)
            ->where('transactions.per_page', 4)
            ->where('transactions.total', 11)
            ->where('transactions.from', 9)
            ->where('transactions.to', 11)
            ->has('transactions.data', 3)
            ->where('summary.totalTransactions', 11)
            ->where('summary.paidAmount', 728)
            ->where('summary.totalAmount', 1166));
});
