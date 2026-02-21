<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
    ];

     /* 
     RELATIONSHIPS 
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function invoices() {
    //     return $this->hasMany(Invoices::class);
    // }


    /* 
     SCOPE 
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
