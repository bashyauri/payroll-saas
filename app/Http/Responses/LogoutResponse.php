<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LogoutResponse implements LogoutResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response
    {
        $centralDomains = config('tenancy.central_domains', []);
        $centralDomain = in_array('payroll-saas.test', $centralDomains, true)
            ? 'payroll-saas.test'
            : ($centralDomains[0] ?? 'theniyiconsult.com.ng');

        $scheme = app()->isProduction() ? 'https' : 'http';
        $url = "{$scheme}://{$centralDomain}/login";

        if ($request->hasHeader('X-Inertia')) {
            return Inertia::location($url);
        }

        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->to($url);
    }
}
