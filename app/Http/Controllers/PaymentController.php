<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        
        $transactionsQuery = Transaction::with(['user', 'doctor']);

        if ($user->role === 'provider') {
            $transactionsQuery->where('doctor_id', $user->id);
        } elseif ($user->role === 'client') {
            $transactionsQuery->where('user_id', $user->id);
        }

        if (in_array($user->role, ['admin', 'super_admin'])) {
            if ($request->filled('patient')) {
                $transactionsQuery->where('user_id', $request->integer('patient'));
            }

            if ($request->filled('provider')) {
                $transactionsQuery->where('doctor_id', $request->integer('provider'));
            }

            if ($request->filled('status')) {
                $transactionsQuery->where('status', $request->string('status'));
            }

            if ($request->filled('date_from')) {
                $transactionsQuery->whereDate('created_at', '>=', $request->date('date_from'));
            }

            if ($request->filled('date_to')) {
                $transactionsQuery->whereDate('created_at', '<=', $request->date('date_to'));
            }
        }
        
        $summaryQuery = clone $transactionsQuery;

        $transactions = $transactionsQuery
            ->latest()
            ->paginate(4)
            ->withQueryString();

        $summary = [
            'totalAmount' => (float) (clone $summaryQuery)->sum('amount'),
            'paidAmount' => (float) (clone $summaryQuery)->where('status', 'paid')->sum('amount'),
            'totalTransactions' => (clone $summaryQuery)->count(),
        ];

        $users = [];
        $providers = [];
        
        if (in_array($user->role, ['admin', 'super_admin'])) {
            $users = \App\Models\User::select('id', 'name', 'email', 'role')
                ->where('role', 'client')
                ->get();
                
            $providers = \App\Models\User::select('id', 'name', 'email', 'specialty')
                ->where('role', 'provider')
                ->get();
        }

        return Inertia::render('Payments', [
            'transactions' => $transactions,
            'summary' => $summary,
            'users' => $users,
            'providers' => $providers,
            'filters' => $request->only(['patient', 'provider', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'card_number' => 'required|string|size:16',
            'expiration' => 'required|string',
            'cvv' => 'required|string|size:3',
            'amount' => 'required|numeric|min:0.01',
            'doctor_id' => 'required|exists:users,id',
            'user_id' => 'required|exists:users,id',
            'appointment_id' => 'sometimes|exists:appointments,id',
        ]);

        $cardLast4 = substr($request->card_number, -4);
        
        $status = match ($request->card_number) {
            '4242424242424242' => 'on_hold',
            '4000000000000002' => 'failed',
            default => 'on_hold'
        };

        $transaction = Transaction::create([
            'user_id' => $request->user_id,
            'doctor_id' => $request->doctor_id,
            'amount' => $request->amount,
            'card_last4' => $cardLast4,
            'status' => $status,
        ]);

        if ($request->appointment_id && $status === 'on_hold') {
            $appointment = Appointment::find($request->appointment_id);
            if ($appointment) {
                $appointment->update(['payment_status' => 'on_hold']);
            }
        }

        $message = match ($status) {
            'on_hold' => 'Payment submitted successfully! Awaiting doctor approval.',
            'failed' => 'Payment failed. Please try a different card.',
            default => 'Payment is being processed.'
        };

        session()->flash('message', $message);
        session()->flash('success', $status !== 'failed');
        
        return back();
    }

    public function approve(Request $request, int $transaction)
    {
        $transaction = Transaction::findOrFail($transaction);

        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
        ]);

        if ($transaction->status !== 'on_hold') {
            return response()->json([
                'success' => false,
                'message' => 'Transaction cannot be approved.',
            ], 400);
        }

        $transaction->update(['status' => 'paid']);

        $appointment = Appointment::find($request->appointment_id);
        if ($appointment) {
            $appointment->update([
                'payment_status' => 'paid',
                'status' => 'confirmed'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment approved and appointment confirmed!',
            'transaction' => $transaction->fresh(),
        ]);
    }

    public function reject(Request $request, int $transaction)
    {
        $transaction = Transaction::findOrFail($transaction);

        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'reason' => 'sometimes|string|max:255',
        ]);

        if ($transaction->status !== 'on_hold') {
            return response()->json([
                'success' => false,
                'message' => 'Transaction cannot be rejected.',
            ], 400);
        }

        $transaction->update(['status' => 'cancelled']);

        $appointment = Appointment::find($request->appointment_id);
        if ($appointment) {
            $appointment->update(['payment_status' => 'pending']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment rejected.',
            'transaction' => $transaction->fresh(),
        ]);
    }

    public function approveByAppointment(Request $request, $appointmentId)
    {
        $appointment = Appointment::findOrFail($appointmentId);
        
        if ($appointment->payment_status === 'paid') {
            return redirect()->back()->withErrors([
                'payment' => 'This payment has already been approved.'
            ]);
        }
        
        $transaction = Transaction::where('user_id', $appointment->user_id)
            ->where('doctor_id', $appointment->provider_id)
            ->whereIn('status', ['on_hold', 'paid'])
            ->latest()
            ->first();

        if (!$transaction) {
            return redirect()->back()->withErrors([
                'payment' => 'No payment found for this appointment.'
            ]);
        }

        $transaction->update(['status' => 'paid']);

        $appointment->update([
            'payment_status' => 'paid',
            'status' => 'confirmed'
        ]);

        return redirect()->back()->with('success', 'Payment approved and appointment confirmed!');
    }

    public function rejectByAppointment(Request $request, $appointmentId)
    {
        $appointment = Appointment::findOrFail($appointmentId);
        
        $transaction = Transaction::where('user_id', $appointment->user_id)
            ->where('doctor_id', $appointment->provider_id)
            ->where('status', 'on_hold')
            ->latest()
            ->first();

        if (!$transaction) {
            return redirect()->back()->withErrors([
                'payment' => 'No pending payment found for this appointment.'
            ]);
        }

        $transaction->update(['status' => 'cancelled']);

        $appointment->update(['payment_status' => 'pending']);

        return redirect()->back()->with('success', 'Payment rejected.');
    }
}
