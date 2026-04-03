<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SkipTenancyOnCentralDomain
{
    /**
     * Handle an incoming request.
     * Skip to central routes if on a central domain to prevent tenant initialization errors.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $host = $request->getHost();
        $centralDomains = config('tenancy.central_domains', []);

        // If current host is a central domain, don't try to initialize tenancy
        if (in_array($host, $centralDomains, true)) {
            // Include central routes instead
            if (file_exists(base_path('routes/web.php'))) {
                return include base_path('routes/web.php');
            }
        }

        return $next($request);
    }
}
