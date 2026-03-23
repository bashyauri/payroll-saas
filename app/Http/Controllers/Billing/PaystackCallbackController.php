<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackCallbackController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $reference = (string) $request->query('reference', '');

        Log::info('Paystack callback received.', [
            'reference' => $reference,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if ($reference === '') {
            Log::warning('Paystack callback missing reference.');

            return redirect()
                ->route('billing.plans')
                ->withErrors(['checkout' => 'Missing Paystack reference in callback.']);
        }

        $response = Http::withToken((string) config('services.paystack.secret_key'))
            ->acceptJson()
            ->get(rtrim((string) config('services.paystack.base_url'), '/') . '/transaction/verify/' . $reference);

        if (! $response->successful() || ! $response->json('status')) {
            Log::error('Paystack callback verification failed.', [
                'reference' => $reference,
                'http_status' => $response->status(),
                'response' => $response->json(),
            ]);

            return redirect()
                ->route('billing.plans')
                ->withErrors(['checkout' => 'Unable to verify payment with Paystack.']);
        }

        $transactionStatus = (string) $response->json('data.status', '');

        if ($transactionStatus !== 'success') {
            Log::warning('Paystack callback not successful status.', [
                'reference' => $reference,
                'status' => $transactionStatus,
            ]);

            return redirect()
                ->route('billing.plans')
                ->withErrors(['checkout' => 'Payment was not successful. Please try again.']);
        }

        Log::info('Paystack callback verified successfully.', [
            'reference' => $reference,
        ]);

        return redirect()
            ->route('dashboard')
            ->with('checkout_notice', 'Payment verified successfully. Reference: ' . $reference);
    }
}
