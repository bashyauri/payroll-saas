<?php

namespace App\Services\Employee;

use App\Models\Employee;
use App\Models\Organization;
use App\Models\Subscription;
use Illuminate\Support\Facades\Schema;

class EmployeeLimitService
{
    /**
     * @return array{employeeCount:int, employeeLimit:int|null, isNearEmployeeLimit:bool, isAtEmployeeLimit:bool, remainingSlots:int|null}
     */
    public function usage(Organization $organization): array
    {
        $employeeCount = Schema::hasTable('employees')
            ? Employee::query()->count()
            : 0;

        $employeeLimit = $this->employeeLimitForOrganization($organization);
        $isAtEmployeeLimit = $employeeLimit !== null && $employeeCount >= $employeeLimit;
        $nearLimitThreshold = $employeeLimit !== null
            ? max(1, (int) ceil($employeeLimit * 0.8))
            : null;
        $isNearEmployeeLimit = $employeeLimit !== null
            && ! $isAtEmployeeLimit
            && $employeeCount >= $nearLimitThreshold;

        return [
            'employeeCount' => $employeeCount,
            'employeeLimit' => $employeeLimit,
            'isNearEmployeeLimit' => $isNearEmployeeLimit,
            'isAtEmployeeLimit' => $isAtEmployeeLimit,
            'remainingSlots' => $employeeLimit === null
                ? null
                : max(0, $employeeLimit - $employeeCount),
        ];
    }

    public function employeeLimitForOrganization(Organization $organization): ?int
    {
        $subscription = $organization->subscriptions()
            ->with('plan')
            ->whereIn('status', [
                Subscription::STATUS_ACTIVE,
                Subscription::STATUS_PAST_DUE,
                Subscription::STATUS_PENDING,
                Subscription::STATUS_FAILED,
                Subscription::STATUS_CANCELED,
            ])
            ->latest('created_at')
            ->first();

        return $subscription?->employee_count
            ?? $subscription?->plan?->max_employees;
    }
}
