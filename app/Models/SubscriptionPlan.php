<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class SubscriptionPlan extends Model
{
    use CentralConnection, HasFactory, HasUlids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'currency',
        'price_per_employee',
        'billing_period',
        'min_employees',
        'max_employees',
        'features',
        'paystack_plan_code',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'price_per_employee' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public const PLAN_INDIVIDUAL = 'individual';

    public const PLAN_ESSENTIAL = 'essential';

    public const PLAN_PROFESSIONAL = 'professional';

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereRaw('is_active IS TRUE');
    }
}
