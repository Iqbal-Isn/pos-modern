<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentTenant
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            if (auth()->user()->tenant_id) {
                // User inherently belongs to a specific tenant
                $tenant = \App\Models\Tenant::find(auth()->user()->tenant_id);
                if ($tenant) {
                    $tenant->makeCurrent();
                }
            } elseif (session()->has('current_tenant_id')) {
                // HQ user who can switch between branches
                $tenant = \App\Models\Tenant::find(session()->get('current_tenant_id'));
                if ($tenant) {
                    $tenant->makeCurrent();
                }
            }
        }

        return $next($request);
    }
}
