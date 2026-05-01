<?php

namespace App\Http\Middleware;

use App\Services\Authorization\OrganizationRoleSyncService;
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

        $requiredRoles = collect($roles)
            ->flatMap(static fn (string $role): array => explode(',', $role))
            ->map(static fn (string $role): string => trim($role))
            ->filter(static fn (string $role): bool => $role !== '')
            ->values()
            ->all();

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

        app(OrganizationRoleSyncService::class)->syncForOrganizationUser($user, tenant());

        return $next($request);
    }
}
