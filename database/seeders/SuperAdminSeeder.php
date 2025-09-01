<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'super@example.com'],
            [
                'name' => 'Super Administrator',
                'email' => 'super@example.com',
                'password' => Hash::make('123'),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Super admin created successfully!');
    }
}
