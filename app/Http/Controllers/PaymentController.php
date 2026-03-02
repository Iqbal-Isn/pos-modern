<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;
use App\Models\Sale;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createSnapToken(Request $request)
    {
        $request->validate([
            'sale_id' => 'required|exists:sales,id',
        ]);

        $sale = Sale::findOrFail($request->sale_id);

        $params = [
            'transaction_details' => [
                'order_id' => $sale->invoice_number,
                'gross_amount' => (int) $sale->total_amount,
            ],
            'customer_details' => [
                'first_name' => auth()->user()->name,
                'email' => auth()->user()->email,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function handleNotification(Request $request)
    {
        $notif = new Notification();

        $transaction = $notif->transaction_status;
        $type = $notif->payment_type;
        $orderId = $notif->order_id;
        $fraud = $notif->fraud_status;

        $sale = Sale::where('invoice_number', $orderId)->first();

        if (!$sale) {
            return response()->json(['message' => 'Sale not found'], 404);
        }

        if ($transaction == 'capture') {
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $sale->update(['payment_status' => 'CHALLENGE']);
                } else {
                    $sale->update(['payment_status' => 'PAID']);
                }
            }
        } else if ($transaction == 'settlement') {
            $sale->update(['payment_status' => 'PAID']);
        } else if ($transaction == 'pending') {
            $sale->update(['payment_status' => 'PENDING']);
        } else if ($transaction == 'deny') {
            $sale->update(['payment_status' => 'DENIED']);
        } else if ($transaction == 'expire') {
            $sale->update(['payment_status' => 'EXPIRED']);
        } else if ($transaction == 'cancel') {
            $sale->update(['payment_status' => 'CANCELLED']);
        }

        return response()->json(['success' => true]);
    }
}
