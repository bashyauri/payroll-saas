<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Models\Subscription;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBillingOnboardingComplete
{
    /**
     * Handle an incoming request.
     *
     * When running in tenant context (subdomain routing), tenancy is already
     * initialized by InitializeTenancyByDomain before this middleware runs.
     * In that case we validate the resolved tenant directly instead of relying
     * on the session.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Tenant context: resolved by subdomain via InitializeTenancyByDomain.
        if (tenancy()->initialized) {
            /** @var Organization $tenant */
            $tenant = tenancy()->tenant;

            // Ensure this authenticated user actually belongs to the resolved tenant.
            if (! $user->organizations()->whereKey($tenant->id)->exists()) {
                $hasPaidOrganization = $user->organizations()
                    ->whereHas('subscriptions', function ($query): void {
                        $query->accessEligible();
                    })
                    ->exists();

                if ($hasPaidOrganization) {
                    return redirect()->route('onboarding.continue');
                }

                return redirect()
                    ->route('home')
                    ->with('status', 'You do not have access to that organization.');
            }

            if ($this->hasActiveSubscription($tenant->id)) {
                return $next($request);
            }

            return redirect()
                ->route('billing.plans')
                ->with('onboarding_notice', 'Complete payment to unlock dashboard access.');
        }

        // Central domain context: resolve org via session, then any active-subscription org.
        $sessionOrganizationId = (string) $request->session()->get('tenant_id', '');

        if ($sessionOrganizationId !== '') {
            $sessionOrganization = $user->organizations()->whereKey($sessionOrganizationId)->first();

            if ($sessionOrganization && $this->hasActiveSubscription($sessionOrganization->id)) {
                return $next($request);
            }
        }

        $activeOrganization = $user->organizations()
            ->whereHas('subscriptions', function ($query): void {
                $query->accessEligible();
            })
            ->first();

        if (! $activeOrganization) {
            return redirect()
                ->route('billing.plans')
                ->with('onboarding_notice', 'Complete payment to unlock dashboard access.');
        }

        $request->session()->put('tenant_id', $activeOrganization->id);

        return $next($request);
    }

    private function hasActiveSubscription(string $organizationId): bool
    {
        return Subscription::query()
            ->where('organization_id', $organizationId)
            ->accessEligible()
            ->exists();
    }
}
