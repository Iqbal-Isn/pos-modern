<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use \App\Models\Concerns\BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'sku',
        'barcode',
        'name',
        'description',
        'category_id',
        'brand_id',
        'unit_of_measure_id',
        'base_cost',
        'base_price',
        'inventory_method',
        'track_inventory',
        'allow_negative_stock',
        'has_variants',
        'is_active',
        'images',
        'weight',
    ];

    protected $casts = [
        'images' => 'array',
        'track_inventory' => 'boolean',
        'allow_negative_stock' => 'boolean',
        'has_variants' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function unitOfMeasure()
    {
        return $this->belongsTo(UnitOfMeasure::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }
}
