<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'description',
        'quantity',
        'unit_price',
        'total',
        'sort_order',
    ];

    protected $casts = [
        'quantity'   => 'float',
        'unit_price' => 'float',
        'total'      => 'float',
    ];

    // Boot: auto calculate item total on save 
    protected static function booted(): void
    {
        static::saving(function (InvoiceItem $item) {
            $item->total = round($item->quantity * $item->unit_price, 2);
        });
    }

    // relationships
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
