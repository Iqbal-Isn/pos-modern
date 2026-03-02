<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends \Spatie\Multitenancy\Models\Tenant
{
    protected $fillable = [
        'name',
        'domain',
        'database',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];
}
