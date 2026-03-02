<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use \App\Models\Concerns\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'code',
        'name',
        'pic_name',
        'phone',
        'email',
        'address',
        'payment_terms',
    ];
}
