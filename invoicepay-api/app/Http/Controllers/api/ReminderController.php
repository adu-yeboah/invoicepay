<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ReminderController extends Controller
{
    /**
     * Get all reminders for an invoice.
     */
    public function index(Invoice $invoice)
    {
        $this->authorizeInvoice($invoice);

        $reminders = $invoice->reminders()->latest()->get();

        return response()->json($reminders);
    }

    /**
     * Send a manual reminder for an invoice.
     */
    public function store(Request $request, Invoice $invoice)
    {
        $this->authorizeInvoice($invoice);

        $request->validate([
            'type' => ['required', 'in:due_soon,overdue,custom'],
        ]);

        // Prevent spamming reminders
        $recentReminder = $invoice->reminders()
            ->where('type', $request->type)
            ->where('sent_at', '>=', now()->subHours(24))
            ->first();

        if ($recentReminder) {
            return response()->json([
                'message' => 'A reminder of this type was already sent in the last 24 hours.',
            ], 422);
        }

        try {
            // Send the appropriate email
            switch ($request->type) {
                case 'due_soon':
                    Mail::to($invoice->client->email)
                        ->send(new \App\Mail\InvoiceDueSoonMail($invoice));
                    break;
                case 'overdue':
                    Mail::to($invoice->client->email)
                        ->send(new \App\Mail\InvoiceOverdueMail($invoice));
                    break;
                case 'custom':
                    // For custom reminders, you might want to create a new Mailable
                    // For now, we'll use the overdue mail
                    Mail::to($invoice->client->email)
                        ->send(new \App\Mail\InvoiceOverdueMail($invoice));
                    break;
            }

            // Record the reminder
            $reminder = Reminder::create([
                'invoice_id' => $invoice->id,
                'type' => $request->type,
                'sent_at' => now(),
            ]);

            return response()->json([
                'message' => 'Reminder sent successfully.',
                'reminder' => $reminder,
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to send reminder.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a reminder record.
     */
    public function destroy(Reminder $reminder)
    {
        $this->authorizeReminder($reminder);

        $reminder->delete();

        return response()->json([
            'message' => 'Reminder deleted successfully.',
        ]);
    }

    /**
     * Authorize that the user owns the invoice.
     */
    private function authorizeInvoice(Invoice $invoice): void
    {
        if ($invoice->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }
    }

    /**
     * Authorize that the user owns the reminder (via invoice).
     */
    private function authorizeReminder(Reminder $reminder): void
    {
        if ($reminder->invoice->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }
    }
}
