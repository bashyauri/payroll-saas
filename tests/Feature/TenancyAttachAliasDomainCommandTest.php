<?php

use App\Models\Organization;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Models\Domain;

test('tenancy attach alias domain command attaches alias to tenant by slug', function () {
    $organization = Organization::create([
        'name' => 'Alias Attach Org',
        'slug' => 'alias-attach-org',
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $exitCode = Artisan::call('tenancy:attach-alias-domain', [
        'slug' => 'alias-attach-org',
        'domain' => 'alias-old.theniyiconsult.com.ng',
    ]);

    expect($exitCode)->toBe(0);

    expect(Domain::query()->where('domain', 'alias-old.theniyiconsult.com.ng')->value('tenant_id'))
        ->toBe((string) $organization->id);
});

test('tenancy attach alias domain command fails when domain belongs to another tenant', function () {
    $first = Organization::create([
        'name' => 'First Org',
        'slug' => 'first-org-'.Str::lower(Str::random(6)),
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    $second = Organization::create([
        'name' => 'Second Org',
        'slug' => 'second-org-'.Str::lower(Str::random(6)),
        'type' => 'organization',
        'billing_status' => Organization::BILLING_ACTIVE,
    ]);

    Domain::query()->create([
        'id' => (string) Str::ulid(),
        'tenant_id' => (string) $first->id,
        'domain' => 'conflict-tenant.theniyiconsult.com.ng',
    ]);

    $exitCode = Artisan::call('tenancy:attach-alias-domain', [
        'slug' => $second->slug,
        'domain' => 'conflict-tenant.theniyiconsult.com.ng',
    ]);

    expect($exitCode)->toBe(1);

    expect(Domain::query()->where('domain', 'conflict-tenant.theniyiconsult.com.ng')->value('tenant_id'))
        ->toBe((string) $first->id);
});
