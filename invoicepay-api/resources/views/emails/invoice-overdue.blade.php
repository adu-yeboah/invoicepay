<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #ef4444; color: white; padding: 24px; text-align: center; }
        .body { padding: 32px; }
        .amount { font-size: 28px; font-weight: bold; color: #ef4444; margin: 16px 0; }
        .btn { display: inline-block; background: #ef4444; color: white; padding: 14px 32px;
               text-decoration: none; border-radius: 6px; font-size: 16px; margin-top: 24px; }
        .footer { padding: 16px 32px; color: #888; font-size: 13px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Invoice Overdue</h2>
    </div>
    <div class="body">
        <p>Hi {{ $invoice->client->name }},</p>
        <p>Invoice <strong>{{ $invoice->invoice_number }}</strong> from
           <strong>{{ $invoice->user->business_name }}</strong> was due on
           <strong>{{ $invoice->due_date->format('M d, Y') }}</strong> and is now overdue.</p>

        <div class="amount">GHS {{ number_format($invoice->total, 2) }}</div>

        <p>Please make payment as soon as possible to avoid any disruption.</p>

        <a class="btn" href="{{ config('app.frontend_url') }}/pay/{{ $invoice->public_token }}">
            Pay Now
        </a>
    </div>
    <div class="footer">
        <p>Questions? Contact {{ $invoice->user->email }}</p>
    </div>
</body>
</html>