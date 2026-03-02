<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use \App\Models\Concerns\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'phone',
        'address',
        'points',
        'membership_level',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
