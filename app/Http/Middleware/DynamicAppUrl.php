<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class DynamicAppUrl
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $scheme = $request->getScheme();
        $host = $request->getHost();
        $url = "{$scheme}://{$host}";

        config(['app.url' => $url]);
        URL::forceRootUrl($url);
        URL::forceScheme($scheme);

        return $next($request);
    }
}
