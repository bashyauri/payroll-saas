<?php

namespace App\Console\Commands;

use App\Models\Organization;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Models\Domain;

class AttachTenantAliasDomain extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenancy:attach-alias-domain
        {slug : Organization slug that should own the alias domain}
        {domain : Full alias domain to attach (e.g. old-slug.example.com)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Attach an alias domain to an existing tenant organization';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $slug = trim((string) $this->argument('slug'));
        $domain = Str::lower(trim((string) $this->argument('domain')));

        if ($slug === '' || $domain === '') {
            $this->error('Both slug and domain are required.');

            return self::FAILURE;
        }

        $organization = Organization::query()
            ->get()
            ->first(function (Organization $organization) use ($slug): bool {
                return (string) $organization->slug === $slug;
            });

        if (! $organization) {
            $this->error("Organization not found for slug: {$slug}");

            return self::FAILURE;
        }

        $existingDomain = Domain::query()->whereRaw('LOWER(domain) = ?', [$domain])->first();

        if ($existingDomain && (string) $existingDomain->tenant_id !== (string) $organization->id) {
            $this->error("Domain {$domain} is already attached to another organization.");

            return self::FAILURE;
        }

        if ($existingDomain && (string) $existingDomain->tenant_id === (string) $organization->id) {
            $this->info("Domain {$domain} is already attached to organization {$slug}.");

            return self::SUCCESS;
        }

        Domain::query()->create([
            'id' => (string) Str::ulid(),
            'domain' => $domain,
            'tenant_id' => (string) $organization->id,
        ]);

        $this->info("Attached alias domain {$domain} to organization {$slug}.");

        return self::SUCCESS;
    }
}
