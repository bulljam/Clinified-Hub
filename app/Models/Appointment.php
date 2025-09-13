<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'provider_id',
        'date',
        'time',
        'status',
        'payment_status',
        'notes',
        'requires_refund',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i:s',
        'requires_refund' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function getRequiresRefundAttribute($value): bool
    {
        return (bool) $value;
    }
}
