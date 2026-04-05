<?php

namespace App\Services\Onboarding;

use App\Exceptions\DomainConflictException;
use App\Models\BillingEvent;
use App\Models\Organization;
use App\Models\PaymentAttempt;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;
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
        $reference = (string) Arr::get($paystackData, 'reference', '');

        if ($reference === '') {
            throw new InvalidArgumentException('Missing Paystack reference in verified payment payload.');
        }

        $alreadyProcessedOrganization = $this->resolveOrganizationByProcessedReference($user, $reference);

        if ($alreadyProcessedOrganization) {
            $this->ensureDomainExists($alreadyProcessedOrganization);
            session(['tenant_id' => $alreadyProcessedOrganization->id]);
            Tenancy::initialize($alreadyProcessedOrganization);

            return $alreadyProcessedOrganization;
        }

        $organizationId = (string) Arr::get($paystackData, 'metadata.organization_id', '');
        $subscriptionId = (string) Arr::get($paystackData, 'metadata.subscription_id', '');

        return DB::transaction(function () use ($user, $paystackData, $reference, $organizationId, $subscriptionId): Organization {
            User::query()->whereKey($user->id)->lockForUpdate()->first();

            $processedOrganization = $this->resolveOrganizationByProcessedReference($user, $reference);

            if ($processedOrganization) {
                $this->ensureDomainExists($processedOrganization);
                session(['tenant_id' => $processedOrganization->id]);
                Tenancy::initialize($processedOrganization);

                return $processedOrganization;
            }

            if ($organizationId !== '' && $subscriptionId !== '') {
                $organization = $this->upgradeSubscriptionAfterPayment($user, $paystackData);
            } else {
                $organization = $this->setupOrganizationAfterPayment($user, $paystackData);
            }

            $subscription = Subscription::query()
                ->where('organization_id', $organization->id)
                ->where('paystack_reference', $reference)
                ->latest()
                ->first();

            $this->recordProcessedPayment($organization, $subscription, $paystackData);

            return $organization;
        }, 3);
    }

    private function resolveOrganizationByProcessedReference(User $user, string $reference): ?Organization
    {
        $organization = $user->organizations()
            ->whereHas('subscriptions', function ($query) use ($reference): void {
                $query->where('paystack_reference', $reference);
            })
            ->first();

        if ($organization) {
            return $organization;
        }

        $processedOrganizationId = BillingEvent::query()
            ->where('provider', 'paystack')
            ->where('provider_event_id', $reference)
            ->value('organization_id');

        if (! $processedOrganizationId) {
            return null;
        }

        return $user->organizations()->whereKey($processedOrganizationId)->first();
    }

    private function recordProcessedPayment(Organization $organization, ?Subscription $subscription, array $paystackData): void
    {
        $reference = (string) Arr::get($paystackData, 'reference', '');

        if ($reference === '') {
            return;
        }

        PaymentAttempt::query()->updateOrCreate(
            [
                'organization_id' => $organization->id,
                'reference' => $reference,
            ],
            [
                'subscription_id' => $subscription?->id,
                'amount' => (int) Arr::get($paystackData, 'amount', 0),
                'status' => 'success',
                'attempted_at' => now(),
            ]
        );

        $billingEvent = BillingEvent::query()->firstOrCreate(
            [
                'provider' => 'paystack',
                'provider_event_id' => $reference,
            ],
            [
                'organization_id' => $organization->id,
                'subscription_id' => $subscription?->id,
                'event_type' => 'payment_verified',
                'reference' => $reference,
                'payload_json' => $paystackData,
                'processed_at' => now(),
            ]
        );

        if ((string) $billingEvent->organization_id !== (string) $organization->id) {
            throw new InvalidArgumentException('Payment reference is already linked to another organization.');
        }

        $billingEvent->forceFill([
            'subscription_id' => $subscription?->id,
            'event_type' => 'payment_verified',
            'reference' => $reference,
            'payload_json' => $paystackData,
            'processed_at' => now(),
        ])->save();
    }

    /**
     * Create an organization and subscription after successful payment.
     *
     * @param  array  $paystackData  Full Paystack transaction data
     */
    public function setupOrganizationAfterPayment(User $user, array $paystackData): Organization
    {
        [$plan, $employeeCount, $billingPeriod, $reference, $amount] = $this->resolvePlanCheckoutData($paystackData);
        $organizationId = (string) Arr::get($paystackData, 'metadata.organization_id', '');

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

        $ownedOrganizationWithDomain = $this->resolveOwnedOrganizationWithDomain($user, $organizationId);

        if ($ownedOrganizationWithDomain) {
            $alreadyPaid = $ownedOrganizationWithDomain
                ->subscriptions
                ->contains(fn (Subscription $subscription): bool => $subscription->isAccessEligible());

            if ($alreadyPaid) {
                $this->ensureDomainExists($ownedOrganizationWithDomain);
                session(['tenant_id' => $ownedOrganizationWithDomain->id]);
                Tenancy::initialize($ownedOrganizationWithDomain);

                return $ownedOrganizationWithDomain;
            }

            $organization = $this->applyOnboardingPaymentToExistingOrganization(
                $ownedOrganizationWithDomain,
                $plan,
                $employeeCount,
                $billingPeriod,
                $reference,
                $amount,
            );

            session(['tenant_id' => $organization->id]);
            Tenancy::initialize($organization);

            return $organization;
        }

        // Generate organization name from user name
        $organizationName = $user->name."'s Payroll";
        $organizationSlug = $this->generateUniqueOrganizationSlug($organizationName);

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

    private function resolveOwnedOrganizationWithDomain(User $user, string $organizationId = ''): ?Organization
    {
        $organizations = $user->organizations()
            ->wherePivot('role', 'owner')
            ->with(['domains', 'subscriptions' => function ($query): void {
                $query->latest();
            }])
            ->get();

        if ($organizationId !== '') {
            $requestedOrganization = $organizations->firstWhere('id', $organizationId);

            if ($requestedOrganization && $requestedOrganization->domains->isNotEmpty()) {
                return $requestedOrganization;
            }
        }

        return $organizations
            ->filter(function (Organization $organization): bool {
                return $organization->domains->isNotEmpty();
            })
            ->sortByDesc(fn (Organization $organization): string => (string) $organization->updated_at)
            ->first();
    }

    private function applyOnboardingPaymentToExistingOrganization(
        Organization $organization,
        SubscriptionPlan $plan,
        int $employeeCount,
        string $billingPeriod,
        string $reference,
        int $amount,
    ): Organization {
        $organization->forceFill([
            'billing_status' => Organization::BILLING_ACTIVE,
            'billing_status_updated_at' => now(),
            'read_only_mode' => false,
            'suspended_at' => null,
        ])->save();

        /** @var Subscription|null $subscription */
        $subscription = $organization->subscriptions()
            ->where(function ($query): void {
                $query->whereNull('paystack_reference')
                    ->orWhereIn('status', [
                        Subscription::STATUS_PENDING,
                        Subscription::STATUS_FAILED,
                        Subscription::STATUS_CANCELED,
                    ]);
            })
            ->latest()
            ->first();

        if ($subscription) {
            $subscription->forceFill([
                'plan_id' => $plan->id,
                'status' => Subscription::STATUS_ACTIVE,
                'trial_end_date' => now()->addDays(7),
                'refund_eligible_until' => now()->addDays(7),
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
        } else {
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
        }

        $this->ensureDomainExists($organization);

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
        $domainModelClass = (string) config('tenancy.domain_model');

        $existingDomain = $domainModelClass::query()
            ->where('domain', $expectedDomain)
            ->first();

        if ($existingDomain) {
            if ((string) $existingDomain->tenant_id !== (string) $organization->id) {
                throw new DomainConflictException($expectedDomain);
            }

            return;
        }

        try {
            $organization->domains()->create([
                'id' => (string) Str::ulid(),
                'domain' => $expectedDomain,
            ]);
        } catch (QueryException $exception) {
            if (! $this->isDuplicateDomainException($exception)) {
                throw $exception;
            }

            $conflictingDomain = $domainModelClass::query()
                ->where('domain', $expectedDomain)
                ->first();

            if (! $conflictingDomain || (string) $conflictingDomain->tenant_id !== (string) $organization->id) {
                throw new DomainConflictException($expectedDomain, previous: $exception);
            }
        }
    }

    /**
     * Build the full dashboard URL for a tenant's subdomain.
     */
    public function tenantDashboardUrl(Organization $organization): string
    {
        // Ensure the organization uses its canonical subdomain.
        $this->ensureDomainExists($organization);

        $expectedDomain = $organization->slug.'.'.config('tenancy.base_domain');
        $scheme = parse_url((string) config('app.url'), PHP_URL_SCHEME) ?: 'https';

        return $scheme.'://'.$expectedDomain.'/dashboard';
    }

    private function generateUniqueOrganizationSlug(string $organizationName): string
    {
        $baseSlug = Str::slug($organizationName);

        for ($attempt = 0; $attempt < 10; $attempt++) {
            $candidateSlug = $baseSlug.'-'.Str::lower(Str::random(6));

            if (Organization::query()->where('slug', $candidateSlug)->exists()) {
                continue;
            }

            if ($this->domainExists($candidateSlug.'.'.config('tenancy.base_domain'))) {
                continue;
            }

            return $candidateSlug;
        }

        throw new InvalidArgumentException('Unable to generate a unique organization subdomain. Please try again.');
    }

    private function domainExists(string $domain): bool
    {
        $domainModelClass = (string) config('tenancy.domain_model');

        return $domainModelClass::query()
            ->where('domain', $domain)
            ->exists();
    }

    private function isDuplicateDomainException(QueryException $exception): bool
    {
        return (string) $exception->getCode() === '23505'
            || (string) Arr::get($exception->errorInfo, 0) === '23505'
            || str_contains($exception->getMessage(), 'domains_domain_unique');
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

        if ($reference === '') {
            throw new InvalidArgumentException('Missing Paystack reference in verified payment payload.');
        }

        if ($amount <= 0) {
            throw new InvalidArgumentException('Invalid Paystack amount in verified payment payload.');
        }

        $plan = SubscriptionPlan::where('slug', $planSlug)->firstOrFail();
        $employeeCount = max($employeeCount, (int) $plan->min_employees);

        if ($plan->max_employees !== null) {
            $employeeCount = min($employeeCount, (int) $plan->max_employees);
        }

        return [$plan, $employeeCount, $billingPeriod, $reference, $amount];
    }
}
