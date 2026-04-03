<?php

namespace App\Console\Commands;

use App\Models\Organization;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Models\Domain;

class TenancyHealthCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenancy:health-check {--domain= : Verify a specific tenant domain exists in central domains table}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Validate tenancy configuration, session domain setup, and tenant domain integrity';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $errors = [];
        $warnings = [];

        $this->info('Running tenancy health checks...');

        $centralDomains = collect((array) config('tenancy.central_domains'))
            ->map(static fn (mixed $domain): string => Str::lower(trim((string) $domain)))
            ->filter()
            ->values();

        $baseDomain = Str::lower(trim((string) config('tenancy.base_domain')));
        $sessionDomain = Str::lower(ltrim(trim((string) config('session.domain')), '.'));
        $appUrl = (string) config('app.url');
        $appHost = Str::lower((string) parse_url($appUrl, PHP_URL_HOST));

        if ($centralDomains->isEmpty()) {
            $errors[] = 'tenancy.central_domains is empty.';
        } else {
            $this->line('Central domains: '.$centralDomains->implode(', '));
        }

        if ($baseDomain === '') {
            $errors[] = 'tenancy.base_domain is empty.';
        } else {
            $this->line('Base domain: '.$baseDomain);
        }

        if ($sessionDomain === '') {
            $warnings[] = 'session.domain is empty. Cross-subdomain auth may fail.';
        } elseif ($baseDomain !== '' && ! Str::endsWith($sessionDomain, $baseDomain)) {
            $errors[] = "session.domain ({$sessionDomain}) does not match tenancy.base_domain ({$baseDomain}).";
        } else {
            $this->line('Session domain: '.$sessionDomain);
        }

        if ($appHost === '') {
            $warnings[] = 'app.url host could not be parsed.';
        } elseif (! $centralDomains->contains($appHost)) {
            $warnings[] = "app.url host ({$appHost}) is not listed in tenancy.central_domains.";
        } else {
            $this->line('App URL host: '.$appHost);
        }

        $this->checkTenantDomainRecords($baseDomain, $errors, $warnings);

        $requestedDomain = Str::lower(trim((string) $this->option('domain')));
        if ($requestedDomain !== '') {
            $this->checkSpecificDomain($requestedDomain, $errors);
        }

        foreach ($warnings as $warning) {
            $this->warn('WARN: '.$warning);
        }

        foreach ($errors as $error) {
            $this->error('FAIL: '.$error);
        }

        if ($errors !== []) {
            $this->newLine();
            $this->error('Tenancy health check failed.');

            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Tenancy health check passed.');

        return self::SUCCESS;
    }

    /**
     * @param  array<int, string>  $errors
     * @param  array<int, string>  $warnings
     */
    protected function checkTenantDomainRecords(string $baseDomain, array &$errors, array &$warnings): void
    {
        $tenantCount = Organization::query()->count();
        $domainCount = Domain::query()->count();

        $this->line("Tenants in central DB: {$tenantCount}");
        $this->line("Tenant domains in central DB: {$domainCount}");

        if ($tenantCount > 0 && $domainCount === 0) {
            $errors[] = 'No rows found in domains table while tenants exist.';
        }

        $tenantIdsWithDomains = Domain::query()
            ->select('tenant_id')
            ->distinct()
            ->pluck('tenant_id');

        $tenantsWithoutDomains = Organization::query()
            ->whereNotIn('id', $tenantIdsWithDomains)
            ->pluck('slug')
            ->all();

        if ($tenantsWithoutDomains !== []) {
            $warnings[] = 'Tenants missing domain rows: '.implode(', ', $tenantsWithoutDomains);
        }

        if ($baseDomain !== '') {
            $mismatchedDomains = Domain::query()
                ->where('domain', 'not like', '%.'.$baseDomain)
                ->pluck('domain')
                ->all();

            if ($mismatchedDomains !== []) {
                $warnings[] = 'Domains not ending with base domain: '.implode(', ', $mismatchedDomains);
            }
        }
    }

    /**
     * @param  array<int, string>  $errors
     */
    protected function checkSpecificDomain(string $domain, array &$errors): void
    {
        $exists = Domain::query()->where('domain', $domain)->exists();

        if (! $exists) {
            $errors[] = "Requested domain not found in central domains table: {$domain}";

            return;
        }

        $this->line("Requested domain exists: {$domain}");
    }
}
