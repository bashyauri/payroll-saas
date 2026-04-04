<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var Organization $organization */
        $organization = tenancy()->tenant;

        $subscription = $organization->subscriptions()
            ->with('plan')
            ->whereIn('status', [
                Subscription::STATUS_ACTIVE,
                Subscription::STATUS_PAST_DUE,
                Subscription::STATUS_PENDING,
                Subscription::STATUS_FAILED,
                Subscription::STATUS_CANCELED,
            ])
            ->latest('created_at')
            ->first();

        $trialEndsAt = $subscription?->trial_end_date;
        $daysRemaining = $trialEndsAt
            ? max(0, now()->startOfDay()->diffInDays($trialEndsAt->startOfDay(), false))
            : null;

        $isReadOnly = in_array($organization->billing_status, [
            Organization::BILLING_CANCELED,
            Organization::BILLING_SUSPENDED,
        ], true);

        $isTrial = $daysRemaining !== null && $daysRemaining > 0;

        $accessMode = $isReadOnly ? 'read_only' : 'full';
        $accessMessage = $isReadOnly
            ? 'Read-only mode is enabled. You can review records but write actions are blocked until billing is reactivated.'
            : ($isTrial
                ? 'Full feature access is active during your refund window.'
                : 'Full feature access is active.');

        $user = $request->user();
        $organizationOptions = $user
            ? $user->organizations()
                ->with('domains:id,tenant_id,domain')
                ->get(['tenants.id', 'tenants.name', 'tenants.slug', 'tenants.type'])
                ->map(function (Organization $memberOrganization) use ($organization): array {
                    return [
                        'id' => $memberOrganization->id,
                        'name' => $memberOrganization->name,
                        'type' => $memberOrganization->type,
                        'isCurrent' => $memberOrganization->id === $organization->id,
                        'domain' => $memberOrganization->domains->first()?->domain,
                    ];
                })
                ->values()
                ->all()
            : [];

        return Inertia::render('dashboard', [
            'organization' => [
                'name' => $organization->name,
                'type' => $organization->type,
                'slug' => $organization->slug,
                'billingStatus' => $organization->billing_status,
                'domain' => $organization->domains()->value('domain'),
            ],
            'trial' => [
                'endsAt' => $trialEndsAt?->toDateString(),
                'daysRemaining' => $daysRemaining,
                'countdownLabel' => $daysRemaining === null
                    ? null
                    : $daysRemaining.' day'.($daysRemaining === 1 ? '' : 's').' remaining - full refund if you cancel',
            ],
            'plan' => [
                'name' => $subscription?->plan?->name,
                'billingPeriod' => $subscription?->plan?->billing_period,
                'pricePerEmployee' => $subscription?->plan?->price_per_employee,
                'currency' => $subscription?->plan?->currency,
                'subscriptionStatus' => $subscription?->status,
                'paidEmployeeCount' => $subscription?->employee_count,
                'minEmployees' => $subscription?->plan?->min_employees,
                'maxEmployees' => $subscription?->plan?->max_employees,
            ],
            'quickStats' => [
                'employees' => 0,
            ],
            'guards' => [
                'isReadOnly' => $isReadOnly,
                'isTrial' => $isTrial,
                'accessMode' => $accessMode,
                'accessMessage' => $accessMessage,
                'canFinalizePayroll' => ! $isReadOnly,
                'canAddEmployee' => ! $isReadOnly,
            ],
            'organizationOptions' => $organizationOptions,
        ]);
    }
}
