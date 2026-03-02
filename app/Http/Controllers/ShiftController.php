<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function status()
    {
        $shift = \App\Models\Shift::where('user_id', auth()->id())
            ->where('status', 'OPEN')
            ->first();

        return response()->json([
            'has_active_shift' => !!$shift,
            'shift' => $shift
        ]);
    }

    public function open(Request $request)
    {
        $request->validate([
            'starting_cash' => 'required|numeric|min:0',
        ]);

        $existingShift = \App\Models\Shift::where('user_id', auth()->id())
            ->where('status', 'OPEN')
            ->first();

        if ($existingShift) {
            return response()->json(['message' => 'You already have an active shift.'], 422);
        }

        $shift = \App\Models\Shift::create([
            'user_id' => auth()->id(),
            'opened_at' => now(),
            'starting_cash' => $request->starting_cash,
            'expected_cash' => $request->starting_cash,
            'status' => 'OPEN',
        ]);

        return response()->json([
            'message' => 'Shift opened successfully.',
            'shift' => $shift
        ]);
    }

    public function close(Request $request)
    {
        $request->validate([
            'actual_cash' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $shift = \App\Models\Shift::where('user_id', auth()->id())
            ->where('status', 'OPEN')
            ->firstOrFail();

        $shift->update([
            'closed_at' => now(),
            'actual_cash' => $request->actual_cash,
            'difference' => $request->actual_cash - $shift->expected_cash,
            'status' => 'CLOSED',
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Shift closed successfully.',
            'shift' => $shift
        ]);
    }
}
