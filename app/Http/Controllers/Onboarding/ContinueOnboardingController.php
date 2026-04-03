<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
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

        $activeStatuses = [
            Subscription::STATUS_ACTIVE,
            Subscription::STATUS_PAST_DUE,
        ];

        $sessionOrganizationId = (string) $request->session()->get('tenant_id', '');

        if ($sessionOrganizationId !== '') {
            $sessionOrganization = $user->organizations()->whereKey($sessionOrganizationId)->first();

            if ($sessionOrganization) {
                $hasActiveSessionSubscription = Subscription::query()
                    ->where('organization_id', $sessionOrganization->id)
                    ->whereIn('status', $activeStatuses)
                    ->exists();

                if ($hasActiveSessionSubscription) {
                    return Inertia::location($onboarding->tenantDashboardUrl($sessionOrganization));
                }
            }
        }

        $activeOrganization = $user->organizations()
            ->whereHas('subscriptions', function ($query) use ($activeStatuses): void {
                $query->whereIn('status', $activeStatuses);
            })
            ->first();

        if (! $activeOrganization) {
            return redirect()->route('billing.plans');
        }

        $request->session()->put('tenant_id', $activeOrganization->id);

        return Inertia::location($onboarding->tenantDashboardUrl($activeOrganization));
    }
}
