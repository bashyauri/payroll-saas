<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\WorkspaceController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\EmployeeController;
use App\Http\Controllers\Tenant\PayrollFinalizationController;
use App\Http\Middleware\EnsureBillingOnboardingComplete;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| These routes are served on tenant subdomains (e.g. acme.payrollsaas.test).
| InitializeTenancyByDomain resolves the tenant from the domains table.
|
*/

Route::middleware([
    'web',
    PreventAccessFromCentralDomains::class,
    InitializeTenancyByDomain::class,
])->group(function () {
    Route::middleware(['auth', 'verified', EnsureBillingOnboardingComplete::class])->group(function () {
        Route::redirect('dashboardcheck', 'dashboard')->name('dashboard.check');
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        Route::get('employees', [EmployeeController::class, 'index'])->name('tenant.employees.index');
        Route::get('employees/create', [EmployeeController::class, 'create'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.employees.create');
        Route::post('employees', [EmployeeController::class, 'store'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.employees.store');

        Route::get('settings/workspace', [WorkspaceController::class, 'edit'])
            ->middleware('organization.role:owner,admin')
            ->name('workspace.edit');
        Route::patch('settings/workspace', [WorkspaceController::class, 'update'])
            ->middleware('organization.role:owner,admin')
            ->name('workspace.update');
    });

    Route::post('/payroll/finalize', PayrollFinalizationController::class)
        ->middleware(['auth', 'organization.role:owner,admin'])
        ->name('tenant.payroll.finalize');
});
