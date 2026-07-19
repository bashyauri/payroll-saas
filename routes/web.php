<?php

use App\Http\Controllers\Billing\PaystackCallbackController;
use App\Http\Controllers\Billing\PaystackCheckoutController;
use App\Http\Controllers\Billing\PaystackWebhookController;
use App\Http\Controllers\Billing\PlanSelectionController;
use App\Http\Controllers\Billing\RefundController;
use App\Http\Controllers\Onboarding\ContinueOnboardingController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('onboarding/continue', ContinueOnboardingController::class)
        ->name('onboarding.continue');

    Route::get('billing/plans', PlanSelectionController::class)->name('billing.plans');
    Route::post('billing/checkout', PaystackCheckoutController::class)->name('billing.checkout');
    
    // Refund routes
    Route::get('billing/refund/{subscription}/check', [RefundController::class, 'checkEligibility'])
        ->name('billing.refund.check');
    Route::post('billing/refund/{subscription}/process', [RefundController::class, 'process'])
        ->name('billing.refund.process');
});

Route::get('billing/paystack/callback', PaystackCallbackController::class)->name('billing.paystack.callback');
Route::post('billing/paystack/webhook', PaystackWebhookController::class)->name('billing.paystack.webhook');

require __DIR__.'/settings.php';
