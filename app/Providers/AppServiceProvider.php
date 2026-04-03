<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
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
    }

    /**
     * Force correct URL and asset paths for custom domain
     */
    protected function configureUrl(): void
    {
        $appUrl = config('app.url');

        // Force root URL to your main custom domain
        if ($appUrl) {
            URL::forceRootUrl($appUrl);
        }

        // Force HTTPS in production
        if (app()->isProduction()) {
            URL::forceScheme('https');
        }

        // Optional: Override asset() helper to always use main domain
        if (app()->isProduction()) {
            URL::macro('asset', function ($path) {
                return rtrim(config('app.url'), '/') . '/' . ltrim($path, '/');
            });
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
}