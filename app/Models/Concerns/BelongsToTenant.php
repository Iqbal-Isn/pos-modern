<?php

namespace App\Models\Concerns;

use Spatie\Multitenancy\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            if (\App\Models\Tenant::checkCurrent()) {
                $builder->where($builder->getQuery()->from . '.tenant_id', \App\Models\Tenant::current()->id);
            }
        });

        static::creating(function ($model) {
            if (\App\Models\Tenant::checkCurrent() && !$model->tenant_id) {
                $model->tenant_id = \App\Models\Tenant::current()->id;
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }
}
