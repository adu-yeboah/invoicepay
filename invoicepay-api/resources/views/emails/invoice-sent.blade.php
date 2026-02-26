<x-mail::message>
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #1a56db; color: white; padding: 24px; text-align: center; }
        .body { padding: 32px; }
        .amount { font-size: 32px; font-weight: bold; color: #1a56db; margin: 16px 0; }
        .btn { display: inline-block; background: #1a56db; color: white; padding: 14px 32px;
               text-decoration: none; border-radius: 6px; font-size: 16px; margin-top: 24px; }
        .footer { padding: 16px 32px; color: #888; font-size: 13px; border-top: 1px solid #eee; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f5f5f5; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{ $invoice->user->business_name ?? $invoice->user->name }}</h2>
    </div>

    <div class="body">
        <p>Hi {{ $invoice->client->name }},</p>
        <p>You have received an invoice from <strong>{{ $invoice->user->business_name }}</strong>.</p>

        <p><strong>Invoice:</strong> {{ $invoice->invoice_number }}<br>
           <strong>Due Date:</strong> {{ $invoice->due_date->format('M d, Y') }}</p>

        <div class="amount">GHS {{ number_format($invoice->total, 2) }}</div>

        <table>
            <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            @foreach($invoice->items as $item)
            <tr>
                <td>{{ $item->description }}</td>
                <td>{{ $item->quantity }}</td>
                <td>GHS {{ number_format($item->unit_price, 2) }}</td>
                <td>GHS {{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach
            @if($invoice->tax_rate > 0)
            <tr>
                <td colspan="3"><strong>Tax ({{ $invoice->tax_rate }}%)</strong></td>
                <td><strong>GHS {{ number_format($invoice->tax_amount, 2) }}</strong></td>
            </tr>
            @endif
            <tr>
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>GHS {{ number_format($invoice->total, 2) }}</strong></td>
            </tr>
        </table>

        @if($invoice->notes)
        <p><strong>Notes:</strong> {{ $invoice->notes }}</p>
        @endif

        <a class="btn" href="{{ config('app.frontend_url') }}/pay/{{ $invoice->public_token }}">
            Pay Now
        </a>
    </div>

    <div class="footer">
        <p>This invoice was sent via InvoicePay. If you have questions, contact {{ $invoice->user->email }}.</p>
    </div>
</body>
</html>

<x-mail::button :url="''">
Button Text
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>

