<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'paystack_reference',
        'amount',
        'currency',
        'payment_method',
        'status',
        'paid_at'
    ];  

     protected $casts = [
        'amount'  => 'float',
        'paid_at' => 'datetime',
    ];

    // Relationships
    public function invoice() {
        return $this->belongsTo(Invoice::class);
    }
}
