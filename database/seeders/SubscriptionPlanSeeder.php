<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Seed launch plans for billing.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Essential',
                'slug' => SubscriptionPlan::PLAN_ESSENTIAL,
                'currency' => 'NGN',
                'price_per_employee' => 800,
                'billing_period' => 'annual',
                'min_employees' => 1,
                'max_employees' => 50,
                'features' => [
                    'employee_records',
                    'payroll_processing',
                    'nta_2025_compliance',
                    'statutory_deductions',
                    'auto_tax_table_updates',
                    'payslip_generation',
                    'standard_reports',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Professional',
                'slug' => SubscriptionPlan::PLAN_PROFESSIONAL,
                'currency' => 'NGN',
                'price_per_employee' => 850,
                'billing_period' => 'annual',
                'min_employees' => 51,
                'max_employees' => null,
                'features' => [
                    'employee_records',
                    'payroll_processing',
                    'nta_2025_compliance',
                    'statutory_deductions',
                    'auto_tax_table_updates',
                    'payslip_generation',
                    'standard_reports',
                    'advanced_analytics',
                    'custom_reports',
                    'api_access',
                    'priority_phone_support',
                    'dedicated_account_support',
                    'bulk_employee_upload',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::query()->updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
