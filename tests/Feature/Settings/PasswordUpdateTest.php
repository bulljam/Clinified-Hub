<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('password update page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('password.edit'));

    $response->assertStatus(200);
});

test('password can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('password.edit'))
        ->put(route('password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('password.edit'));

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

test('correct password must be provided to update password', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('password.edit'))
        ->put(route('password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect(route('password.edit'));
});

test('password update logs out other sessions', function () {
    $user = User::factory()->create();

    DB::table('sessions')->insert([
        'id' => 'session1',
        'user_id' => $user->id,
        'ip_address' => '127.0.0.1',
        'user_agent' => 'TestAgent',
        'payload' => 'test',
        'last_activity' => now()->timestamp,
    ]);

    DB::table('sessions')->insert([
        'id' => 'session2',
        'user_id' => $user->id,
        'ip_address' => '192.168.1.1',
        'user_agent' => 'TestAgent2',
        'payload' => 'test',
        'last_activity' => now()->timestamp,
    ]);

    $initialSessionCount = DB::table('sessions')->where('user_id', $user->id)->count();
    expect($initialSessionCount)->toBe(2);

    $response = $this
        ->actingAs($user)
        ->from(route('password.edit'))
        ->put(route('password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('password.edit'))
        ->assertSessionHas('passwordChanged', true);

    $deletedSessionIds = ['session1', 'session2'];
    foreach ($deletedSessionIds as $sessionId) {
        expect(DB::table('sessions')->where('id', $sessionId)->exists())->toBeFalse();
    }
});
