<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class Subscription extends Model
{
    use CentralConnection, HasFactory, HasUlids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'organization_id',
        'plan_id',
        'status',
        'trial_end_date',
        'refund_eligible_until',
        'next_billing_date',
        'grace_period_ends_at',
        'canceled_at',
        'paystack_reference',
        'paystack_customer_code',
        'paystack_subscription_code',
        'amount_paid',
        'currency',
        'employee_count',
    ];

    protected $casts = [
        'trial_end_date' => 'datetime',
        'refund_eligible_until' => 'datetime',
        'next_billing_date' => 'date',
        'grace_period_ends_at' => 'datetime',
        'canceled_at' => 'datetime',
        'amount_paid' => 'decimal:2',
        'employee_count' => 'integer',
    ];

    public const STATUS_PENDING = 'pending';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_PAST_DUE = 'past_due';

    public const STATUS_FAILED = 'failed';

    public const STATUS_CANCELED = 'canceled';

    /**
     * @return array<int, string>
     */
    public static function accessEligibleStatuses(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_PAST_DUE,
        ];
    }

    public function scopeAccessEligible(Builder $query): Builder
    {
        return $query
            ->whereIn('status', self::accessEligibleStatuses())
            ->whereNotNull('paystack_reference');
    }

    public function isAccessEligible(): bool
    {
        return in_array($this->status, self::accessEligibleStatuses(), true)
            && $this->paystack_reference !== null;
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id');
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    public function billingEvents(): HasMany
    {
        return $this->hasMany(BillingEvent::class, 'subscription_id');
    }

    public function paymentAttempts(): HasMany
    {
        return $this->hasMany(PaymentAttempt::class, 'subscription_id');
    }
}
