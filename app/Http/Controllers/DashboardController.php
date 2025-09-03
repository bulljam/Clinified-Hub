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
            'super_admin' => $this->getSuperAdminDashboardData(),
            'admin' => $this->getAdminDashboardData(),
            'provider' => $this->getProviderDashboardData($user),
            default => $this->getClientDashboardData($user),
        };
        
        return Inertia::render('dashboard', $dashboardData);
    }
    
    private function getAdminDashboardData(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        
        $todayAppointments = Appointment::whereDate('date', $today)->get();
        $totalPatients = User::where('role', 'client')->count();
        $totalProviders = User::where('role', 'provider')->count();
        $newPatientsThisMonth = User::where('role', 'client')
            ->where('created_at', '>=', $thisMonth)
            ->count();
        $newPatientsLastMonth = User::where('role', 'client')
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
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
        
        $totalRevenue = Appointment::where('payment_status', 'paid')
            ->where('status', 'confirmed')
            ->count() * 100;
        
        $patientsGrowth = $newPatientsLastMonth > 0 
            ? round((($newPatientsThisMonth - $newPatientsLastMonth) / $newPatientsLastMonth) * 100, 1)
            : ($newPatientsThisMonth > 0 ? 100 : 0);
        
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
                    'title' => 'Total Patients',
                    'value' => (string) $totalPatients,
                    'description' => $newPatientsThisMonth . ' new this month',
                    'trend' => $patientsGrowth != 0 ? ($patientsGrowth > 0 ? '+' : '') . $patientsGrowth . '% from last month' : null,
                ],
                [
                    'title' => 'Active Providers',
                    'value' => (string) $totalProviders,
                    'description' => 'Healthcare providers in system',
                    'trend' => null,
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
    
    private function getSuperAdminDashboardData(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        
        $todayAppointments = Appointment::whereDate('date', $today)->get();
        $totalUsers = User::count();
        $totalPatients = User::where('role', 'client')->count();
        $totalProviders = User::where('role', 'provider')->count();
        $totalAdmins = User::whereIn('role', ['admin', 'super_admin'])->count();
        $newUsersThisMonth = User::where('created_at', '>=', $thisMonth)->count();
        $newUsersLastMonth = User::whereBetween('created_at', [$lastMonth, $thisMonth])->count();
        
        $upcomingAppointments = Appointment::with(['client', 'provider'])
            ->where('date', '>=', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('date')
            ->orderBy('time')
            ->limit(10)
            ->get();
        
        $systemHealth = [
            'total_appointments' => Appointment::count(),
            'active_users' => User::where('updated_at', '>=', Carbon::now()->subDays(30))->count(),
            'system_uptime' => '99.9%'
        ];
        
        $totalRevenue = Appointment::where('payment_status', 'paid')
            ->where('status', 'confirmed')
            ->count() * 100;
        
        $usersGrowth = $newUsersLastMonth > 0 
            ? round((($newUsersThisMonth - $newUsersLastMonth) / $newUsersLastMonth) * 100, 1)
            : ($newUsersThisMonth > 0 ? 100 : 0);
        
        return [
            'stats' => [
                [
                    'title' => 'System Users',
                    'value' => (string) $totalUsers,
                    'description' => $totalPatients . ' patients, ' . $totalProviders . ' providers, ' . $totalAdmins . ' admins',
                    'trend' => $usersGrowth != 0 ? ($usersGrowth > 0 ? '+' : '') . $usersGrowth . '% growth this month' : null,
                ],
                [
                    'title' => 'Platform Activity',
                    'value' => (string) $systemHealth['active_users'],
                    'description' => 'Active users in last 30 days',
                    'trend' => 'System Health: ' . $systemHealth['system_uptime'],
                ],
                [
                    'title' => 'Total Revenue',
                    'value' => '$' . number_format($totalRevenue),
                    'description' => 'From ' . Appointment::where('payment_status', 'paid')->count() . ' paid appointments',
                    'trend' => 'Platform-wide earnings',
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
            'userRole' => 'super_admin'
        ];
    }
    
    private function getProviderDashboardData(User $provider): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        
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
        
        $thisMonthAppointments = $provider->providedAppointments()
            ->where('created_at', '>=', $thisMonth)
            ->count();
        
        $lastMonthAppointments = $provider->providedAppointments()
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->count();
        
        $upcomingAppointments = $provider->providedAppointments()
            ->with('client')
            ->where('date', '>=', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('date')
            ->orderBy('time')
            ->limit(10)
            ->get();
        
        $completedAppointments = $provider->providedAppointments()
            ->where('status', 'confirmed')
            ->where('date', '<', $today)
            ->count();
        
        $appointmentsGrowth = $lastMonthAppointments > 0 
            ? round((($thisMonthAppointments - $lastMonthAppointments) / $lastMonthAppointments) * 100, 1)
            : ($thisMonthAppointments > 0 ? 100 : 0);
        
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
                    'title' => 'My Patients',
                    'value' => (string) $totalPatients,
                    'description' => $newPatientsThisMonth . ' new this month',
                    'trend' => $newPatientsThisMonth > 0 ? '+' . $newPatientsThisMonth . ' this month' : null,
                ],
                [
                    'title' => 'Appointments This Month',
                    'value' => (string) $thisMonthAppointments,
                    'description' => $completedAppointments . ' completed overall',
                    'trend' => $appointmentsGrowth != 0 ? ($appointmentsGrowth > 0 ? '+' : '') . $appointmentsGrowth . '% from last month' : null,
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
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        
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
        
        $lastMonthAppointments = $client->appointments()
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->count();
        
        $completedAppointments = $client->appointments()
            ->where('status', 'confirmed')
            ->where('date', '<', $today)
            ->count();
        
        $pendingPayments = $client->appointments()
            ->where('payment_status', 'pending')
            ->where('status', 'confirmed')
            ->count();
        
        $appointmentsGrowth = $lastMonthAppointments > 0 
            ? round((($thisMonthAppointments - $lastMonthAppointments) / $lastMonthAppointments) * 100, 1)
            : ($thisMonthAppointments > 0 ? 100 : 0);
        
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
                    'title' => 'Total Appointments',
                    'value' => (string) $totalAppointments,
                    'description' => $completedAppointments . ' completed',
                    'trend' => $thisMonthAppointments > 0 ? '+' . $thisMonthAppointments . ' this month' : null,
                ],
                [
                    'title' => 'Pending Payments',
                    'value' => (string) $pendingPayments,
                    'description' => $pendingPayments . ' outstanding payments',
                    'trend' => null,
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
