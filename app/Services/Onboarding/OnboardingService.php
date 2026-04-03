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
     * Create an organization and subscription after successful payment.
     *
     * @param  array  $paystackData  Full Paystack transaction data
     */
    public function setupOrganizationAfterPayment(User $user, array $paystackData): Organization
    {
        $metadata = Arr::get($paystackData, 'metadata', []);
        $planSlug = (string) Arr::get($metadata, 'plan_slug');
        $employeeCount = (int) Arr::get($metadata, 'employee_count', 1);
        $billingPeriod = (string) Arr::get($metadata, 'billing_period', 'annual');
        $reference = (string) Arr::get($paystackData, 'reference', '');
        $amount = (int) Arr::get($paystackData, 'amount');

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

        // Find the plan
        $plan = SubscriptionPlan::where('slug', $planSlug)->firstOrFail();

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
     * Ensure the organization has a domain record. Creates one if absent.
     */
    private function ensureDomainExists(Organization $organization): void
    {
        if ($organization->domains()->exists()) {
            return;
        }

        $organization->domains()->create([
            'id' => (string) Str::ulid(),
            'domain' => $organization->slug.'.'.config('tenancy.base_domain'),
        ]);
    }

    /**
     * Build the full dashboard URL for a tenant's subdomain.
     */
    public function tenantDashboardUrl(Organization $organization): string
    {
        // Backfill missing domains for older organizations before redirecting.
        $this->ensureDomainExists($organization);

        $domain = $organization->domains()->value('domain');
        $scheme = parse_url((string) config('app.url'), PHP_URL_SCHEME) ?: 'https';

        if ($domain) {
            return $scheme.'://'.$domain.'/dashboard';
        }

        return route('home');
    }
}
