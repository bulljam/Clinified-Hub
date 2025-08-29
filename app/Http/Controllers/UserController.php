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
        
        $providers = User::where('role', 'provider')
            ->select('id', 'name', 'email', 'photo', 'created_at')
            ->orderBy('name')
            ->get();
            
        return Inertia::render('Users/Providers', [
            'providers' => $providers,
            'userRole' => $userRole,
        ]);
    }

    public function patients(Request $request)
    {
        $userRole = $request->user()->role;
        $currentUserId = $request->user()->id;
        
        $patientsQuery = User::where('role', 'client')
            ->select('id', 'name', 'email', 'photo', 'created_at');
            
        if ($userRole === 'provider') {
            $patientsQuery->whereHas('appointments', function ($query) use ($currentUserId) {
                $query->where('provider_id', $currentUserId);
            });
        }
            
        $patients = $patientsQuery->orderBy('name')->get();
            
        return Inertia::render('Users/Patients', [
            'patients' => $patients,
            'userRole' => $userRole,
        ]);
    }
}
