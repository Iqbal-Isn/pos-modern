<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Multitenancy\Models\Tenant;

class SettingsController extends Controller
{
    public function index()
    {
        $tenant = \App\Models\Tenant::current();
        
        return inertia('settings/index', [
            'tenant' => $tenant,
            'settings' => $tenant->settings ?? [
                'store_name' => $tenant->name,
                'address' => '',
                'phone' => '',
                'email' => '',
                'receipt_footer' => 'Thank you for shopping!',
                'tax_rate' => 0,
                'currency' => 'IDR'
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'receipt_footer' => 'nullable|string',
            'tax_rate' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
        ]);

        $tenant = \App\Models\Tenant::current();
        
        // Update both the specific metadata and the main tenant name for consistency
        $tenant->update([
            'name' => $validated['store_name'],
            'settings' => $validated
        ]);

        return back()->with('success', 'Settings updated successfully.');
    }
}
