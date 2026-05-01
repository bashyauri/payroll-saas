<?php

namespace App\Http\Middleware;

use App\Models\Organization;
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

        if ($user && tenancy()->initialized && tenant()) {
            /** @var Organization $organization */
            $organization = tenant();

            $organizationRole = $user->organizations()
                ->whereKey($organization->id)
                ->value('organization_users.role');
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'organizationRole' => $organizationRole,
                'can' => [
                    'viewDashboard' => $user ? Gate::forUser($user)->allows('tenant.view-dashboard') : false,
                    'addEmployee' => $user ? Gate::forUser($user)->allows('tenant.add-employee') : false,
                    'finalizePayroll' => $user ? Gate::forUser($user)->allows('tenant.finalize-payroll') : false,
                    'manageWorkspace' => $user ? Gate::forUser($user)->allows('tenant.manage-workspace') : false,
                ],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
