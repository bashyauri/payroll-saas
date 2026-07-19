<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Services\Billing\RefundService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RefundController extends Controller
{
    public function __construct(
        private readonly RefundService $refundService,
    ) {}

    /**
     * Check if a subscription is eligible for refund.
     */
    public function checkEligibility(Subscription $subscription): JsonResponse
    {
        // Verify user belongs to the organization
        $user = Auth::user();
        if (! $user->organizations()->where('id', $subscription->organization_id)->exists()) {
            return response()->json([
                'eligible' => false,
                'code' => 'unauthorized',
                'message' => 'You do not have access to this subscription.',
            ], 403);
        }

        $eligible = $this->refundService->isRefundEligible($subscription);

        return response()->json([
            'eligible' => $eligible,
            'code' => $eligible ? 'eligible' : 'not_eligible',
            'message' => $eligible 
                ? 'Subscription is eligible for refund within the 7-day guarantee window.'
                : 'Subscription is not eligible for refund. The 7-day guarantee window has expired or the subscription is already canceled.',
            'refund_eligible_until' => $subscription->refund_eligible_until?->toIso8601String(),
            'trial_end_date' => $subscription->trial_end_date?->toIso8601String(),
        ]);
    }

    /**
     * Process a refund request.
     */
    public function process(Request $request, Subscription $subscription): JsonResponse
    {
        // Verify user belongs to the organization
        $user = Auth::user();
        if (! $user->organizations()->where('id', $subscription->organization_id)->exists()) {
            return response()->json([
                'success' => false,
                'code' => 'unauthorized',
                'message' => 'You do not have access to this subscription.',
            ], 403);
        }

        $reason = (string) $request->input('reason', '');

        $result = $this->refundService->processRefund($subscription, $reason);

        return response()->json([
            'success' => $result->success,
            'code' => $result->code,
            'message' => $result->message,
            'refund_reference' => $result->refundReference,
        ], $result->success ? 200 : 400);
    }
}
