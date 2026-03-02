<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcurementItem extends Model
{
    protected $fillable = [
        'procurement_id',
        'product_id',
        'product_variant_id',
        'quantity',
        'cost_price',
        'total_price',
    ];

    public function procurement()
    {
        return $this->belongsTo(Procurement::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
