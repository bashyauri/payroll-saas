<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LogoutResponse implements LogoutResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response
    {
        $centralDomains = config('tenancy.central_domains');
        $centralDomain = in_array('payroll-saas.test', $centralDomains, true)
            ? 'payroll-saas.test'
            : ($centralDomains[0] ?? 'theniyiconsult.com.ng');

        // Use explicit https for production, http for local dev
        $scheme = app()->isProduction() ? 'https' : 'http';


        return redirect()->to("{$scheme}://{$centralDomain}/login");
    }
}
