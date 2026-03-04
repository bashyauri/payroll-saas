<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_period',
        'max_employees',
        'features',
        'stripe_product_id',
        'stripe_price_id',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public const PLAN_STARTER = 'starter';
    public const PLAN_PROFESSIONAL = 'professional';
    public const PLAN_ENTERPRISE = 'enterprise';

    public static function getPlans(): array
    {
        return [
            self::PLAN_STARTER => [
                'name' => 'Starter',
                'price' => 29,
                'max_employees' => 10,
                'features' => ['Basic payroll', 'Up to 10 employees'],
            ],
            self::PLAN_PROFESSIONAL => [
                'name' => 'Professional',
                'price' => 79,
                'max_employees' => 100,
                'features' => ['Advanced payroll', 'Up to 100 employees', 'Reports & Analytics'],
            ],
            self::PLAN_ENTERPRISE => [
                'name' => 'Enterprise',
                'price' => 299,
                'max_employees' => null,
                'features' => ['Full features', 'Unlimited employees', 'Priority support'],
            ],
        ];
    }
}
