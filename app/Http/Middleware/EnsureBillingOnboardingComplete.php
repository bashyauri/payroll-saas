<?php

namespace App\Http\Middleware;

use App\Models\Subscription;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBillingOnboardingComplete
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $organization = $user->organizations()->first();

        if (! $organization) {
            return redirect()
                ->route('billing.plans')
                ->with('onboarding_notice', 'Complete plan selection and payment to access your dashboard.');
        }

        $hasActiveSubscription = Subscription::query()
            ->where('organization_id', $organization->id)
            ->whereIn('status', [
                Subscription::STATUS_ACTIVE,
                Subscription::STATUS_PAST_DUE,
            ])
            ->exists();

        if (! $hasActiveSubscription) {
            return redirect()
                ->route('billing.plans')
                ->with('onboarding_notice', 'Complete payment to unlock dashboard access.');
        }

        return $next($request);
    }
}
