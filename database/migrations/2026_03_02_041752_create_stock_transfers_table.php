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
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade'); // Tenant that initiated
            $table->foreignId('from_tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('to_tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->string('reference_number')->unique();
            $table->string('status')->default('DRAFT'); // DRAFT, REQUESTED, APPROVED, SHIPPED, IN-TRANSIT, RECEIVED, COMPLETED, CANCELLED
            $table->text('notes')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('received_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transfers');
    }
};
