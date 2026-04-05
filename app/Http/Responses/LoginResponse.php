<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     */
    public function toResponse($request): Response
    {
        // Use payroll-saas.test locally, otherwise use the first central domain
        $centralDomains = config('tenancy.central_domains');
        $centralDomain = in_array('payroll-saas.test', $centralDomains, true)
            ? 'payroll-saas.test'
            : ($centralDomains[0] ?? 'payroll-saas.test');

        $scheme = parse_url((string) config('app.url'), PHP_URL_SCHEME) ?: 'https';
        $path = route('onboarding.continue', [], false);
        $url = "{$scheme}://{$centralDomain}{$path}";

        if ($request->hasHeader('X-Inertia')) {
            return redirect()->intended($url);
        }

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect()->to($url);
    }
}
