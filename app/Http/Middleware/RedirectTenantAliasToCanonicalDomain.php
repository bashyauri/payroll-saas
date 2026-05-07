<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectTenantAliasToCanonicalDomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = strtolower((string) $request->getHost());

        if ($host === '') {
            return $next($request);
        }

        $centralDomains = array_map('strtolower', (array) config('tenancy.central_domains', []));

        if (in_array($host, $centralDomains, true)) {
            return $next($request);
        }

        $organization = Organization::query()
            ->whereHas('domains', function ($query) use ($host): void {
                $query->whereRaw('LOWER(domain) = ?', [$host]);
            })
            ->first();

        if (! $organization) {
            return $next($request);
        }

        $baseDomain = trim((string) config('tenancy.base_domain'));

        if ($baseDomain === '') {
            return $next($request);
        }

        $canonicalDomain = strtolower($organization->slug.'.'.$baseDomain);

        $canonicalDomainExists = $organization->domains()
            ->whereRaw('LOWER(domain) = ?', [$canonicalDomain])
            ->exists();

        if (! $canonicalDomainExists) {
            return $next($request);
        }

        if ($host === $canonicalDomain) {
            return $next($request);
        }

        $targetUrl = $request->getScheme().'://'.$canonicalDomain.$request->getRequestUri();

        return redirect()->to($targetUrl, 302);
    }
}
