<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ContinueOnboardingController extends Controller
{
    /**
     * Route verified users to the correct next step.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $organization = $user->organizations()->first();

        if (! $organization) {
            return redirect()->route('billing.plans');
        }

        $hasActiveSubscription = Subscription::query()
            ->where('organization_id', $organization->id)
            ->whereIn('status', [
                Subscription::STATUS_ACTIVE,
                Subscription::STATUS_PAST_DUE,
            ])
            ->exists();

        if (! $hasActiveSubscription) {
            return redirect()->route('billing.plans');
        }

        return redirect()->route('dashboard');
    }
}
