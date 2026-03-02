<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class POSController extends Controller
{
    public function index()
    {
        $categories = \App\Models\Category::where('is_active', true)->get(['id', 'name']);
        
        $products = \App\Models\Product::where('is_active', true)
            ->with(['category', 'brand', 'unitOfMeasure'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'price' => $product->base_price, // Assuming base_price for now
                    'category_id' => $product->category_id,
                    'image' => $product->images[0] ?? null,
                ];
            });

        return inertia('pos/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'cart' => 'required|array|min:1',
            'payment_method' => 'required|string',
            'paid_amount' => 'required|numeric',
        ]);

        return \DB::transaction(function () use ($request) {
            $user = auth()->user();
            
            // Verify active shift
            $shift = \App\Models\Shift::where('user_id', $user->id)
                ->where('status', 'OPEN')
                ->first();

            if (!$shift) {
                return response()->json(['message' => 'Active shift required to perform transactions.'], 422);
            }

            $subtotal = 0;
            $items = [];

            foreach ($request->cart as $item) {
                $product = \App\Models\Product::findOrFail($item['id']);
                $itemSubtotal = $product->base_price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $items[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->base_price,
                    'cost' => $product->base_cost,
                    'subtotal' => $itemSubtotal,
                    'total_amount' => $itemSubtotal, // Simplified for now
                ];

                // Deduct Inventory if tracked
                if ($product->track_inventory) {
                    $inventory = \App\Models\Inventory::firstOrCreate(
                        ['product_id' => $product->id, 'tenant_id' => $user->tenant_id],
                        ['quantity_on_hand' => 0]
                    );
                    $inventory->decrement('quantity_on_hand', $item['quantity']);

                    // Log Stock Movement
                    \App\Models\StockMovement::create([
                        'product_id' => $product->id,
                        'type' => 'STK-OUT',
                        'quantity' => -$item['quantity'],
                        'notes' => 'Sales transaction'
                    ]);
                }
            }

            $taxRate = 11;
            $taxAmount = ($subtotal * $taxRate) / 100;
            $totalAmount = $subtotal + $taxAmount;

            $sale = \App\Models\Sale::create([
                'user_id' => $user->id,
                'customer_id' => $request->customer_id,
                'shift_id' => $shift->id,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'paid_amount' => $request->paid_amount,
                'change_amount' => $request->paid_amount - $totalAmount,
                'payment_method' => $request->payment_method,
            ]);

            // Loyalty Points (1 point per 10,000 IDR)
            if ($request->customer_id) {
                $customer = \App\Models\Customer::find($request->customer_id);
                if ($customer) {
                    $earnedPoints = floor($totalAmount / 10000);
                    $customer->increment('points', $earnedPoints);
                }
            }

            // Update Shift Totals
            if ($request->payment_method === 'CASH') {
                $shift->increment('total_cash_sales', $totalAmount);
                $shift->increment('expected_cash', $totalAmount);
            } else {
                $shift->increment('total_other_sales', $totalAmount);
            }

            foreach ($items as $itemData) {
                $sale->items()->create($itemData);
            }

            return response()->json([
                'success' => true,
                'message' => 'Transaction completed successfully',
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number
            ]);
        });
    }
}
