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
            'super_admin', 'admin' => Appointment::with(['user', 'provider']),
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

        // For client users, also provide all appointments for availability checking and providers list
        $allAppointments = [];
        $providers = [];
        if ($user->role === 'client') {
            $allAppointments = Appointment::select('id', 'user_id', 'provider_id', 'date', 'time', 'status', 'payment_status')
                ->where('status', '!=', 'cancelled')
                ->get();
            $providers = User::where('role', 'provider')
                ->select('id', 'name', 'email')
                ->get();
        } elseif (in_array($user->role, ['admin', 'super_admin'])) {
            // For admin users, provide providers list for filtering
            $providers = User::where('role', 'provider')
                ->select('id', 'name', 'email')
                ->get();
        }

        return Inertia::render('appointments/Index', [
            'appointments' => $appointments,
            'allAppointments' => $allAppointments,
            'providers' => $providers,
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
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if the time slot is already booked for this provider on this date
        $existingAppointment = Appointment::where('provider_id', $validated['provider_id'])
            ->where('date', $validated['date'])
            ->where('time', $validated['time'])
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($existingAppointment) {
            return redirect()->back()
                ->withErrors(['time' => 'This time slot is already booked for the selected provider.'])
                ->withInput();
        }

        // Check if the patient already has an appointment with this provider on this date
        $patientExistingAppointment = Appointment::where('user_id', $request->user()->id)
            ->where('provider_id', $validated['provider_id'])
            ->where('date', $validated['date'])
            ->where('status', '!=', 'cancelled')
            ->first();

        if ($patientExistingAppointment) {
            return redirect()->back()
                ->withErrors(['provider_id' => 'You already have an appointment with this provider on this date.'])
                ->withInput();
        }

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
            'payment_status' => 'sometimes|in:pending,on_hold,paid,cancelled',
        ]);

        // Handle combined appointment and payment status logic
        if (isset($validated['status'])) {
            switch ($validated['status']) {
                case 'confirmed':
                    // When confirming appointment, also approve any on_hold payments
                    if ($appointment->payment_status === 'on_hold') {
                        // Find and approve the on_hold transaction
                        $transaction = \App\Models\Transaction::where('user_id', $appointment->user_id)
                            ->where('doctor_id', $appointment->provider_id)
                            ->where('status', 'on_hold')
                            ->latest()
                            ->first();
                        
                        if ($transaction) {
                            $transaction->update(['status' => 'paid']);
                        }
                        
                        $validated['payment_status'] = 'paid';
                    }
                    break;
                    
                case 'cancelled':
                    // When cancelling appointment, handle payments based on current status
                    if ($appointment->payment_status === 'on_hold') {
                        // Find and reject the on_hold transaction
                        $transaction = \App\Models\Transaction::where('user_id', $appointment->user_id)
                            ->where('doctor_id', $appointment->provider_id)
                            ->where('status', 'on_hold')
                            ->latest()
                            ->first();
                        
                        if ($transaction) {
                            $transaction->update(['status' => 'cancelled']);
                        }
                        
                        $validated['payment_status'] = 'cancelled';
                    } elseif ($appointment->payment_status === 'paid') {
                        // Find and refund the paid transaction
                        $transaction = \App\Models\Transaction::where('user_id', $appointment->user_id)
                            ->where('doctor_id', $appointment->provider_id)
                            ->where('status', 'paid')
                            ->latest()
                            ->first();
                        
                        if ($transaction) {
                            $transaction->update(['status' => 'cancelled']);
                        }
                        
                        $validated['payment_status'] = 'cancelled';
                    } else {
                        // For pending payments, just cancel the payment status
                        $validated['payment_status'] = 'cancelled';
                    }
                    break;
            }
        }

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

        // Check if the time slot is already booked for this provider on this date (excluding current appointment)
        $existingAppointment = Appointment::where('provider_id', $appointment->provider_id)
            ->where('date', $validated['date'])
            ->where('time', $validated['time'])
            ->where('status', '!=', 'cancelled')
            ->where('id', '!=', $appointment->id)
            ->first();

        if ($existingAppointment) {
            return redirect()->back()
                ->withErrors(['time' => 'This time slot is already booked for the selected provider.'])
                ->withInput();
        }

        // Check if the patient already has another appointment with this provider on this date
        if ($appointment->provider_id === $appointment->provider_id && $appointment->date !== $validated['date']) {
            $patientExistingAppointment = Appointment::where('user_id', $appointment->user_id)
                ->where('provider_id', $appointment->provider_id)
                ->where('date', $validated['date'])
                ->where('status', '!=', 'cancelled')
                ->where('id', '!=', $appointment->id)
                ->first();

            if ($patientExistingAppointment) {
                return redirect()->back()
                    ->withErrors(['date' => 'You already have an appointment with this provider on this date.']);
            }
        }

        $appointment->update($validated);

        return redirect()->route('appointments.index')
            ->with('success', 'Appointment updated successfully.');
    }

    /**
     * Get available time slots for a provider on a specific date.
     */
    public function availability(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|exists:users,id',
            'date' => 'required|date',
        ]);

        $appointments = Appointment::where('provider_id', $request->provider_id)
            ->where('date', $request->date)
            ->where('status', '!=', 'cancelled')
            ->select('id', 'provider_id', 'date', 'time', 'status', 'payment_status')
            ->get();

        return response()->json($appointments);
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

    /**
     * Approve payment for an appointment and automatically confirm the appointment.
     */
    public function approvePayment(Request $request, Appointment $appointment)
    {
        $this->authorize('update', $appointment);

        // Find the transaction for this appointment
        $transaction = \App\Models\Transaction::where('user_id', $appointment->user_id)
            ->where('doctor_id', $appointment->provider_id)
            ->where('status', 'on_hold')
            ->latest()
            ->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'No pending payment found for this appointment.',
            ], 404);
        }

        // Approve the payment
        $transaction->update(['status' => 'paid']);

        // Automatically confirm the appointment
        $appointment->update([
            'payment_status' => 'paid',
            'status' => 'confirmed'
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Payment approved and appointment confirmed successfully!',
                'appointment' => $appointment->fresh(),
                'transaction' => $transaction->fresh(),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Payment approved and appointment confirmed successfully!');
    }

    /**
     * Reject payment for an appointment.
     */
    public function rejectPayment(Request $request, Appointment $appointment)
    {
        $this->authorize('update', $appointment);

        // Find the transaction for this appointment
        $transaction = \App\Models\Transaction::where('user_id', $appointment->user_id)
            ->where('doctor_id', $appointment->provider_id)
            ->where('status', 'on_hold')
            ->latest()
            ->first();

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'No pending payment found for this appointment.',
            ], 404);
        }

        // Reject the payment
        $transaction->update(['status' => 'cancelled']);

        // Reset appointment payment status
        $appointment->update(['payment_status' => 'pending']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Payment rejected successfully.',
                'appointment' => $appointment->fresh(),
                'transaction' => $transaction->fresh(),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Payment rejected successfully.');
    }
}
