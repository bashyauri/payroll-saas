<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\BillingEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class PaystackWebhookController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $secret = (string) config('services.paystack.webhook_secret', '');

        if ($secret === '') {
            Log::error('Paystack webhook rejected: missing webhook secret.');

            return response()->json(['message' => 'Webhook secret not configured.'], 500);
        }

        $rawBody = (string) $request->getContent();
        $signature = (string) $request->header('x-paystack-signature', '');
        $computed = hash_hmac('sha512', $rawBody, $secret);

        if (! hash_equals($computed, $signature)) {
            Log::warning('Paystack webhook rejected: invalid signature.', [
                'ip' => $request->ip(),
            ]);

            return response()->json(['message' => 'Invalid signature.'], 401);
        }

        /** @var array<string, mixed> $payload */
        $payload = (array) json_decode($rawBody, true);
        $eventType = (string) Arr::get($payload, 'event', 'unknown');
        $reference = (string) Arr::get($payload, 'data.reference', '');

        Log::info('Paystack webhook received.', [
            'event' => $eventType,
            'reference' => $reference,
        ]);

        $organizationId = (string) Arr::get($payload, 'data.metadata.organization_id', '');
        $subscriptionId = (string) Arr::get($payload, 'data.metadata.subscription_id', '');

        if ($organizationId !== '') {
            BillingEvent::query()->updateOrCreate(
                [
                    'provider' => 'paystack',
                    'provider_event_id' => (string) Arr::get($payload, 'data.id', ''),
                ],
                [
                    'organization_id' => $organizationId,
                    'subscription_id' => $subscriptionId !== '' ? $subscriptionId : null,
                    'event_type' => $eventType,
                    'reference' => $reference,
                    'payload_json' => $payload,
                    'ip_address' => $request->ip(),
                    'user_agent' => (string) $request->userAgent(),
                    'processed_at' => now(),
                ],
            );

            Log::info('Paystack webhook persisted to billing_events.', [
                'organization_id' => $organizationId,
                'subscription_id' => $subscriptionId,
                'event' => $eventType,
                'reference' => $reference,
            ]);
        } else {
            Log::warning('Paystack webhook missing organization metadata; event not persisted.', [
                'event' => $eventType,
                'reference' => $reference,
            ]);
        }

        return response()->json(['status' => 'ok']);
    }
}
