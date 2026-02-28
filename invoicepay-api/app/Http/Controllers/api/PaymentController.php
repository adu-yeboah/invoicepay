<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    //GET /api/pay/{token}
    // Public — client opens this to see invoice details before paying
    public function show(string $token)
    {
        $invoice = Invoice::with(['client', 'items', 'user'])
            ->where('public_token', $token)
            ->firstOrFail();

        //only sent or overdue invoices are payable
        if (!in_array($invoice->status, ['sent', 'overdue'])) {
            return response()->json([
                'message' => 'This invoice is not available for payment.',
            ], 422);
        }

        //Hide sensitive user data from public response
        return response()->json([
            'invoice_number' => $invoice->invoice_number,
            'title'          => $invoice->title,
            'status'         => $invoice->status,
            'issue_date'     => $invoice->issue_date,
            'due_date'       => $invoice->due_date,
            'subtotal'       => $invoice->subtotal,
            'tax_rate'       => $invoice->tax_rate,
            'tax_amount'     => $invoice->tax_amount,
            'total'          => $invoice->total,
            'notes'          => $invoice->notes,
            'currency'       => 'GHS',
            'items'          => $invoice->items,
            'client'         => [
                'name'  => $invoice->client->name,
                'email' => $invoice->client->email,
            ],
            'business' => [
                'name' => $invoice->user->business_name ?? $invoice->user->name,
                'logo' => $invoice->user->business_logo
                    ? asset('storage/' . $invoice->user->business_logo)
                    : null,
            ],
        ]);
    }

    // POST /api/pay/{token}/initiate
    // Public — starts the Paystack payment process
    public function initaite(string $token)
    {
        $invoice = Invoice::with(['client', 'user'])
            ->where('public_token', $token)
            ->firstOrFail();

        if (!in_array($invoice->status, ['sent', 'overdue'])) {
            return response()->json([
                'message' => 'This invoice is not available for paymet.'
            ], 422);
        }

        if (!$invoice->user->hasPayStack()) {
            return response()->json([
                'message' => 'Payment is not configured for this invoice.',
            ], 422);
        }

        // Generate a unique reference for this payment attempt
        $reference = 'INV-' . $invoice->id . '-' . time();

        // Create a pending payment record
        Payment::create([
            'invoice_id'          => $invoice->id,
            'paystack_reference'  => $reference,
            'amount'              => $invoice->total,
            'currency'            => 'GHS',
            'status'              => 'pending',
        ]);

        // Call Paystack to initialize transaction
        $response = Http::withToken($invoice->user->paystack_secret_key)
            ->post('https://api.paystack.co/transaction/initialize', [
                'email'       => $invoice->client->email,
                'amount'      => (int) ($invoice->total * 100), // convert to pesewas
                'reference'   => $reference,
                'currency'    => 'GHS',
                'metadata'    => [
                    'invoice_id'     => $invoice->id,
                    'invoice_number' => $invoice->invoice_number,
                    'public_token'   => $token,
                ],
                'callback_url' => config('app.frontend_url') . '/pay/' . $token . '/success',
            ]);

        if (!$response->successful()) {
            Log::error('Paystack initiation failed', $response->json());
            return response()->json([
                'message' => 'Could not initiate payment. Please try again.',
            ], 500);
        }

        return response()->json([
            'authorization_url' => $response->json('data.authorization_url'),
            'reference'       => $reference,
        ]);
    }

    // GET /api/pay/{token}/verify/{reference}
    // Called after Paystack redirects back — double-checks payment status
    public function verify(string $token, string $reference)
    {
        $invoice = Invoice::with('user')
            ->where('public_token', $token)
            ->firstOrFail();

        $payment = Payment::where('paystack_reference', $reference)
            ->where('invoice_id', $invoice->id)
            ->firstOrFail();

        // Verify with Paystack directly (never trust frontend-only confirmation)
        $response = Http::withToken($invoice->user->paystack_secret_key)
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        if (!$response->successful()) {
            return response()->json(['message' => 'Verification failed.'], 500);
        }

        $data = $response->json('data');

        if ($data['status'] === 'success') {
            $payment->update([
                'status'         => 'success',
                'payment_method' => $data['channel'],
                'paid_at'        => now(),
            ]);

            // Mark invoice as paid if not already
            if (!$invoice->isPaid()) {
                $invoice->update([
                    'status'  => 'paid',
                    'paid_at' => now(),
                ]);
            }

            return response()->json([
                'status'         => 'success',
                'invoice_number' => $invoice->invoice_number,
                'amount'         => $payment->amount,
                'paid_at'        => $payment->paid_at,
            ]);
        }

        return response()->json(['status' => $data['status']]);
    }

    // POST /api/paystack/webhook
    // Called by Paystack server
    public function webhook(Request $request)
    {
        // 1. Verify the request is genuinely from Paystack
        // Use the business owner's key 
        $payload   = $request->getContent();
        $signature = $request->header('x-paystack-signature');

        if (!$signature) {
            return response()->json(['message' => 'Missing signature.'], 401);
        }

        if ($request->input('event') !== 'charge.success') {
            // We only care about successful charges 
            return response()->json(['message' => 'Event ignored.']);
        }

        $data      = $request->input('data');
        $reference = $data['reference'];
        $invoiceId = $data['metadata']['invoice_id'] ?? null;

        if (!$invoiceId) {
            Log::warning('Webhook missing invoice_id in metadata', $data);
            return response()->json(['message' => 'Missing invoice_id.'], 400);
        }

        $invoice = Invoice::with('user')->find($invoiceId);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        // Verify signature using this invoice owner's Paystack key
        $expectedHash = hash_hmac('sha512', $payload, $invoice->user->paystack_secret_key);

        if ($expectedHash !== $signature) {
            Log::warning('Webhook signature mismatch for invoice ' . $invoiceId);
            return response()->json(['message' => 'Invalid signature.'], 401);
        }

        // 2. Update payment record
        $payment = Payment::where('paystack_reference', $reference)->first();

        if ($payment) {
            $payment->update([
                'status'         => 'success',
                'payment_method' => $data['channel'],
                'paid_at'        => now(),
            ]);
        } else {
            // Payment record missing — create it (safety net)
            Payment::create([
                'invoice_id'         => $invoice->id,
                'paystack_reference' => $reference,
                'amount'             => $data['amount'] / 100,
                'currency'           => $data['currency'],
                'payment_method'     => $data['channel'],
                'status'             => 'success',
                'paid_at'            => now(),
            ]);
        }

        // 3. Mark invoice as paid
        if (!$invoice->isPaid()) {
            $invoice->update([
                'status'  => 'paid',
                'paid_at' => now(),
            ]);
        }

        Log::info("Invoice #{$invoice->invoice_number} marked paid via webhook.");

        return response()->json(['message' => 'OK']);
    }
}
