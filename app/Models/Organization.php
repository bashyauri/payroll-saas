<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\CentralConnection;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Organization extends BaseTenant implements TenantWithDatabase
{
    use CentralConnection, HasDatabase, HasDomains, HasUlids;

    protected $fillable = [
        'name',
        'slug',
        'billing_status',
        'billing_status_updated_at',
        'read_only_mode',
        'suspended_at',
        'type',
    ];

    protected $casts = [
        'billing_status_updated_at' => 'datetime',
        'suspended_at' => 'datetime',
        'read_only_mode' => 'boolean',
    ];

    public const BILLING_ACTIVE = 'active';

    public const BILLING_GRACE = 'grace';

    public const BILLING_SUSPENDED = 'suspended';

    public const BILLING_CANCELED = 'canceled';

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'organization_id');
    }

    public function billingEvents(): HasMany
    {
        return $this->hasMany(BillingEvent::class, 'organization_id');
    }

    public function paymentAttempts(): HasMany
    {
        return $this->hasMany(PaymentAttempt::class, 'organization_id');
    }

    /**
     * Get the users that belong to this organization.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'organization_users',
            'organization_id',
            'user_id'
        )->withPivot('role')->withTimestamps();
    }
}
