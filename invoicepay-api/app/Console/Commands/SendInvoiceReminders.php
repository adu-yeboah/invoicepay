<?php

namespace App\Console\Commands;

use App\Mail\InvoiceDueSoonMail;
use App\Models\Invoice;
use App\Models\Reminder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendInvoiceReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-invoice-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send due-soon and overdue reminders for unpaid invoices';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->sendDueSoonReminders();
        $this->sendOverdueReminders();

        $this->info('Invoice reminders sent successfully.');
    }

    private function sendDueSoonReminders(): void
    {
        $invoices = Invoice::where(['client', 'user'])
            ->where('status', 'sent')
            ->whereDate('due_date', now()->addDays(3)->toDateString())
            ->whereDoesntHave('reminders', fn($q) => $q->where('type', 'due_soon'))
            ->get();

        foreach ($invoices as $invoice) {
            try {
                Mail::to($invoice->client->email)
                    ->send(new InvoiceDueSoonMail($invoice));

                Reminder::create([
                    'invoice_id' => $invoice->id,
                    'type' => 'due_soon',
                    'sent_at' => now(),
                ]);

                $this->line("Due-soon reminder sent: {$invoice->invoice_number}");
            } catch (\Throwable $th) {
                Log::error("Failed to send due-soon reminder for invoice {$invoice->id}: {$th->getMessage()}");
            }
        }
    }

    private function sendOverdueReminders(): void
    {
        $invoices = Invoice::where(['client', 'user'])
            ->where('status', ['sent', 'overdue'])
            ->whereDate('due_date', '<', now()->toDateString())
            ->whereDoesntHave('reminders', function ($q) {
                // Don't send more than one overdue reminder per day
                $q->where('type', 'overdue')
                    ->whereDate('sent_at', now()->toDateString());
            })
            ->get();

        foreach ($invoices as $invoice) {
            try {
                Mail::to($invoice->client->email)->send(new InvoiceOverdueMail($invoice));

                Reminder::create([
                    'invoice_id' => $invoice->id,
                    'type' => 'overdue',
                    'sent_at' => now(),
                ]);

                $this->line("Overdue reminder sent: {$invoice->invoice_number}");
            } catch (\Throwable $th) {
                Log::error("Failed to send overdue reminder for invoice {$invoice->id}: {$th->getMessage()}");
            }
        }
    }
}
