<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $dashboardData = match ($user->role) {
            'super_admin', 'admin' => $this->getAdminDashboardData(),
            'provider' => $this->getProviderDashboardData($user),
            default => $this->getClientDashboardData($user),
        };
        
        return Inertia::render('dashboard', $dashboardData);
    }
    
    private function getAdminDashboardData(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        
        $todayAppointments = Appointment::whereDate('date', $today)->get();
        $totalPatients = User::where('role', 'client')->count();
        $newPatientsThisMonth = User::where('role', 'client')
            ->where('created_at', '>=', $thisMonth)
            ->count();
        
        $upcomingAppointments = Appointment::with(['client', 'provider'])
            ->where('date', '>=', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('date')
            ->orderBy('time')
            ->limit(10)
            ->get();
        
        $pendingPayments = Appointment::where('payment_status', 'pending')
            ->where('status', 'confirmed')
            ->count();
        
        return [
            'stats' => [
                [
                    'title' => 'Appointments Today',
                    'value' => (string) $todayAppointments->count(),
                    'description' => $todayAppointments->where('status', 'pending')->count() . ' pending, ' . 
                                   $todayAppointments->where('status', 'confirmed')->count() . ' confirmed',
                    'trend' => null,
                ],
                [
                    'title' => 'Pending Payments',
                    'value' => (string) $pendingPayments,
                    'description' => $pendingPayments . ' outstanding appointments',
                    'trend' => null,
                ],
                [
                    'title' => 'Total Patients',
                    'value' => (string) $totalPatients,
                    'description' => $newPatientsThisMonth . ' new this month',
                    'trend' => $newPatientsThisMonth > 0 ? '+' . $newPatientsThisMonth . ' this month' : null,
                ],
            ],
            'upcomingAppointments' => $upcomingAppointments->map(function ($appointment) {
                return [
                    'time' => $appointment->time->format('g:i A'),
                    'date' => $appointment->date->format('M j'),
                    'patient' => $appointment->client->name,
                    'provider' => $appointment->provider->name,
                    'status' => $appointment->status,
                ];
            }),
            'userRole' => 'admin'
        ];
    }
    
    private function getProviderDashboardData(User $provider): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        
        $todayAppointments = $provider->providedAppointments()
            ->whereDate('date', $today)
            ->get();
        
        $totalPatients = $provider->providedAppointments()
            ->distinct('user_id')
            ->count('user_id');
        
        $newPatientsThisMonth = $provider->providedAppointments()
            ->where('created_at', '>=', $thisMonth)
            ->distinct('user_id')
            ->count('user_id');
        
        $upcomingAppointments = $provider->providedAppointments()
            ->with('client')
            ->where('date', '>=', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('date')
            ->orderBy('time')
            ->limit(10)
            ->get();
        
        $pendingPayments = $provider->providedAppointments()
            ->where('payment_status', 'pending')
            ->where('status', 'confirmed')
            ->count();
        
        return [
            'stats' => [
                [
                    'title' => 'Appointments Today',
                    'value' => (string) $todayAppointments->count(),
                    'description' => $todayAppointments->where('status', 'pending')->count() . ' pending, ' . 
                                   $todayAppointments->where('status', 'confirmed')->count() . ' confirmed',
                    'trend' => null,
                ],
                [
                    'title' => 'Pending Payments',
                    'value' => (string) $pendingPayments,
                    'description' => $pendingPayments . ' outstanding appointments',
                    'trend' => null,
                ],
                [
                    'title' => 'My Patients',
                    'value' => (string) $totalPatients,
                    'description' => $newPatientsThisMonth . ' new this month',
                    'trend' => $newPatientsThisMonth > 0 ? '+' . $newPatientsThisMonth . ' this month' : null,
                ],
            ],
            'upcomingAppointments' => $upcomingAppointments->map(function ($appointment) {
                return [
                    'time' => $appointment->time->format('g:i A'),
                    'date' => $appointment->date->format('M j'),
                    'patient' => $appointment->client->name,
                    'status' => $appointment->status,
                ];
            }),
            'userRole' => 'provider'
        ];
    }
    
    private function getClientDashboardData(User $client): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        
        $upcomingAppointments = $client->appointments()
            ->with('provider')
            ->where('date', '>=', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('date')
            ->orderBy('time')
            ->limit(10)
            ->get();
        
        $totalAppointments = $client->appointments()->count();
        $thisMonthAppointments = $client->appointments()
            ->where('created_at', '>=', $thisMonth)
            ->count();
        
        $pendingPayments = $client->appointments()
            ->where('payment_status', 'pending')
            ->where('status', 'confirmed')
            ->count();
        
        return [
            'stats' => [
                [
                    'title' => 'Upcoming Appointments',
                    'value' => (string) $upcomingAppointments->count(),
                    'description' => $upcomingAppointments->where('status', 'pending')->count() . ' pending, ' . 
                                   $upcomingAppointments->where('status', 'confirmed')->count() . ' confirmed',
                    'trend' => null,
                ],
                [
                    'title' => 'Pending Payments',
                    'value' => (string) $pendingPayments,
                    'description' => $pendingPayments . ' outstanding payments',
                    'trend' => null,
                ],
                [
                    'title' => 'Total Appointments',
                    'value' => (string) $totalAppointments,
                    'description' => $thisMonthAppointments . ' this month',
                    'trend' => $thisMonthAppointments > 0 ? '+' . $thisMonthAppointments . ' this month' : null,
                ],
            ],
            'upcomingAppointments' => $upcomingAppointments->map(function ($appointment) {
                return [
                    'time' => $appointment->time->format('g:i A'),
                    'date' => $appointment->date->format('M j'),
                    'provider' => $appointment->provider->name,
                    'status' => $appointment->status,
                ];
            }),
            'userRole' => 'client'
        ];
    }
}
