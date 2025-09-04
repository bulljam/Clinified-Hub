<?php

namespace App\Http\Controllers;

use App\Mail\AdminWelcome;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __construct()
    {
        //
    }

    private function checkSuperAdminAccess(): void
    {
        if (!auth()->check()) {
            abort(401, 'Authentication required');
        }
        
        if (auth()->user()?->role !== 'super_admin') {
            abort(403, 'Super Admin access required');
        }
    }

    public function index(Request $request): Response
    {
        $this->checkSuperAdminAccess();
        $search = $request->get('search', '');
        $role = $request->get('role', '');
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $query = User::whereIn('role', ['admin', 'super_admin'])
            ->where('id', '!=', auth()->id())
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($role, function ($query, $role) {
                return $query->where('role', $role);
            });

        $admins = $query->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return Inertia::render('SuperAdmin/Admins/Index', [
            'admins' => $admins,
            'filters' => [
                'search' => $search,
                'role' => $role,
                'per_page' => $perPage,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->checkSuperAdminAccess();
        return Inertia::render('SuperAdmin/Admins/Create');
    }

    public function store(Request $request)
    {
        $this->checkSuperAdminAccess();
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in(['admin', 'super_admin'])],
        ]);

        $temporaryPassword = $this->generateTemporaryPassword();
        
        $validated['password'] = Hash::make($temporaryPassword);

        $admin = User::create($validated);

        Mail::to($admin->email)->send(
            new AdminWelcome($admin, $temporaryPassword)
        );

        return redirect()
            ->route('super-admin.admins.index')
            ->with('success', 'Admin created successfully! Welcome email sent with temporary credentials.');
    }

    public function show(User $admin): Response
    {
        $this->checkSuperAdminAccess();
        if (!in_array($admin->role, ['admin', 'super_admin'])) {
            abort(404);
        }

        return Inertia::render('SuperAdmin/Admins/Show', [
            'admin' => $admin->load(['appointments', 'providedAppointments']),
        ]);
    }

    public function edit(User $admin): Response
    {
        $this->checkSuperAdminAccess();
        if (!in_array($admin->role, ['admin', 'super_admin'])) {
            abort(404);
        }

        return Inertia::render('SuperAdmin/Admins/Edit', [
            'admin' => $admin,
        ]);
    }

    public function update(Request $request, User $admin)
    {
        $this->checkSuperAdminAccess();
        if (!in_array($admin->role, ['admin', 'super_admin'])) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($admin->id)],
            'role' => ['required', Rule::in(['admin', 'super_admin'])],
        ]);

        $admin->update($validated);

        return redirect()
            ->route('super-admin.admins.index')
            ->with('success', 'Admin updated successfully!');
    }

    public function destroy(User $admin)
    {
        $this->checkSuperAdminAccess();
        if (!in_array($admin->role, ['admin', 'super_admin'])) {
            abort(404);
        }

        // Prevent self-deletion
        if ($admin->id === auth()->id()) {
            return redirect()
                ->back()
                ->with('error', 'You cannot delete your own account.');
        }

        $admin->delete();

        return redirect()
            ->route('super-admin.admins.index')
            ->with('success', 'Admin deleted successfully!');
    }

    public function resetPassword(User $admin)
    {
        $this->checkSuperAdminAccess();
        if (!in_array($admin->role, ['admin', 'super_admin'])) {
            abort(404);
        }

        $temporaryPassword = $this->generateTemporaryPassword();
        
        $admin->update([
            'password' => Hash::make($temporaryPassword),
        ]);

        Mail::to($admin->email)->send(
            new AdminWelcome($admin, $temporaryPassword)
        );

        return response()->json([
            'message' => 'Password reset successfully! New temporary credentials sent via email.',
        ]);
    }

    private function generateTemporaryPassword(): string
    {
        return 'Clinify-' . Str::random(8) . '-' . now()->format('md');
    }
}
