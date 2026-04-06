<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Mail\InvoiceSentMail;
use App\Models\Client;
use App\Models\Invoice;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class InvoiceController extends Controller
{
    // GET /api/invoices
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Invoice::forUser(auth()->id())
                ->with(['client', 'items']);

            // Filter by status
            if ($request->filled('status')) {
                $query->byStatus($request->status);
            }

            // Filter by date range
            if ($request->filled('from')) {
                $query->whereDate('issue_date', '>=', $request->from);
            }

            if ($request->filled('to')) {
                $query->whereDate('issue_date', '<=', $request->to);
            }

            // Search by client name or invoice number
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                        ->orWhereHas('client', fn($q) => $q->where('name', 'like', "%{$search}%"));
                });
            }

            return response()->json($query->latest()->paginate(15));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve invoices.',
            ], 500);
        }
    }

    // POST /api/invoices
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_id'           => ['required', 'integer'],
            'title'               => ['nullable', 'string', 'max:255'],
            'notes'               => ['nullable', 'string'],
            'issue_date'          => ['required', 'date'],
            'due_date'            => ['required', 'date', 'after_or_equal:issue_date'],
            'tax_rate'            => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items'               => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity'    => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price'  => ['required', 'numeric', 'min:0'],
        ]);

        $client = Client::forUser(auth()->id())
            ->find($validated['client_id']);

        if (!$client) {
            return response()->json([
                'message' => 'Client not found or does not belong to you.',
            ], 422);
        }
        
        DB::beginTransaction();
        try {
            $invoice = Invoice::create([
                'user_id'    => auth()->id(),
                'client_id'  => $client->id,
                'title'      => $validated['title'] ?? null,
                'notes'      => $validated['notes'] ?? null,
                'issue_date' => $validated['issue_date'],
                'due_date'   => $validated['due_date'],
                'tax_rate'   => $validated['tax_rate'] ?? 0,
            ]);

            foreach ($validated['items'] as $index => $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity'    => $item['quantity'],
                    'unit_price'  => $item['unit_price'],
                    'sort_order'  => $index,
                ]);
            }

            $invoice->recalculateTotals();

            DB::commit();

            return response()->json(
                $invoice->load(['client', 'items']),
                201
            );
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create invoice.'], 500);
        }
    }

    // GET /api/invoices/{id}
    public function show(Invoice $invoice): JsonResponse
    {
        try {
            $this->authorizeInvoice($invoice);

            return response()->json(
                $invoice->load(['client', 'items', 'payments'])
            );
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve invoice.',
            ], 500);
        }
    }

    // PUT /api/invoices/{id}
    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorizeInvoice($invoice);

        if (!$invoice->isEditable()) {
            return response()->json([
                'message' => 'Only draft invoices can be edited.',
            ], 422);
        }

        $validated = $request->validate([
            'client_id'           => ['sometimes', 'integer'],
            'title'               => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes'               => ['sometimes', 'nullable', 'string'],
            'issue_date'          => ['sometimes', 'date'],
            'due_date'            => ['sometimes', 'date', 'after_or_equal:issue_date'],
            'tax_rate'            => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'items'               => ['sometimes', 'array', 'min:1'],
            'items.*.description' => ['required_with:items', 'string', 'max:255'],
            'items.*.quantity'    => ['required_with:items', 'numeric', 'min:0.01'],
            'items.*.unit_price'  => ['required_with:items', 'numeric', 'min:0'],
        ]);

        if (isset($validated['client_id'])) {
            Client::forUser(auth()->id())->findOrFail($validated['client_id']);
        }

        DB::beginTransaction();
        try {
            $invoice->update(collect($validated)->except('items')->toArray());

            if (isset($validated['items'])) {
                $invoice->items()->delete();

                foreach ($validated['items'] as $index => $item) {
                    $invoice->items()->create([
                        'description' => $item['description'],
                        'quantity'    => $item['quantity'],
                        'unit_price'  => $item['unit_price'],
                        'sort_order'  => $index,
                    ]);
                }
            }

            $invoice->recalculateTotals();

            DB::commit();

            return response()->json($invoice->load(['client', 'items']));
        } catch (QueryException $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update invoice.'], 500);
        }
    }

    // DELETE /api/invoices/{id}
    public function destroy(Invoice $invoice): JsonResponse
    {
        try {
            $this->authorizeInvoice($invoice);

            if (!in_array($invoice->status, ['draft', 'cancelled'])) {
                return response()->json([
                    'message' => 'Only draft or cancelled invoices can be deleted.',
                ], 422);
            }

            $invoice->delete();

            return response()->json(['message' => 'Invoice deleted successfully.']);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Failed to delete invoice.',
            ], 500);
        }
    }

    // POST /api/invoices/{id}/send
    public function send(Invoice $invoice): JsonResponse
    {
        try {
            $this->authorizeInvoice($invoice);

            if (!$invoice->isDraft()) {
                return response()->json([
                    'message' => 'Only draft invoices can be sent.',
                ], 422);
            }

            if (!$invoice->user->hasPaystack()) {
                return response()->json([
                    'message' => 'Please add your Paystack secret key in settings before sending invoices.',
                ], 422);
            }

            $invoice->update(['status' => 'sent']);

            Mail::to($invoice->client->email)
                ->send(new InvoiceSentMail($invoice));

            return response()->json([
                'message'      => 'Invoice sent successfully.',
                'payment_link' => config('app.frontend_url') . '/pay/' . $invoice->public_token,
                'invoice'      => $invoice->load(['client', 'items']),
            ]);
        } catch (\Symfony\Component\Mailer\Exception\TransportException $e) {
            // Roll back status if mail fails
            $invoice->update(['status' => 'draft']);
            return response()->json([
                'message' => 'Invoice status was not changed. Failed to send email.',
            ], 500);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Failed to send invoice.',
            ], 500);
        }
    }

    // POST /api/invoices/{id}/mark-paid
    public function markPaid(Invoice $invoice): JsonResponse
    {
        try {
            $this->authorizeInvoice($invoice);

            if ($invoice->isPaid()) {
                return response()->json(['message' => 'Invoice is already paid.'], 422);
            }

            $invoice->update([
                'status'  => 'paid',
                'paid_at' => now(),
            ]);

            return response()->json([
                'message' => 'Invoice marked as paid.',
                'invoice' => $invoice->load(['client', 'items']),
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Failed to mark invoice as paid.',
            ], 500);
        }
    }

    // ─── Private Helpers ──────────────────────────────────────────

    private function authorizeInvoice(Invoice $invoice): void
    {
        if ($invoice->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }
    }
}
