<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Procurement;
use App\Models\ProcurementItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProcurementController extends Controller
{
    public function index()
    {
        return inertia('procurements/index', [
            'procurements' => Procurement::with(['supplier', 'user'])
                ->latest()
                ->paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.cost_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $subtotal = collect($validated['items'])->sum(fn($item) => $item['quantity'] * $item['cost_price']);
            
            $procurement = Procurement::create([
                'supplier_id' => $validated['supplier_id'],
                'user_id' => auth()->id(),
                'reference_number' => 'PO-' . now()->format('YmdHis'),
                'date' => $validated['date'],
                'status' => 'DRAFT',
                'subtotal' => $subtotal,
                'total_amount' => $subtotal, // Adding tax logic later if needed
                'notes' => $validated['notes'],
            ]);

            foreach ($validated['items'] as $itemData) {
                $procurement->items()->create([
                    'product_id' => $itemData['product_id'],
                    'quantity' => $itemData['quantity'],
                    'cost_price' => $itemData['cost_price'],
                    'total_price' => $itemData['quantity'] * $itemData['cost_price'],
                ]);
            }

            return response()->json([
                'message' => 'Procurement created successfully',
                'procurement' => $procurement->load('items')
            ]);
        });
    }

    public function receive($id)
    {
        return DB::transaction(function () use ($id) {
            $procurement = Procurement::with('items')->findOrFail($id);
            
            if ($procurement->status === 'RECEIVED') {
                return response()->json(['message' => 'Procurement already received'], 422);
            }

            foreach ($procurement->items as $item) {
                $product = $item->product;
                
                // Update Inventory (Assuming a simple quantity column in products for now, or link to Inventories table)
                // In Phase 2 we might have created an Inventories table. Let's check.
                // For now, let's log stock movement.
                
                \App\Models\StockMovement::create([
                    'tenant_id' => $procurement->tenant_id,
                    'product_id' => $item->product_id,
                    'type' => 'STK-IN',
                    'quantity' => $item->quantity,
                    'reference' => $procurement->reference_number,
                    'user_id' => auth()->id(),
                ]);
            }

            $procurement->update(['status' => 'RECEIVED']);

            return response()->json([
                'message' => 'Procurement received and stock updated',
                'procurement' => $procurement
            ]);
        });
    }
}
