<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = match ($user->role) {
            'admin' => Appointment::with(['user', 'provider']),
            'provider' => Appointment::with(['user', 'provider'])
                ->where('provider_id', $user->id),
            'client' => Appointment::with(['user', 'provider'])
                ->where('user_id', $user->id),
            default => Appointment::query()->whereNull('id')
        };

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('provider_id')) {
            $query->where('provider_id', $request->provider_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        $appointments = $query->latest()->paginate(15);

        return Inertia::render('appointments/Index', [
            'appointments' => $appointments,
            'filters' => [
                'status' => $request->status,
                'payment_status' => $request->payment_status,
                'provider_id' => $request->provider_id,
                'date' => $request->date,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $providers = User::where('role', 'provider')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('appointments/Create', [
            'providers' => $providers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Appointment::class);

        $validated = $request->validate([
            'provider_id' => 'required|exists:users,id',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i',
        ]);

        $validated['user_id'] = $request->user()->id;

        Appointment::create($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Appointment $appointment): Response
    {
        $this->authorize('view', $appointment);

        $appointment->load(['user', 'provider']);

        return Inertia::render('appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Appointment $appointment): Response
    {
        $this->authorize('update', $appointment);

        $appointment->load(['user', 'provider']);

        $providers = User::where('role', 'provider')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('appointments/Edit', [
            'appointment' => $appointment,
            'providers' => $providers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment): RedirectResponse
    {
        $this->authorize('update', $appointment);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
            'payment_status' => 'sometimes|in:pending,paid',
        ]);

        $appointment->update($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment updated successfully.');
    }

    /**
     * Update appointment fields that patients are allowed to modify.
     */
    public function updatePatient(Request $request, Appointment $appointment): RedirectResponse
    {
        $this->authorize('update', $appointment);

        if ($appointment->status !== 'pending') {
            return redirect()->back()
                ->withErrors(['appointment' => 'Only pending appointments can be modified.']);
        }

        $validated = $request->validate([
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i',
            'notes' => 'nullable|string|max:1000',
        ]);

        $query = Appointment::where('provider_id', $appointment->provider_id)
            ->where('date', '=', $validated['date'])
            ->where('time', $validated['time'].':00')
            ->where('id', '!=', $appointment->id)
            ->where('status', '!=', 'cancelled');

        $existingAppointment = $query->exists();

        if ($existingAppointment) {
            return redirect()->back()
                ->withErrors(['time' => 'This time slot is already booked with the selected provider.']);
        }

        $appointment->update($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Appointment $appointment): RedirectResponse
    {
        $this->authorize('delete', $appointment);

        $appointment->delete();

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment cancelled successfully.');
    }
}
