<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Appointment;
use App\Models\DoctorApplication;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->seedUsers();
        $this->seedAppointments();
        $this->seedDoctorApplications();
    }

    private function seedUsers(): void
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
            'email_verified_at' => now(),
            'photo' => '/images/doctors/Cardiology.jpg',
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
            'email_verified_at' => now(),
            'photo' => '/images/doctors/Dermatology.jpg',
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
            'email_verified_at' => now(),
            'photo' => '/images/doctors/Pediatrics.jpg',
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
            'email_verified_at' => now(),
            'photo' => '/images/doctors/Orthopedics.jpg',
        ]);

        User::create([
            'name' => 'Maria Garcia',
            'email' => 'doctor5@example.com',
            'password' => Hash::make('123'),
            'role' => 'provider',
            'specialty' => 'Neurology',
            'city' => 'Phoenix',
            'gender' => 'female',
            'years_of_experience' => 10,
            'phone' => '+1 (555) 100-0005',
            'bio' => 'Neurologist specializing in epilepsy, stroke treatment, and neurodegenerative diseases.',
            'date_of_birth' => '1981-03-14',
            'email_verified_at' => now(),
            'photo' => '/images/doctors/Neurology.jpg',
        ]);

        User::create([
            'name' => 'James Wilson',
            'email' => 'doctor6@example.com',
            'password' => Hash::make('123'),
            'role' => 'provider',
            'specialty' => 'Psychiatry',
            'city' => 'Philadelphia',
            'gender' => 'male',
            'years_of_experience' => 18,
            'phone' => '+1 (555) 100-0006',
            'bio' => 'Psychiatrist with expertise in anxiety disorders, depression, and cognitive behavioral therapy.',
            'date_of_birth' => '1973-11-22',
            'email_verified_at' => now(),
            'photo' => '/images/doctors/Psychiatry.jpg',
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
            'email_verified_at' => now(),
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
            'email_verified_at' => now(),
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
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Daniel Martinez',
            'email' => 'patient4@example.com',
            'password' => Hash::make('123'),
            'role' => 'client',
            'gender' => 'male',
            'date_of_birth' => '1995-02-08',
            'city' => 'San Diego',
            'phone' => '+1 (555) 200-0004',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Emma Johnson',
            'email' => 'patient5@example.com',
            'password' => Hash::make('123'),
            'role' => 'client',
            'gender' => 'female',
            'date_of_birth' => '1993-09-15',
            'city' => 'Dallas',
            'phone' => '+1 (555) 200-0005',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Frank Anderson',
            'email' => 'patient6@example.com',
            'password' => Hash::make('123'),
            'role' => 'client',
            'gender' => 'male',
            'date_of_birth' => '1987-07-03',
            'city' => 'San Jose',
            'phone' => '+1 (555) 200-0006',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Users seeded successfully!');
    }

    private function seedAppointments(): void
    {
        $patients = User::where('role', 'client')->get();
        $providers = User::where('role', 'provider')->get();

        Appointment::create([
            'user_id' => $patients->where('email', 'patient1@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor1@example.com')->first()->id,
            'date' => now()->addDays(5)->format('Y-m-d'),
            'time' => '09:00:00',
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'notes' => 'Regular cardiac checkup appointment.',
        ]);

        Appointment::create([
            'user_id' => $patients->where('email', 'patient2@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor2@example.com')->first()->id,
            'date' => now()->addDays(3)->format('Y-m-d'),
            'time' => '14:30:00',
            'status' => 'pending',
            'payment_status' => 'pending',
            'notes' => 'Skin examination for mole check.',
        ]);

        Appointment::create([
            'user_id' => $patients->where('email', 'patient3@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor3@example.com')->first()->id,
            'date' => now()->addDays(7)->format('Y-m-d'),
            'time' => '10:15:00',
            'status' => 'confirmed',
            'payment_status' => 'pending',
            'notes' => 'Child wellness visit and vaccinations.',
        ]);

        Appointment::create([
            'user_id' => $patients->where('email', 'patient4@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor4@example.com')->first()->id,
            'date' => now()->addDays(10)->format('Y-m-d'),
            'time' => '16:00:00',
            'status' => 'pending',
            'payment_status' => 'pending',
            'notes' => 'Knee pain evaluation and treatment consultation.',
        ]);

        Appointment::create([
            'user_id' => $patients->where('email', 'patient5@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor5@example.com')->first()->id,
            'date' => now()->subDays(2)->format('Y-m-d'),
            'time' => '11:30:00',
            'status' => 'cancelled',
            'payment_status' => 'pending',
            'notes' => 'Headache evaluation - cancelled by patient.',
        ]);

        Appointment::create([
            'user_id' => $patients->where('email', 'patient6@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor6@example.com')->first()->id,
            'date' => now()->addDays(14)->format('Y-m-d'),
            'time' => '13:45:00',
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'notes' => 'Therapy session for anxiety management.',
        ]);

        Appointment::create([
            'user_id' => $patients->where('email', 'patient1@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor3@example.com')->first()->id,
            'date' => now()->subDays(5)->format('Y-m-d'),
            'time' => '15:30:00',
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'notes' => 'Family consultation completed successfully.',
        ]);

        Appointment::create([
            'user_id' => $patients->where('email', 'patient2@example.com')->first()->id,
            'provider_id' => $providers->where('email', 'doctor4@example.com')->first()->id,
            'date' => now()->addDays(21)->format('Y-m-d'),
            'time' => '08:30:00',
            'status' => 'pending',
            'payment_status' => 'pending',
            'notes' => 'Follow-up appointment for physical therapy progress.',
        ]);

        $this->command->info('Appointments seeded successfully!');
    }

    private function seedDoctorApplications(): void
    {
        $providers = User::where('role', 'provider')->get();
        $admin = User::where('role', 'super_admin')->first();

        DoctorApplication::create([
            'user_id' => $providers->where('email', 'doctor1@example.com')->first()->id,
            'full_name' => 'Sam Johnson',
            'email' => 'doctor1@example.com',
            'phone' => '+1 (555) 100-0001',
            'specialty' => 'Cardiology',
            'license_number' => 'MD-NY-12345',
            'years_of_experience' => 12,
            'office_address' => '123 Medical Center Dr, New York, NY 10001',
            'credentials' => json_encode([
                'medical_degree' => 'Harvard Medical School',
                'residency' => 'Johns Hopkins Hospital',
                'board_certification' => 'American Board of Internal Medicine',
                'fellowships' => ['Interventional Cardiology Fellowship at Mayo Clinic']
            ]),
            'photo' => 'applications/sam-johnson-photo.jpg',
            'status' => 'approved',
            'reviewed_at' => now()->subDays(30),
            'reviewed_by' => $admin->id,
        ]);

        DoctorApplication::create([
            'user_id' => $providers->where('email', 'doctor2@example.com')->first()->id,
            'full_name' => 'Michael Chen',
            'email' => 'doctor2@example.com',
            'phone' => '+1 (555) 100-0002',
            'specialty' => 'Dermatology',
            'license_number' => 'MD-CA-67890',
            'years_of_experience' => 8,
            'office_address' => '456 Skin Care Ave, Los Angeles, CA 90210',
            'credentials' => json_encode([
                'medical_degree' => 'UCLA Medical School',
                'residency' => 'Stanford University Hospital',
                'board_certification' => 'American Board of Dermatology',
                'specializations' => ['Mohs Surgery', 'Cosmetic Dermatology']
            ]),
            'photo' => 'applications/michael-chen-photo.jpg',
            'status' => 'approved',
            'reviewed_at' => now()->subDays(25),
            'reviewed_by' => $admin->id,
        ]);

        $pendingApplicant1 = User::create([
            'name' => 'Robert Smith',
            'email' => 'robert.smith@example.com',
            'password' => Hash::make('123'),
            'role' => 'doctor_pending',
            'gender' => 'male',
            'date_of_birth' => '1988-04-10',
            'city' => 'Austin',
            'phone' => '+1 (555) 300-0001',
            'email_verified_at' => now(),
        ]);

        $pendingApplicant2 = User::create([
            'name' => 'Jennifer Lee',
            'email' => 'jennifer.lee@example.com',
            'password' => Hash::make('123'),
            'role' => 'doctor_pending',
            'gender' => 'female',
            'date_of_birth' => '1985-08-22',
            'city' => 'Miami',
            'phone' => '+1 (555) 300-0002',
            'email_verified_at' => now(),
        ]);

        DoctorApplication::create([
            'user_id' => $pendingApplicant1->id,
            'full_name' => 'Robert Smith',
            'email' => 'robert.smith@example.com',
            'phone' => '+1 (555) 300-0001',
            'specialty' => 'General Surgery',
            'license_number' => 'MD-TX-11111',
            'years_of_experience' => 5,
            'office_address' => '789 Surgery Center Blvd, Austin, TX 78701',
            'credentials' => json_encode([
                'medical_degree' => 'University of Texas Medical School',
                'residency' => 'Baylor College of Medicine',
                'board_certification' => 'American Board of Surgery'
            ]),
            'photo' => 'applications/robert-smith-photo.jpg',
            'status' => 'pending',
            'reviewed_at' => null,
            'reviewed_by' => null,
        ]);

        DoctorApplication::create([
            'user_id' => $pendingApplicant2->id,
            'full_name' => 'Jennifer Lee',
            'email' => 'jennifer.lee@example.com',
            'phone' => '+1 (555) 300-0002',
            'specialty' => 'Radiology',
            'license_number' => 'MD-FL-22222',
            'years_of_experience' => 7,
            'office_address' => '321 Imaging Center St, Miami, FL 33101',
            'credentials' => json_encode([
                'medical_degree' => 'University of Miami Miller School of Medicine',
                'residency' => 'Jackson Memorial Hospital',
                'board_certification' => 'American Board of Radiology',
                'subspecialty' => 'Interventional Radiology'
            ]),
            'photo' => 'applications/jennifer-lee-photo.jpg',
            'status' => 'rejected',
            'rejection_reason' => 'Incomplete documentation provided. Missing board certification verification.',
            'reviewed_at' => now()->subDays(10),
            'reviewed_by' => $admin->id,
        ]);

        $this->command->info('Doctor applications seeded successfully!');
    }
}
