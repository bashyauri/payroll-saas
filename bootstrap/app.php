<?php

use App\Http\Middleware\DynamicAppUrl;
use App\Http\Middleware\EnsureUserBelongsToTenantHost;
use App\Http\Middleware\ForceHttps;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectTenantAliasToCanonicalDomain;
use App\Http\Middleware\RequireOrganizationRole;
use App\Http\Middleware\TrustProxies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Stancl\Tenancy\Exceptions\TenantCouldNotBeIdentifiedOnDomainException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectUsersTo('/onboarding/continue');

        $middleware->alias([
            'organization.role' => RequireOrganizationRole::class,
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->validateCsrfTokens(except: [
            'billing/paystack/webhook',
        ]);

        $middleware->web(prepend: [
            TrustProxies::class,
            ForceHttps::class,
            DynamicAppUrl::class,
        ], append: [
            EnsureUserBelongsToTenantHost::class,
            RedirectTenantAliasToCanonicalDomain::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (TenantCouldNotBeIdentifiedOnDomainException $exception, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Tenant could not be identified on this domain.',
                ], 404);
            }

            $centralDomains = (array) config('tenancy.central_domains', []);
            $centralDomain = in_array('payroll-saas.test', $centralDomains, true)
                ? 'payroll-saas.test'
                : ($centralDomains[0] ?? null);

            if (! is_string($centralDomain) || trim($centralDomain) === '') {
                return response('Tenant could not be identified on this domain.', 404);
            }

            $scheme = app()->isProduction() ? 'https' : 'http';

            return redirect()->to("{$scheme}://{$centralDomain}/onboarding/continue")
                ->with('warning', 'We could not find that workspace URL. Please continue from your current workspace link.');
        });
    })->create();
