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

        if ($request->hasHeader('X-Inertia')) {
            return redirect()->intended(route('onboarding.continue'));
        }

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect()->intended(route('onboarding.continue'));
    }
}
