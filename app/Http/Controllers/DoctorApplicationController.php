<?php

namespace App\Http\Controllers;

use App\Models\DoctorApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DoctorApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('DoctorApplication/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:doctor_applications,email',
            'phone' => 'required|string|max:20',
            'specialty' => 'required|string|max:255',
            'license_number' => 'required|string|max:50|unique:doctor_applications,license_number',
            'years_of_experience' => 'required|integer|min:0|max:50',
            'clinic_address' => 'nullable|string|max:500',
            'credentials' => 'nullable|array|max:5',
            'credentials.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $credentialsPaths = [];
        if ($request->hasFile('credentials')) {
            foreach ($request->file('credentials') as $file) {
                $credentialsPaths[] = $file->store('doctor-credentials', 'public');
            }
        }

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make('temporary-password-' . uniqid()),
            'role' => 'doctor_pending',
        ]);

        $doctorApplication = DoctorApplication::create([
            'user_id' => $user->id,
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'specialty' => $validated['specialty'],
            'license_number' => $validated['license_number'],
            'years_of_experience' => $validated['years_of_experience'],
            'clinic_address' => $validated['clinic_address'],
            'credentials' => $credentialsPaths,
        ]);

        return redirect()->back()->with('success', 'Your doctor application has been submitted successfully! We will review your application and notify you via email.');
    }

    public function index()
    {
        $applications = DoctorApplication::with(['user', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/DoctorApplications', [
            'applications' => $applications,
        ]);
    }

    public function approve(Request $request, DoctorApplication $application)
    {
        if ($application->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'This application has already been reviewed.']);
        }

        $application->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        $application->user->update([
            'role' => 'provider',
            'password' => Hash::make('temporary-password-' . uniqid()),
        ]);

        return redirect()->back()->with('success', 'Doctor application approved successfully!');
    }

    public function reject(Request $request, DoctorApplication $application)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        if ($application->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'This application has already been reviewed.']);
        }

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Doctor application rejected successfully!');
    }
}
