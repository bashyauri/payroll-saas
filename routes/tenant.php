<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\PayrollSettingsController;
use App\Http\Controllers\Settings\WorkspaceController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\EmployeeController;
use App\Http\Controllers\Tenant\PayrollController;
use App\Http\Controllers\Tenant\PayrollFinalizationController;
use App\Http\Controllers\Tenant\ReportsController;
use App\Http\Middleware\EnsureBillingOnboardingComplete;
use App\Http\Middleware\EnforceReadOnlyMode;
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
    Route::middleware(['auth', 'verified', EnsureBillingOnboardingComplete::class, EnforceReadOnlyMode::class])->group(function () {
        Route::redirect('dashboardcheck', 'dashboard')->name('dashboard.check');
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        Route::get('employees', [EmployeeController::class, 'index'])
            ->middleware('organization.role:owner,admin,hr')
            ->name('tenant.employees.index');
        Route::get('employees/create', [EmployeeController::class, 'create'])
            ->middleware('organization.role:owner,admin,hr')
            ->name('tenant.employees.create');
        Route::post('employees', [EmployeeController::class, 'store'])
            ->middleware('organization.role:owner,admin,hr')
            ->name('tenant.employees.store');
        Route::get('employees/{employee}', [EmployeeController::class, 'show'])
            ->middleware('organization.role:owner,admin,hr')
            ->name('tenant.employees.show');
        Route::get('employees/{employee}/edit', [EmployeeController::class, 'edit'])
            ->middleware('organization.role:owner,admin,hr')
            ->name('tenant.employees.edit');
        Route::patch('employees/{employee}', [EmployeeController::class, 'update'])
            ->middleware('organization.role:owner,admin,hr')
            ->name('tenant.employees.update');

        Route::get('settings/workspace', [WorkspaceController::class, 'edit'])
            ->middleware('organization.role:owner,admin')
            ->name('workspace.edit');
        Route::patch('settings/workspace', [WorkspaceController::class, 'update'])
            ->middleware('organization.role:owner,admin')
            ->name('workspace.update');

        Route::get('settings/payroll', [PayrollSettingsController::class, 'edit'])
            ->middleware('organization.role:owner,admin')
            ->name('payroll.settings.edit');
        Route::patch('settings/payroll', [PayrollSettingsController::class, 'update'])
            ->middleware('organization.role:owner,admin')
            ->name('payroll.settings.update');

        Route::get('payroll', PayrollController::class)
            ->middleware('organization.role:owner,admin')
            ->name('tenant.payroll.index');
        Route::post('payroll/runs', [PayrollController::class, 'store'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.payroll.runs.store');
        Route::post('payroll/runs/{payrollRun}/finalize', [PayrollController::class, 'finalize'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.payroll.runs.finalize');

        Route::get('reports', ReportsController::class)
            ->middleware('organization.role:owner,admin')
            ->name('tenant.reports.index');
        Route::get('reports/view', [ReportsController::class, 'view'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.reports.view');
        Route::get('reports/export', [ReportsController::class, 'export'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.reports.export');
        Route::get('reports/export-pdf', [ReportsController::class, 'exportPdf'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.reports.export-pdf');
        Route::get('reports/export-excel', [ReportsController::class, 'exportExcel'])
            ->middleware('organization.role:owner,admin')
            ->name('tenant.reports.export-excel');
    });

    Route::post('/payroll/finalize', PayrollFinalizationController::class)
        ->middleware(['auth', 'organization.role:owner,admin'])
        ->name('tenant.payroll.finalize');
});
