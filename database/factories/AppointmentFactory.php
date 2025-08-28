<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
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
            'provider_id' => \App\Models\User::factory(),
            'date' => fake()->dateTimeBetween('+1 day', '+30 days')->format('Y-m-d'),
            'time' => fake()->randomElement([
                '08:00:00', '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00',
                '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00',
                '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00',
            ]),
            'status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
            'payment_status' => fake()->randomElement(['pending', 'paid']),
            'notes' => fake()->optional()->sentences(2, true),
        ];
    }
}
