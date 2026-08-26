<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmployeeRecord
{
    /**
     * Ensure the authenticated user has an associated employee record for self-service access.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if (! tenancy()->initialized || ! tenant()) {
            abort(403, 'Self-service access requires tenant context.');
        }

        if (! $user->hasEmployeeRecord()) {
            abort(403, 'No employee record found for your account. Please contact your HR administrator.');
        }

        return $next($request);
    }
}