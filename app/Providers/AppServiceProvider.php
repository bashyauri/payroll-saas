<?php

namespace App\Providers;

use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureUrl();
        $this->configureDefaults();
        $this->configureAuthorization();
    }

    /**
     * Force correct URL and asset paths for custom domain
     */
    protected function configureUrl(): void
    {
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(8)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Configure tenant-aware authorization gates shared across controllers and Inertia pages.
     */
    protected function configureAuthorization(): void
    {
        Gate::define('tenant.view-dashboard', fn (User $user): bool => $this->belongsToCurrentTenant($user));

        Gate::define('tenant.manage-workspace', fn (User $user): bool => $this->hasCurrentTenantRole($user, [
            OrganizationUser::ROLE_OWNER,
            OrganizationUser::ROLE_ADMIN,
        ]));

        Gate::define('tenant.add-employee', fn (User $user): bool => $this->hasCurrentTenantRole($user, [
            OrganizationUser::ROLE_OWNER,
            OrganizationUser::ROLE_ADMIN,
            OrganizationUser::ROLE_HR,
        ]) && ! $this->isCurrentTenantReadOnly());

        Gate::define('tenant.finalize-payroll', fn (User $user): bool => $this->hasCurrentTenantRole($user, [
            OrganizationUser::ROLE_OWNER,
            OrganizationUser::ROLE_ADMIN,
        ]) && ! $this->isCurrentTenantReadOnly());

        Gate::define('tenant.manage-payroll-settings', fn (User $user): bool => $this->hasCurrentTenantRole($user, [
            OrganizationUser::ROLE_OWNER,
            OrganizationUser::ROLE_ADMIN,
        ]));
    }

    private function belongsToCurrentTenant(User $user): bool
    {
        if (! tenancy()->initialized || ! tenant()) {
            return false;
        }

        return $user->organizations()->whereKey(tenant()->id)->exists();
    }

    /**
     * @param  array<int, string>  $roles
     */
    private function hasCurrentTenantRole(User $user, array $roles): bool
    {
        if (! tenancy()->initialized || ! tenant()) {
            return false;
        }

        return $user->organizations()
            ->whereKey(tenant()->id)
            ->wherePivotIn('role', $roles)
            ->exists();
    }

    private function isCurrentTenantReadOnly(): bool
    {
        if (! tenancy()->initialized || ! tenant()) {
            return false;
        }

        /** @var Organization $organization */
        $organization = tenant();

        return in_array($organization->billing_status, [
            Organization::BILLING_CANCELED,
            Organization::BILLING_SUSPENDED,
        ], true);
    }
}
