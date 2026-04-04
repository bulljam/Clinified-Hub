<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DoctorApplication>
 */
class DoctorApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'specialty' => fake()->randomElement([
                'Cardiology', 'Neurology', 'Oncology', 'Pediatrics',
                'Orthopedics', 'Dermatology', 'Psychiatry', 'Internal Medicine',
            ]),
            'license_number' => 'MD-'.fake()->unique()->numerify('######'),
            'years_of_experience' => fake()->numberBetween(1, 30),
            'office_address' => fake()->address(),
            'credentials' => [
                'doctor-credentials/'.fake()->uuid().'.pdf',
                'doctor-credentials/'.fake()->uuid().'.pdf',
            ],
            'photo' => 'doctor-photos/'.fake()->uuid().'.jpg',
            'status' => 'pending',
        ];
    }
}
