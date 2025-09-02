<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(): Response
    {
        $transactions = Transaction::with(['user', 'doctor'])
            ->latest()
            ->get();

        return Inertia::render('Payments/Index', [
            'transactions' => $transactions,
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
            '4242424242424242' => 'paid',
            '4000000000000002' => 'failed',
            default => 'pending'
        };

        $transaction = Transaction::create([
            'user_id' => $request->user_id,
            'doctor_id' => $request->doctor_id,
            'amount' => $request->amount,
            'card_last4' => $cardLast4,
            'status' => $status,
        ]);

        if ($request->appointment_id && $status === 'paid') {
            $appointment = Appointment::find($request->appointment_id);
            if ($appointment) {
                $appointment->update(['payment_status' => 'paid']);
            }
        }

        $message = match ($status) {
            'paid' => 'Payment successful!',
            'failed' => 'Payment failed. Please try a different card.',
            default => 'Payment is being processed.'
        };

        return response()->json([
            'success' => $status !== 'failed',
            'message' => $message,
            'transaction' => $transaction,
        ]);
    }
}
