<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Onboarding\OnboardingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaystackCallbackController extends Controller
{
    public function __invoke(Request $request, OnboardingService $onboarding): RedirectResponse
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

        $transactionData = $response->json('data', []);
        $transactionStatus = (string) $transactionData['status'] ?? '';

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

        $user = Auth::user();

        if (! $user) {
            $userId = (string) data_get($transactionData, 'metadata.user_id', '');
            $user = $userId !== '' ? User::query()->find($userId) : null;

            if (! $user) {
                Log::error('Paystack callback could not resolve paying user.', [
                    'reference' => $reference,
                    'metadata_user_id' => $userId,
                ]);

                return redirect()
                    ->route('login')
                    ->withErrors(['checkout' => 'We could not restore your session after payment. Please sign in to continue.']);
            }

            Auth::login($user);
            $request->session()->regenerate();
        }

        try {
            $organization = $onboarding->setupOrganizationAfterPayment($user, $transactionData);
            Log::info('Organization created after payment.', [
                'organization_id' => $organization->id,
                'user_id' => $user->id,
                'reference' => $reference,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to setup organization after payment.', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->route('billing.plans')
                ->withErrors(['checkout' => 'Payment verified but failed to setup your organization. Please contact support.']);
        }

        return redirect()
            ->route('dashboard')
            ->with('success', 'Welcome! Your 7-day free trial has started.');
    }
}
