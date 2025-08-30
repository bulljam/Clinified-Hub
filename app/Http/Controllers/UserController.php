<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function providers(Request $request)
    {
        $userRole = $request->user()->role;
        
        $query = User::where('role', 'provider')
            ->select('id', 'name', 'email', 'photo', 'gender', 'city', 'specialty', 'years_of_experience', 'bio', 'phone', 'created_at')
            ->withCount(['providedAppointments as appointments_count']);
            
        // Apply search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('specialty', 'like', '%' . $search . '%')
                  ->orWhere('city', 'like', '%' . $search . '%');
            });
        }
        
        // Apply filters
        if ($request->filled('specialty')) {
            $query->where('specialty', 'like', '%' . $request->specialty . '%');
        }
        
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        
        if ($request->filled('experience')) {
            $experience = $request->experience;
            switch ($experience) {
                case '0-2':
                    $query->whereBetween('years_of_experience', [0, 2]);
                    break;
                case '3-5':
                    $query->whereBetween('years_of_experience', [3, 5]);
                    break;
                case '6-10':
                    $query->whereBetween('years_of_experience', [6, 10]);
                    break;
                case '11-15':
                    $query->whereBetween('years_of_experience', [11, 15]);
                    break;
                case '16-20':
                    $query->whereBetween('years_of_experience', [16, 20]);
                    break;
                case '20+':
                    $query->where('years_of_experience', '>=', 20);
                    break;
            }
        }
        
        $providers = $query->orderBy('name')->paginate(9);
        
        // Get unique values for filters
        $specialties = User::where('role', 'provider')
            ->whereNotNull('specialty')
            ->distinct()
            ->pluck('specialty')
            ->filter()
            ->sort()
            ->values();
            
        $cities = User::where('role', 'provider')
            ->whereNotNull('city')
            ->distinct()
            ->pluck('city')
            ->filter()
            ->sort()
            ->values();
            
        return Inertia::render('Users/Providers', [
            'providers' => $providers,
            'userRole' => $userRole,
            'specialties' => $specialties,
            'cities' => $cities,
            'filters' => $request->only(['specialty', 'city', 'gender', 'experience']),
            'search' => $request->search,
        ]);
    }

    public function patients(Request $request)
    {
        $userRole = $request->user()->role;
        $currentUserId = $request->user()->id;
        
        $query = User::where('role', 'client')
            ->select('id', 'name', 'email', 'photo', 'gender', 'city', 'date_of_birth', 'phone', 'created_at')
            ->withCount(['appointments as appointments_count']);
            
        if ($userRole === 'provider') {
            $query->whereHas('appointments', function ($q) use ($currentUserId) {
                $q->where('provider_id', $currentUserId);
            });
        }
        
        // Apply filters
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        
        if ($request->filled('min_age') || $request->filled('max_age')) {
            $minAge = $request->min_age;
            $maxAge = $request->max_age;
            
            if ($minAge) {
                $maxBirthDate = now()->subYears($minAge)->format('Y-m-d');
                $query->where('date_of_birth', '<=', $maxBirthDate);
            }
            
            if ($maxAge) {
                $minBirthDate = now()->subYears($maxAge + 1)->addDay()->format('Y-m-d');
                $query->where('date_of_birth', '>=', $minBirthDate);
            }
        }
        
        if ($request->filled('min_appointments')) {
            $query->has('appointments', '>=', $request->min_appointments);
        }
        
        $patients = $query->orderBy('name')->get();
        
        // Add age calculation to each patient
        $patients->each(function ($patient) {
            $patient->age = $patient->date_of_birth ? $patient->date_of_birth->diffInYears(now()) : null;
        });
        
        // Get unique cities for filter
        $cities = User::where('role', 'client')
            ->whereNotNull('city')
            ->distinct()
            ->pluck('city')
            ->filter()
            ->sort()
            ->values();
            
        return Inertia::render('Users/Patients', [
            'patients' => $patients,
            'userRole' => $userRole,
            'cities' => $cities,
            'filters' => $request->only(['gender', 'city', 'min_age', 'max_age', 'min_appointments']),
        ]);
    }
}
