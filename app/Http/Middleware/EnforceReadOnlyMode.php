<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class EnforceReadOnlyMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $tenant = tenancy()->initialized ? tenancy()->tenant : null;

        if (! $tenant) {
            return $next($request);
        }

        // Check if organization is in read-only mode
        if ($tenant->read_only_mode === true) {
            // Allow GET requests (read operations)
            if ($request->isMethod('GET')) {
                return $next($request);
            }

            // Block POST, PATCH, PUT, DELETE requests (write operations)
            $writeMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];
            if (in_array($request->method(), $writeMethods, true)) {
                // Allow specific write operations that should work in read-only mode
                $allowedPaths = [
                    'login',
                    'logout',
                    'password',
                    'email/verification-notification',
                ];

                foreach ($allowedPaths as $allowedPath) {
                    if (str_contains($request->path(), $allowedPath)) {
                        return $next($request);
                    }
                }

                return Redirect::back()
                    ->with('error', 'Your account is in read-only mode. Write operations are disabled due to billing status. Please resolve your billing to restore full access.');
            }
        }

        return $next($request);
    }
}
