<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::all();
    }

    public function store(Request $request)
    {
        try {
            $payment = Payment::create($request->all());
            return response()->json($payment, 201);
        } catch (\Exception $e) {
            // Log the exception for further investigation
            \Log::error('Error creating payment: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create payment.'], 500);
        }
    }

    public function show(Payment $payment)
    {
        return $payment;
    }

    public function update(Request $request, Payment $payment)
    {
        $payment->update($request->all());
        return response()->json($payment, 200);
    }
    public function paymentsForConsultation($id)
    {
        $payments = Payment::where('consultation_id', $id)->get();
        return response()->json($payments);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}
