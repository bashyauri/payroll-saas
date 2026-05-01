<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Models\OrganizationUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $organizationRole = null;
        $resolvedOrganization = null;

        if ($user) {
            $resolvedOrganization = $this->resolveOrganizationForRequest($request);

            if ($resolvedOrganization) {
                $organizationRole = $user->organizations()
                    ->whereKey($resolvedOrganization->id)
                    ->value('organization_users.role');
            }
        }

        $isOwnerOrAdmin = in_array((string) $organizationRole, [
            OrganizationUser::ROLE_OWNER,
            OrganizationUser::ROLE_ADMIN,
        ], true);

        $isOwnerAdminOrHr = in_array((string) $organizationRole, [
            OrganizationUser::ROLE_OWNER,
            OrganizationUser::ROLE_ADMIN,
            OrganizationUser::ROLE_HR,
        ], true);

        $isReadOnly = $resolvedOrganization
            ? in_array((string) $resolvedOrganization->billing_status, [
                Organization::BILLING_CANCELED,
                Organization::BILLING_SUSPENDED,
            ], true)
            : false;

        $canViewDashboard = $user && $resolvedOrganization
            ? $user->organizations()->whereKey($resolvedOrganization->id)->exists()
            : false;

        $canAddEmployee = $resolvedOrganization
            ? $isOwnerAdminOrHr && ! $isReadOnly
            : ($user ? Gate::forUser($user)->allows('tenant.add-employee') : false);

        $canFinalizePayroll = $resolvedOrganization
            ? $isOwnerOrAdmin && ! $isReadOnly
            : ($user ? Gate::forUser($user)->allows('tenant.finalize-payroll') : false);

        $canManageWorkspace = $resolvedOrganization
            ? $isOwnerOrAdmin
            : ($user ? Gate::forUser($user)->allows('tenant.manage-workspace') : false);

        $canManagePayrollSettings = $resolvedOrganization
            ? $isOwnerOrAdmin
            : ($user ? Gate::forUser($user)->allows('tenant.manage-payroll-settings') : false);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'organizationRole' => $organizationRole,
                'can' => [
                    'viewDashboard' => $canViewDashboard,
                    'addEmployee' => $canAddEmployee,
                    'finalizePayroll' => $canFinalizePayroll,
                    'manageWorkspace' => $canManageWorkspace,
                    'managePayrollSettings' => $canManagePayrollSettings,
                ],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function resolveOrganizationForRequest(Request $request): ?Organization
    {
        if (tenancy()->initialized && tenant()) {
            /** @var Organization $organization */
            $organization = tenant();

            return $organization;
        }

        $host = (string) $request->getHost();

        if ($host === '') {
            return null;
        }

        $centralDomains = array_map('strtolower', (array) config('tenancy.central_domains', []));

        if (in_array(strtolower($host), $centralDomains, true)) {
            return null;
        }

        return Organization::query()
            ->whereHas('domains', function ($query) use ($host): void {
                $query->where('domain', $host);
            })
            ->first();
    }
}
