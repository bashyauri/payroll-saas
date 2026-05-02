<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\PayrollSetting;
use App\Models\Subscription;
use App\Services\Employee\EmployeeLimitService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, EmployeeLimitService $employeeLimitService): Response
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

        $employeeUsage = $employeeLimitService->usage($organization);

        $accessMode = $isReadOnly ? 'read_only' : 'full';
        $accessMessage = $isReadOnly
            ? 'Read-only mode is enabled. You can review records but write actions are blocked until billing is reactivated.'
            : ($isTrial
                ? 'Full feature access is active during your refund window.'
                : 'Full feature access is active.');

        $user = $request->user();
        $organizationRole = $user
            ? $user->organizations()
                ->whereKey($organization->id)
                ->value('organization_users.role')
            : null;

        $canManageOrganization = in_array((string) $organizationRole, [
            OrganizationUser::ROLE_OWNER,
            OrganizationUser::ROLE_ADMIN,
        ], true);

        $organizationOptions = $user
            ? $user->organizations()
                ->with('domains:id,tenant_id,domain')
                ->get(['tenants.id', 'tenants.name', 'tenants.slug', 'tenants.type', 'tenants.billing_status'])
                ->map(function (Organization $memberOrganization) use ($organization, $request): array {
                    $domain = $memberOrganization->domains->first()?->domain;
                    $switchUrl = $domain
                        ? $request->getScheme().'://'.$domain.'/dashboard'
                        : null;

                    return [
                        'id' => $memberOrganization->id,
                        'name' => $memberOrganization->name,
                        'type' => $memberOrganization->type,
                        'isCurrent' => $memberOrganization->id === $organization->id,
                        'domain' => $domain,
                        'billingStatus' => $memberOrganization->billing_status,
                        'switchUrl' => $switchUrl,
                    ];
                })
                ->values()
                ->all()
            : [];

        $payrollSettings = PayrollSetting::query()->where('profile', 'default')->first();

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
                'employees' => $employeeUsage['employeeCount'],
            ],
            'payrollInfo' => [
                'lastRunLabel' => 'Not available yet',
                'lastRunDate' => null,
                'runPayrollUrl' => '/payroll',
            ],
            'payrollSettingsSummary' => [
                'pensionEmployeeRate' => (float) ($payrollSettings?->pension_employee_rate ?? 8),
                'pensionEmployerRate' => (float) ($payrollSettings?->pension_employer_rate ?? 10),
                'nhfRate' => (float) ($payrollSettings?->nhf_rate ?? 2.5),
                'nhisEmployeeRate' => (float) ($payrollSettings?->nhis_employee_rate ?? 5),
                'nhisEmployerRate' => (float) ($payrollSettings?->nhis_employer_rate ?? 10),
                'customItemCount' => is_array($payrollSettings?->other_items) ? count($payrollSettings->other_items) : 0,
                'settingsUrl' => '/settings/payroll',
            ],
            'reportsLinks' => [
                'pension' => '/reports?type=pension',
                'paye' => '/reports?type=paye',
                'bank' => '/reports?type=bank',
                'nhf' => '/reports?type=nhf',
            ],
            'guards' => [
                'isReadOnly' => $isReadOnly,
                'isTrial' => $isTrial,
                'accessMode' => $accessMode,
                'accessMessage' => $accessMessage,
                'organizationRole' => $organizationRole,
                'canFinalizePayroll' => ! $isReadOnly && $canManageOrganization,
                'canAddEmployee' => ! $isReadOnly && $canManageOrganization,
                'canManageWorkspace' => $canManageOrganization,
                'employeeLimit' => $employeeUsage['employeeLimit'],
                'isNearEmployeeLimit' => $employeeUsage['isNearEmployeeLimit'],
                'isAtEmployeeLimit' => $employeeUsage['isAtEmployeeLimit'],
            ],
            'organizationOptions' => $organizationOptions,
        ]);
    }
}
