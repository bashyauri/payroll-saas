<?php

namespace App\Services\Onboarding;

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Stancl\Tenancy\Facades\Tenancy;

/**
 * Handles organization creation and subscription setup for new users during onboarding.
 */
class OnboardingService
{
    /**
     * Apply a successful Paystack payment to either onboarding or subscription upgrade.
     */
    public function completePayment(User $user, array $paystackData): Organization
    {
        $organizationId = (string) Arr::get($paystackData, 'metadata.organization_id', '');
        $subscriptionId = (string) Arr::get($paystackData, 'metadata.subscription_id', '');

        if ($organizationId !== '' && $subscriptionId !== '') {
            return $this->upgradeSubscriptionAfterPayment($user, $paystackData);
        }

        return $this->setupOrganizationAfterPayment($user, $paystackData);
    }

    /**
     * Create an organization and subscription after successful payment.
     *
     * @param  array  $paystackData  Full Paystack transaction data
     */
    public function setupOrganizationAfterPayment(User $user, array $paystackData): Organization
    {
        [$plan, $employeeCount, $billingPeriod, $reference, $amount] = $this->resolvePlanCheckoutData($paystackData);

        $existingOrganization = $user->organizations()
            ->whereHas('subscriptions', function ($query) use ($reference): void {
                $query->where('paystack_reference', $reference);
            })
            ->first();

        if ($existingOrganization) {
            $this->ensureDomainExists($existingOrganization);
            session(['tenant_id' => $existingOrganization->id]);
            Tenancy::initialize($existingOrganization);

            return $existingOrganization;
        }

        // Generate organization name from user name
        $organizationName = $user->name."'s Payroll";
        $organizationSlug = Str::slug($organizationName).'-'.Str::random(6);

        // Create organization (tenant)
        $organization = Organization::create([
            'name' => $organizationName,
            'slug' => $organizationSlug,
            'type' => 'organization',
            'billing_status' => Organization::BILLING_ACTIVE,
        ]);

        // Create subscription
        Subscription::create([
            'organization_id' => $organization->id,
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'trial_end_date' => now()->addDays(7),
            'refund_eligible_until' => now()->addDays(7),
            'next_billing_date' => $billingPeriod === 'monthly'
                ? now()->addMonth()
                : now()->addYear(),
            'paystack_reference' => $reference,
            'amount_paid' => $amount,
            'currency' => 'NGN',
            'employee_count' => $employeeCount,
        ]);

        // Attach user to organization as owner
        $organization->users()->syncWithoutDetaching([
            $user->id => ['role' => 'owner'],
        ]);

        // Attach subdomain
        $this->ensureDomainExists($organization);

        // Set current tenant in session so the user is immediately in tenant context
        session(['tenant_id' => $organization->id]);
        Tenancy::initialize($organization);

        return $organization;
    }

    /**
     * Update an existing subscription after successful payment.
     */
    public function upgradeSubscriptionAfterPayment(User $user, array $paystackData): Organization
    {
        $organizationId = (string) Arr::get($paystackData, 'metadata.organization_id', '');
        $subscriptionId = (string) Arr::get($paystackData, 'metadata.subscription_id', '');
        [$plan, $employeeCount, $billingPeriod, $reference, $amount] = $this->resolvePlanCheckoutData($paystackData);

        $organization = $user->organizations()->whereKey($organizationId)->firstOrFail();
        $subscription = $organization->subscriptions()->whereKey($subscriptionId)->firstOrFail();

        if ($subscription->paystack_reference === $reference) {
            $this->ensureDomainExists($organization);
            session(['tenant_id' => $organization->id]);
            Tenancy::initialize($organization);

            return $organization;
        }

        $organization->forceFill([
            'billing_status' => Organization::BILLING_ACTIVE,
            'billing_status_updated_at' => now(),
            'read_only_mode' => false,
            'suspended_at' => null,
        ])->save();

        $subscription->forceFill([
            'plan_id' => $plan->id,
            'status' => Subscription::STATUS_ACTIVE,
            'next_billing_date' => $billingPeriod === 'monthly'
                ? now()->addMonth()
                : now()->addYear(),
            'grace_period_ends_at' => null,
            'canceled_at' => null,
            'paystack_reference' => $reference,
            'amount_paid' => $amount,
            'currency' => 'NGN',
            'employee_count' => $employeeCount,
        ])->save();

        $this->ensureDomainExists($organization);

        session(['tenant_id' => $organization->id]);
        Tenancy::initialize($organization);

        return $organization;
    }

    /**
     * Ensure the organization has a domain record. Creates one if absent.
     */
    private function ensureDomainExists(Organization $organization): void
    {
        $expectedDomain = $organization->slug.'.'.config('tenancy.base_domain');

        $organization->domains()->createOrFirst(
            ['domain' => $expectedDomain],
            ['id' => (string) Str::ulid()]
        );
    }

    /**
     * Build the full dashboard URL for a tenant's subdomain.
     */
    public function tenantDashboardUrl(Organization $organization): string
    {
        // Backfill missing domains for older organizations before redirecting.
        $this->ensureDomainExists($organization);

        $expectedDomain = $organization->slug.'.'.config('tenancy.base_domain');
        $domain = $organization->domains()
            ->where('domain', $expectedDomain)
            ->value('domain')
            ?? $organization->domains()->value('domain');
        $scheme = parse_url((string) config('app.url'), PHP_URL_SCHEME) ?: 'https';

        if ($domain) {
            return $scheme.'://'.$domain.'/dashboard';
        }

        return route('home');
    }

    /**
     * @return array{0: SubscriptionPlan, 1: int, 2: string, 3: string, 4: int}
     */
    private function resolvePlanCheckoutData(array $paystackData): array
    {
        $metadata = Arr::get($paystackData, 'metadata', []);
        $planSlug = (string) Arr::get($metadata, 'plan_slug');
        $employeeCount = (int) Arr::get($metadata, 'employee_count', 1);
        $billingPeriod = (string) Arr::get($metadata, 'billing_period', 'annual');
        $reference = (string) Arr::get($paystackData, 'reference', '');
        $amount = (int) Arr::get($paystackData, 'amount');

        $plan = SubscriptionPlan::where('slug', $planSlug)->firstOrFail();
        $employeeCount = max($employeeCount, (int) $plan->min_employees);

        if ($plan->max_employees !== null) {
            $employeeCount = min($employeeCount, (int) $plan->max_employees);
        }

        return [$plan, $employeeCount, $billingPeriod, $reference, $amount];
    }
}
