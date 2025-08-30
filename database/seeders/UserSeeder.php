<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('123'),
            'role' => 'super_admin',
            'gender' => 'male',
            'date_of_birth' => '1980-01-15',
            'city' => 'New York',
            'phone' => '+1 (555) 000-0001',
        ]);

        User::create([
            'name' => 'Admin One',
            'email' => 'admin1@example.com',
            'password' => Hash::make('123'),
            'role' => 'admin',
            'gender' => 'female',
            'date_of_birth' => '1985-03-20',
            'city' => 'Los Angeles',
            'phone' => '+1 (555) 000-0002',
        ]);

        User::create([
            'name' => 'Admin Two',
            'email' => 'admin2@example.com',
            'password' => Hash::make('123'),
            'role' => 'admin',
            'gender' => 'male',
            'date_of_birth' => '1982-07-10',
            'city' => 'Chicago',
            'phone' => '+1 (555) 000-0003',
        ]);

        User::create([
            'name' => 'Admin Three',
            'email' => 'admin3@example.com',
            'password' => Hash::make('123'),
            'role' => 'admin',
            'gender' => 'female',
            'date_of_birth' => '1987-11-05',
            'city' => 'Houston',
            'phone' => '+1 (555) 000-0004',
        ]);

        User::create([
            'name' => 'Sarah Johnson',
            'email' => 'doctor1@example.com',
            'password' => Hash::make('123'),
            'role' => 'provider',
            'specialty' => 'Cardiology',
            'city' => 'New York',
            'gender' => 'female',
            'years_of_experience' => 12,
            'phone' => '+1 (555) 100-0001',
            'bio' => 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention.',
            'date_of_birth' => '1979-04-15',
        ]);

        User::create([
            'name' => 'Michael Chen',
            'email' => 'doctor2@example.com',
            'password' => Hash::make('123'),
            'role' => 'provider',
            'specialty' => 'Dermatology',
            'city' => 'Los Angeles',
            'gender' => 'male',
            'years_of_experience' => 8,
            'phone' => '+1 (555) 100-0002',
            'bio' => 'Board-certified dermatologist with expertise in skin cancer treatment and cosmetic procedures.',
            'date_of_birth' => '1983-09-22',
        ]);

        User::create([
            'name' => 'Emily Rodriguez',
            'email' => 'doctor3@example.com',
            'password' => Hash::make('123'),
            'role' => 'provider',
            'specialty' => 'Pediatrics',
            'city' => 'Chicago',
            'gender' => 'female',
            'years_of_experience' => 15,
            'phone' => '+1 (555) 100-0003',
            'bio' => 'Pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.',
            'date_of_birth' => '1976-12-08',
        ]);

        User::create([
            'name' => 'David Thompson',
            'email' => 'doctor4@example.com',
            'password' => Hash::make('123'),
            'role' => 'provider',
            'specialty' => 'Orthopedics',
            'city' => 'Houston',
            'gender' => 'male',
            'years_of_experience' => 20,
            'phone' => '+1 (555) 100-0004',
            'bio' => 'Orthopedic surgeon specializing in sports medicine and joint replacement procedures.',
            'date_of_birth' => '1971-06-30',
        ]);

        User::create([
            'name' => 'Alice Brown',
            'email' => 'patient1@example.com',
            'password' => Hash::make('123'),
            'role' => 'client',
            'gender' => 'female',
            'date_of_birth' => '1990-05-12',
            'city' => 'Phoenix',
            'phone' => '+1 (555) 200-0001',
        ]);

        User::create([
            'name' => 'Bob Wilson',
            'email' => 'patient2@example.com',
            'password' => Hash::make('123'),
            'role' => 'client',
            'gender' => 'male',
            'date_of_birth' => '1988-08-25',
            'city' => 'Philadelphia',
            'phone' => '+1 (555) 200-0002',
        ]);

        User::create([
            'name' => 'Carol Davis',
            'email' => 'patient3@example.com',
            'password' => Hash::make('123'),
            'role' => 'client',
            'gender' => 'female',
            'date_of_birth' => '1992-11-18',
            'city' => 'San Antonio',
            'phone' => '+1 (555) 200-0003',
        ]);

        $this->command->info('User data seeded successfully!');
    }
}
