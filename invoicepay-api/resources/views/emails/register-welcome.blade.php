<x-mail::message>
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #f59e0b; color: white; padding: 24px; text-align: center; }
        .body { padding: 32px; }
        .amount { font-size: 28px; font-weight: bold; color: #f59e0b; margin: 16px 0; }
        .btn { display: inline-block; background: #f59e0b; color: white; padding: 14px 32px;
               text-decoration: none; border-radius: 6px; font-size: 16px; margin-top: 24px; }
        .footer { padding: 16px 32px; color: #888; font-size: 13px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Welcome to InovicePay</h2>
    </div>
    <div class="body">
        <p>Hi {{ $invoice->client->name }},</p>
        <p>This is a friendly reminder that invoice <strong>{{ $invoice->invoice_number }}</strong>
           from <strong>{{ $invoice->user->business_name }}</strong> is due in
           <strong>2 days</strong> on .</p>

        <div class="amount">GHS {{ number_format($invoice->total, 2) }}</div>

        <a class="btn" href="{{ config('app.frontend_url') }}/pay/{{ $invoice->public_token }}">
            Pay Now
        </a>
    </div>
</body>
</html>
</x-mail::message>