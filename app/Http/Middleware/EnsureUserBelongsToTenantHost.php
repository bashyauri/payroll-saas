<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserBelongsToTenantHost
{
    /**
     * Block authenticated users from accessing tenant hosts they do not belong to.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $host = $request->getHost();

        if ($host === '') {
            return $next($request);
        }

        if (in_array($host, config('tenancy.central_domains', []), true)) {
            return $next($request);
        }

        $hostOrganization = Organization::query()
            ->whereHas('domains', function ($query) use ($host): void {
                $query->where('domain', $host);
            })
            ->first();

        if (! $hostOrganization) {
            return $next($request);
        }

        $belongsToOrganization = $user->organizations()->whereKey($hostOrganization->id)->exists();

        if ($belongsToOrganization) {
            return $next($request);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $centralDomains = config('tenancy.central_domains', []);
        $centralDomain = in_array('payroll-saas.test', $centralDomains, true)
            ? 'payroll-saas.test'
            : ($centralDomains[0] ?? 'theniyiconsult.com.ng');

        $scheme = app()->isProduction() ? 'https' : 'http';

        return redirect()->to("{$scheme}://{$centralDomain}/login")
            ->with('status', 'You do not have access to that organization.');
    }
}
