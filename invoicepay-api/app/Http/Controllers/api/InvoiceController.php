<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class InvoiceController extends Controller
{

    // Get Invoices 
    public function index(Request $request)
    {
        $query = Invoice::forUser(auth() - user()->id)
            ->with(['client', 'items']);

        //filter by status
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        // filter by date range
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

        $invoices = $query->latest()->paginate(15);

        return response()->json($invoices);
    }

    //store invoice   POST /api/invoices
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'  => ['required', 'integer'],
            'title'      => ['nullable', 'string', 'max:255'],
            'notes'      => ['nullable', 'string'],
            'issue_date' => ['required', 'date'],
            'due_date'   => ['required', 'date', 'after_or_equal:issue_date'],
            'tax_rate'   => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items'      => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity'    => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price'  => ['required', 'numeric', 'min:0'],
        ]);

        $client = Client::forUser(auth()->id())
            ->FindeOrFail($validated['client_id']);

        DB::beginTransaction();
        try {
            $invoice = Invoice::create([
                'user_id' => auth()->id(),
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

            // Calculate and save totals
            $invoice->recalculateTotals();

            DB::commit();

            return response()->json(
                $invoice->load(['client', 'items']),
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create invoice.'], 500);
        }
    }

    //GET /api/invoices/{id}
    public function show(Invoice $invoice)
    {
        $this->authorizeInvoice($invoice);

        return response()->json(
            $invoice->load(['client', 'items', 'payments'])
        );
    }


    // PUT /api/invoices/{id}
    public function update(Request $request, Invoice $invoice)
    {
        $this->authorizeInvoice($invoice);

        if (!$invoice->isEditable()) {
            return response()->json([
                'message' => 'Only draft invoices can be edited.'
            ], 422);
        }

        $validated = $request->validate([
            'client_id'  => ['sometimes', 'integer'],
            'title'      => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes'      => ['sometimes', 'nullable', 'string'],
            'issue_date' => ['sometimes', 'date'],
            'due_date'   => ['sometimes', 'date', 'after_or_equal:issue_date'],
            'tax_rate'   => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'items'      => ['sometimes', 'array', 'min:1'],
            'items.*.description' => ['required_with:items', 'string', 'max:255'],
            'items.*.quantity'    => ['required_with:items', 'numeric', 'min:0.01'],
            'items.*.unit_price'  => ['required_with:items', 'numeric', 'min:0'],
        ]);

        // Validate client ownership if client_id is being changed
        if (isset($validated['client_id'])) {
            Client::forUser(auth()->id())->findOrFail($validated['client_id']);
        }

        DB::beginTransaction();
        try {
            $invoice->update(collect($validated)->except('items')->toArray());

            //Replace all items if items array is provided
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
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update invoice.'], 500);
        }
    }

    // DELETE /api/invoices/{id}
    public function destroy(Invoice $invoice)
    {
        $this->authorizeInvoice($invoice);

        // Only drafts and cancelled invoices can be deleted
        if (!in_array($invoice->status, ['draft', 'cancelled'])) {
            return response()->json([
                'message' => 'Only draft or cancelled invoices can be deleted.',
            ], 422);
        }

        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted.']);
    }

    // POST /api/invoices/{id}/send
    public function send(Invoice $invoice)
    {
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

        // Email the client with the payment link
        Mail::to($invoice->client->email)
            ->send(new InvoiceSentMail($invoice));

        return response()->json([
            'message'      => 'Invoice sent successfully.',
            'payment_link' => config('app.frontend_url') . '/pay/' . $invoice->public_token,
            'invoice'      => $invoice->load(['client', 'items']),
        ]);
    }

    // POST /api/invoices/{id}/mark-paid
    // Manually mark an invoice as paid (cash, bank transfer, etc.)
    public function markPaid(Invoice $invoice)
    {
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
    }


    // Private Helpers
    private function authorizeInvoice(Invoice $invoice): void
    {
        if ($invoice->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }
    }
}
