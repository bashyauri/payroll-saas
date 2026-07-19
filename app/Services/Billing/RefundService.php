<?php

namespace App\Services\Billing;

use App\Models\Organization;
use App\Models\Subscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RefundService
{
    private const PAYSTACK_REFUND_URL = 'https://api.paystack.co/refund';

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret_key', '');
    }

    /**
     * Check if a subscription is eligible for refund.
     */
    public function isRefundEligible(Subscription $subscription): bool
    {
        // Must have a refund_eligible_until date
        if ($subscription->refund_eligible_until === null) {
            return false;
        }

        // Must be within the refund window
        if (now()->greaterThan($subscription->refund_eligible_until)) {
            return false;
        }

        // Must not already be canceled
        if ($subscription->status === Subscription::STATUS_CANCELED) {
            return false;
        }

        // Must have a valid Paystack reference
        if ($subscription->paystack_reference === null) {
            return false;
        }

        return true;
    }

    /**
     * Process a refund request with idempotency check.
     */
    public function processRefund(Subscription $subscription, string $reason = ''): RefundResult
    {
        // Check eligibility
        if (! $this->isRefundEligible($subscription)) {
            return new RefundResult(
                false,
                'not_eligible',
                'Subscription is not eligible for refund. Check refund window and subscription status.',
                null
            );
        }

        // Check for existing refund (idempotency)
        if ($this->hasExistingRefund($subscription)) {
            return new RefundResult(
                false,
                'already_refunded',
                'This subscription has already been refunded.',
                null
            );
        }

        // Calculate refund amount (minus disclosed fees)
        $refundAmount = $this->calculateRefundAmount($subscription);

        try {
            // Call Paystack refund API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->secretKey,
                'Content-Type' => 'application/json',
            ])->post(self::PAYSTACK_REFUND_URL, [
                'transaction' => $subscription->paystack_reference,
                'amount' => $refundAmount * 100, // Paystack expects amount in kobo
                'currency' => $subscription->currency,
            ]);

            if (! $response->successful()) {
                Log::error('Paystack refund API failed', [
                    'subscription_id' => $subscription->id,
                    'reference' => $subscription->paystack_reference,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return new RefundResult(
                    false,
                    'api_error',
                    'Refund request failed. Please try again or contact support.',
                    null
                );
            }

            $refundData = $response->json();

            // Update subscription status and refund tracking
            $subscription->update([
                'status' => Subscription::STATUS_CANCELED,
                'canceled_at' => now(),
                'refunded_at' => now(),
                'refund_reference' => $refundData['data']['reference'] ?? null,
                'refund_amount' => $refundAmount,
                'refund_reason' => $reason,
            ]);

            // Update organization to read-only mode
            $subscription->organization->update([
                'billing_status' => Organization::BILLING_CANCELED,
                'billing_status_updated_at' => now(),
                'read_only_mode' => true,
            ]);

            // Log refund event
            $subscription->billingEvents()->create([
                'event_type' => 'refund_processed',
                'provider' => 'paystack',
                'provider_event_id' => $refundData['data']['reference'] ?? null,
                'reference' => $subscription->paystack_reference,
                'payload_json' => [
                    'refund_amount' => $refundAmount,
                    'original_amount' => $subscription->amount_paid,
                    'reason' => $reason,
                    'refund_reference' => $refundData['data']['reference'] ?? null,
                ],
                'processed_at' => now(),
            ]);

            Log::info('Refund processed successfully', [
                'subscription_id' => $subscription->id,
                'reference' => $subscription->paystack_reference,
                'refund_amount' => $refundAmount,
            ]);

            return new RefundResult(
                true,
                'success',
                'Refund processed successfully. Organization is now in read-only mode.',
                $refundData['data']['reference'] ?? null
            );

        } catch (\Exception $e) {
            Log::error('Refund processing exception', [
                'subscription_id' => $subscription->id,
                'error' => $e->getMessage(),
            ]);

            return new RefundResult(
                false,
                'exception',
                'An error occurred while processing the refund. Please contact support.',
                null
            );
        }
    }

    /**
     * Check if subscription already has a processed refund.
     */
    private function hasExistingRefund(Subscription $subscription): bool
    {
        return $subscription->billingEvents()
            ->where('event_type', 'refund_processed')
            ->exists();
    }

    /**
     * Calculate refund amount minus disclosed fees.
     * This is a simplified calculation - adjust based on actual fee structure.
     */
    private function calculateRefundAmount(Subscription $subscription): float
    {
        // Example: Deduct Paystack fees (1.5% + ₦100)
        $paystackFee = ($subscription->amount_paid * 0.015) + 100;
        
        // Deduct other non-recoverable costs (stamp duty, bank charges, etc.)
        $otherFees = 50; // Example flat fee

        $refundAmount = $subscription->amount_paid - $paystackFee - $otherFees;

        return max($refundAmount, 0); // Ensure refund is not negative
    }
}
