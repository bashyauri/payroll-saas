<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Seed launch plans for billing.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Individual',
                'slug' => SubscriptionPlan::PLAN_INDIVIDUAL,
                'currency' => 'NGN',
                'price_per_employee' => 500,
                'billing_period' => 'annual',
                'min_employees' => 1,
                'max_employees' => 5,
                'features' => [
                    'employee_records',
                    'payroll_processing',
                    'payslip_generation',
                    'basic_payroll_reports',
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Essential',
                'slug' => SubscriptionPlan::PLAN_ESSENTIAL,
                'currency' => 'NGN',
                'price_per_employee' => 800,
                'billing_period' => 'annual',
                'min_employees' => 6,
                'max_employees' => 50,
                'features' => [
                    'employee_records',
                    'payroll_processing',
                    'statutory_deductions',
                    'auto_tax_table_updates',
                    'payslip_generation',
                    'standard_reports',
                    'leave_management',
                    'email_support',
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
                    'statutory_deductions',
                    'auto_tax_table_updates',
                    'payslip_generation',
                    'standard_reports',
                    'leave_management',
                    'advanced_analytics',
                    'custom_reports',
                    'bulk_employee_upload',
                    'api_access',
                    'priority_phone_support',
                    'dedicated_account_manager',
                ],
                'is_active' => true,
            ],
        ];

        foreach ($plans as $planData) {
            $isActive = (bool) ($planData['is_active'] ?? true);
            unset($planData['is_active']);

            $plan = SubscriptionPlan::query()->updateOrCreate(
                ['slug' => $planData['slug']],
                $planData
            );

            // Set boolean separately to avoid PDO integer-vs-boolean type mismatch on Postgres
            DB::statement('UPDATE subscription_plans SET is_active = TRUE WHERE id = ?', [$plan->id]);
        }
    }
}
