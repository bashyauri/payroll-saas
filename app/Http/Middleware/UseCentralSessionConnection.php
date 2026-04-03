<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\SessionManager;
use Illuminate\Support\Facades\Config;

class UseCentralSessionConnection
{
    public function handle(Request $request, Closure $next)
    {
        if (app()->environment('testing')) {
            return $next($request);
        }

        Config::set('session.connection', config('session.connection')
            ?: config('tenancy.database.central_connection', config('database.default')));

        app(SessionManager::class)->forgetDrivers();

        return $next($request);
    }
}
