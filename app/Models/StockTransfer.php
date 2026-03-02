<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockTransfer extends Model
{
    use \App\Models\Concerns\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'from_tenant_id',
        'to_tenant_id',
        'reference_number',
        'status',
        'notes',
        'shipped_at',
        'received_at',
    ];

    protected $casts = [
        'shipped_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    public function fromTenant()
    {
        return $this->belongsTo(Tenant::class, 'from_tenant_id');
    }

    public function toTenant()
    {
        return $this->belongsTo(Tenant::class, 'to_tenant_id');
    }

    public function items()
    {
        return $this->hasMany(StockTransferItem::class);
    }
}
