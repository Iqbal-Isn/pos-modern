<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use \App\Models\Concerns\BelongsToTenant;
    use \Kalnoy\Nestedset\NodeTrait;

    protected $fillable = [
        'tenant_id',
        'name',
        'slug',
        'image',
        'is_active',
        'parent_id',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
