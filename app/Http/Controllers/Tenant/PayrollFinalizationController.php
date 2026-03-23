<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Services\Payroll\PayrollFinalizationService;
use Illuminate\Http\JsonResponse;

class PayrollFinalizationController extends Controller
{
    public function __construct(private readonly PayrollFinalizationService $payrollFinalizationService)
    {
    }

    /**
     * Endpoint used by tenant payroll flows to validate billing before finalization.
     */
    public function __invoke(): JsonResponse
    {
        /** @var Organization|null $organization */
        $organization = tenant();

        if (! $organization) {
            return response()->json([
                'allowed' => false,
                'code' => 'tenant_not_initialized',
                'message' => 'No active tenant context.',
            ], 400);
        }

        $decision = $this->payrollFinalizationService->evaluateBillingForFinalization($organization);

        return response()->json([
            'allowed' => $decision->allowed,
            'code' => $decision->code,
            'message' => $decision->message,
            'billing_status' => $decision->billingStatus,
            'subscription_status' => $decision->subscriptionStatus,
        ], $decision->allowed ? 200 : 402);
    }
}
