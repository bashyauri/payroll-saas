<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireOrganizationRole
{
    /**
     * Ensure the authenticated user has one of the required organization roles.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! tenancy()->initialized || ! tenant()) {
            abort(403, 'Unauthorized action.');
        }

        $requiredRoles = array_values(array_filter(array_map('trim', $roles)));

        if ($requiredRoles === []) {
            return $next($request);
        }

        $hasRole = $user->organizations()
            ->whereKey(tenant()->id)
            ->wherePivotIn('role', $requiredRoles)
            ->exists();

        if (! $hasRole) {
            abort(403, 'You do not have the required organization role for this action.');
        }

        return $next($request);
    }
}
