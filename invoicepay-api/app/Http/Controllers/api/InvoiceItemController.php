<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\InvoiceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceItemController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $item = InvoiceItem::create($validated);

        return response()->json($item, 201);
    }

     public function show(InvoiceItem $InvoiceItem): JsonResponse
    {
        try {
            $this->authorizeInvoiceItem($InvoiceItem);

            $InvoiceItem->load(['invoices' => fn($q) => $q->latest()->take(10)]);

            if (!$InvoiceItem) {
                Log("InvoiceItem not found");
                return response()->json([
                    "message" => "data not found"
                ]);
            }
            return response()->json([
                'message' => 'InvoiceItem retrieved successfully',
                'InvoiceItem'  => $InvoiceItem,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve InvoiceItem',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InvoiceItem $invoiceItem)
    {
        $validated = $request->validate([
            'description' => ['sometimes', 'string', 'max:255'],
            'quantity' => ['sometimes', 'numeric', 'min:0.01'],
            'unit_price' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $invoiceItem->update($validated);

        return response()->json($invoiceItem);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InvoiceItem $invoiceItem)
    {
        $invoiceItem->delete();

        return response()->json(['message' => 'Item deleted successfully.']);
    }

    //Hlpers
    private function authorizeInvoiceItem(InvoiceItem $invoiceItem)
    {
        if ($invoiceItem->invoice->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
    }
}
