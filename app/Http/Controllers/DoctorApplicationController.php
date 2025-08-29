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
            'office_address' => 'required|string|max:500',
            'credentials' => 'required|array|min:1|max:5',
            'credentials.*' => 'file|mimes:pdf,jpg,jpeg,png|max:2048',
            'photo' => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        $credentialsPaths = [];
        if ($request->hasFile('credentials')) {
            foreach ($request->file('credentials') as $file) {
                $credentialsPaths[] = $file->store('doctor-credentials', 'public');
            }
        }

        // Handle photo upload
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('doctor-photos', 'public');
        }

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make('temporary-password-' . uniqid()),
            'role' => 'doctor_pending',
        ]);

        DoctorApplication::create([
            'user_id' => $user->id,
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'specialty' => $validated['specialty'],
            'license_number' => $validated['license_number'],
            'years_of_experience' => $validated['years_of_experience'],
            'office_address' => $validated['office_address'],
            'credentials' => $credentialsPaths,
            'photo' => $photoPath,
        ]);

        return redirect('/')->with('success', 'Your doctor application has been submitted successfully! We will review your application and notify you via email.');
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

    public function approve(DoctorApplication $application)
    {
        if ($application->status !== 'pending') {
            return redirect()->back()->withErrors(['error' => 'This application has already been reviewed.']);
        }

        $application->update([
            'status' => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        // Update user role and copy photo to profile
        $updateData = [
            'role' => 'provider',
            'password' => Hash::make('temporary-password-' . uniqid()),
        ];

        if ($application->photo) {
            $updateData['photo'] = $application->photo;
        }

        $application->user->update($updateData);

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

    public function viewCredential(DoctorApplication $application, $filename)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $credentials = $application->credentials ?? [];
        $filePath = null;

        foreach ($credentials as $credential) {
            if (basename($credential) === $filename) {
                $filePath = $credential;
                break;
            }
        }

        if (!$filePath || !file_exists(storage_path('app/public/' . $filePath))) {
            abort(404, 'File not found');
        }

        $fullPath = storage_path('app/public/' . $filePath);
        $mimeType = mime_content_type($fullPath);

        return response()->file($fullPath, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
        ]);
    }
}
