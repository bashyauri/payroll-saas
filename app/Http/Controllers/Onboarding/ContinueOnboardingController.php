<?php

namespace App\Http\Controllers\Onboarding;

use App\Exceptions\DomainConflictException;
use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Subscription;
use App\Services\Onboarding\OnboardingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ContinueOnboardingController extends Controller
{
    /**
     * Route verified users to the correct next step.
     */
    public function __invoke(Request $request, OnboardingService $onboarding): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $host = $request->getHost();
        $centralDomains = config('tenancy.central_domains', []);
        $hostOrganization = null;
        $userBelongsToHostOrganization = false;

        if ($host !== '' && ! in_array($host, $centralDomains, true)) {
            $hostOrganization = Organization::query()
                ->whereHas('domains', function ($query) use ($host): void {
                    $query->where('domain', $host);
                })
                ->first();

            if ($hostOrganization) {
                $userBelongsToHostOrganization = $user->organizations()->whereKey($hostOrganization->id)->exists();

                $hostOrganizationHasActiveSubscription = Subscription::query()
                    ->where('organization_id', $hostOrganization->id)
                    ->accessEligible()
                    ->exists();

                if ($userBelongsToHostOrganization && $hostOrganizationHasActiveSubscription) {
                    $request->session()->put('tenant_id', $hostOrganization->id);

                    return Inertia::location($request->getSchemeAndHttpHost().'/dashboard');
                }
            }
        }

        $sessionOrganizationId = (string) $request->session()->get('tenant_id', '');

        if ($sessionOrganizationId !== '') {
            $sessionOrganization = $user->organizations()->whereKey($sessionOrganizationId)->first();

            if ($sessionOrganization) {
                $hasActiveSessionSubscription = Subscription::query()
                    ->where('organization_id', $sessionOrganization->id)
                    ->accessEligible()
                    ->exists();

                if ($hasActiveSessionSubscription) {
                    try {
                        return Inertia::location($onboarding->tenantDashboardUrl($sessionOrganization));
                    } catch (DomainConflictException) {
                        return redirect()
                            ->route('home')
                            ->with('status', 'We could not resolve your workspace subdomain. Please contact support.');
                    }
                }
            }
        }

        $activeOrganization = $user->organizations()
            ->whereHas('subscriptions', function ($query): void {
                $query->accessEligible();
            })
            ->first();

        if (! $activeOrganization) {
            if ($hostOrganization && ! $userBelongsToHostOrganization) {
                return redirect()
                    ->route('home')
                    ->with('status', 'You do not have access to that organization.');
            }

            return redirect()
                ->route('billing.plans')
                ->with('onboarding_notice', 'Complete payment to unlock dashboard access.');
        }

        $request->session()->put('tenant_id', $activeOrganization->id);

        try {
            return Inertia::location($onboarding->tenantDashboardUrl($activeOrganization));
        } catch (DomainConflictException) {
            return redirect()
                ->route('home')
                ->with('status', 'We could not resolve your workspace subdomain. Please contact support.');
        }
    }
}
