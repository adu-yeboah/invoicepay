<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Invoice extends Model
{
    protected $fillable = [
        'user_id',
        'client_id',
        'invoice_number',
        'title',
        'notes',
        'status',
        'issue_date',
        'due_date',
        'subtotal',
        'tax_rate',
        'tax_amount',
        'total',
        'public_token',
        'paid_at',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date'   => 'date',
        'paid_at'    => 'datetime',
        'subtotal'   => 'float',
        'tax_rate'   => 'float',
        'tax_amount' => 'float',
        'total'      => 'float',
    ];

    //auto generate number and tokenon create
    protected  static function booted(): void
    {
        static::creating(function (Invoice $invoice) {
            //auto generate public token
            $invoice->public_token = Str::uuid();

            // Auto generate invoice number
            $invoice->invoice_number = self::generateNummber($invoice->user_id);
        });
    }

    // relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    //  public function items()
    // {
    //     return $this->hasMany(InvoiceItem::class)->orderBy('sort_order');
    // }

    // public function payments()
    // {
    //     return $this->hasMany(Payment::class);
    // }

    // public function reminders()
    // {
    //     return $this->hasMany(Reminder::class);
    // }


    //Scopes
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    // Helpers
    public function isDraft(): bool
    {
        return $this->status === 'darft';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isEditable(): bool
    {
        return $this->status === 'draft';
    }


    public function recalculatedTotals(): void
    {
        $subtotal = $this->items()->sum('total');
        $taxAmount = round($subtotal * ($this->tax_rate / 100), 2);
        $total = round($subtotal + $taxAmount, 2);

        $this->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total' => $total,
        ]);
    }

    // static Helpers
    public static function generateNumber(int $userId): string 
    {
        $count = self::where('user_id', $userId)->count() + 1;
        return 'INV-' . date('Y') . '-' . str_pad($count, 3, '0', 'STR_PAD_LEFT');
    }
}
