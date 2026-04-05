<?php

namespace App\Services\Billing;

use App\Models\Organization;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;

class ActiveSubscriptionContextResolver
{
    public function resolveSubscription(Request $request, User $user): ?Subscription
    {
        foreach ($this->candidateOrganizations($request, $user) as $organization) {
            $subscription = $organization->subscriptions()
                ->with('plan')
                ->accessEligible()
                ->latest('created_at')
                ->first();

            if ($subscription) {
                $request->session()->put('tenant_id', $organization->id);

                return $subscription;
            }
        }

        return null;
    }

    /**
     * @return array<int, Organization>
     */
    private function candidateOrganizations(Request $request, User $user): array
    {
        $organizations = [];

        $sessionOrganizationId = (string) $request->session()->get('tenant_id', '');

        if ($sessionOrganizationId !== '') {
            $sessionOrganization = $user->organizations()->whereKey($sessionOrganizationId)->first();

            if ($sessionOrganization) {
                $organizations[] = $sessionOrganization;
            }
        }

        $host = $request->getHost();
        $centralDomains = config('tenancy.central_domains', []);

        if ($host !== '' && ! in_array($host, $centralDomains, true)) {
            $hostOrganization = $user->organizations()
                ->whereHas('domains', function ($query) use ($host): void {
                    $query->where('domain', $host);
                })
                ->first();

            if ($hostOrganization) {
                $organizations[] = $hostOrganization;
            }
        }

        $activeOrganization = $user->organizations()
            ->whereHas('subscriptions', function ($query): void {
                $query->accessEligible();
            })
            ->first();

        if ($activeOrganization) {
            $organizations[] = $activeOrganization;
        }

        $uniqueOrganizations = [];
        $seen = [];

        foreach ($organizations as $organization) {
            if (isset($seen[$organization->id])) {
                continue;
            }

            $seen[$organization->id] = true;
            $uniqueOrganizations[] = $organization;
        }

        return $uniqueOrganizations;
    }
}
