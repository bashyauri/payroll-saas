<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSubdomainRequest;
use App\Models\Organization;
use App\Models\Subscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceController extends Controller
{
    public function edit(Request $request): Response
    {
        $organization = $this->resolveOrganization($request);

        return Inertia::render('settings/workspace', [
            'subdomain' => $organization?->slug,
            'organizationName' => $organization?->name,
            'baseDomain' => config('tenancy.base_domain'),
            'status' => session('status'),
        ]);
    }

    public function update(UpdateSubdomainRequest $request): RedirectResponse
    {
        $organization = $this->resolveOrganization($request);

        if (! $organization) {
            return redirect()->route('billing.plans');
        }

        $newSlug = (string) $request->validated('subdomain');
        $baseDomain = (string) config('tenancy.base_domain');
        $newDomain = $newSlug.'.'.$baseDomain;
        $domainModelClass = (string) config('tenancy.domain_model');

        $domainOwnedByAnotherOrganization = $domainModelClass::query()
            ->where('domain', $newDomain)
            ->where('tenant_id', '!=', $organization->id)
            ->exists();

        if ($domainOwnedByAnotherOrganization) {
            return back()->withErrors([
                'subdomain' => 'This subdomain is already taken. Please choose a different one.',
            ]);
        }

        $organization->update(['slug' => $newSlug]);

        $existingDomain = $organization->domains()->first();

        if ($existingDomain) {
            $existingDomain->update(['domain' => $newDomain]);
        } else {
            $organization->domains()->create([
                'id' => (string) Str::ulid(),
                'domain' => $newDomain,
            ]);
        }

        $scheme = app()->environment('local') ? 'http' : 'https';

        session()->flash('status', 'workspace-subdomain-updated');

        return redirect()->away($scheme.'://'.$newDomain.'/settings/workspace');
    }

    private function resolveOrganization(Request $request): ?Organization
    {
        $user = $request->user();

        if (! $user) {
            return null;
        }

        if (tenancy()->initialized) {
            /** @var Organization $tenant */
            $tenant = tenancy()->tenant;

            return $user->organizations()->whereKey($tenant->id)->first();
        }

        $sessionOrgId = (string) $request->session()->get('tenant_id', '');

        if ($sessionOrgId !== '') {
            $org = $user->organizations()->whereKey($sessionOrgId)->first();

            if ($org) {
                return $org;
            }
        }

        return $user->organizations()
            ->whereHas('subscriptions', function ($query): void {
                $query->whereIn('status', [
                    Subscription::STATUS_ACTIVE,
                    Subscription::STATUS_PAST_DUE,
                ]);
            })
            ->first();
    }
}
