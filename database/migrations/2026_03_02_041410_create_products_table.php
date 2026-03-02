<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('sku')->unique();
            $table->string('barcode')->nullable()->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('brand_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('unit_of_measure_id')->nullable()->constrained()->onDelete('set null');
            
            // Pricing
            $table->decimal('base_cost', 15, 2)->default(0);
            $table->decimal('base_price', 15, 2)->default(0);
            
            // Inventory
            $table->string('inventory_method')->default('FIFO'); // FIFO, LIFO, Average
            $table->boolean('track_inventory')->default(true);
            $table->boolean('allow_negative_stock')->default(false);
            
            $table->boolean('has_variants')->default(false);
            $table->boolean('is_active')->default(true);
            $table->json('images')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
