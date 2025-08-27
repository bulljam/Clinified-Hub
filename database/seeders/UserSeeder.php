<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@clinify.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Dr. John Smith',
            'email' => 'john.smith@clinify.com',
            'role' => 'provider',
        ]);

        User::factory()->create([
            'name' => 'Dr. Sarah Johnson',
            'email' => 'sarah.johnson@clinify.com',
            'role' => 'provider',
        ]);

        User::factory()->create([
            'name' => 'Alice Brown',
            'email' => 'alice.brown@example.com',
            'role' => 'client',
        ]);

        User::factory()->create([
            'name' => 'Bob Wilson',
            'email' => 'bob.wilson@example.com',
            'role' => 'client',
        ]);

        User::factory()->create([
            'name' => 'Carol Davis',
            'email' => 'carol.davis@example.com',
            'role' => 'client',
        ]);
    }
}
