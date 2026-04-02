<?php

use App\Http\Controllers\Billing\PaystackCallbackController;
use App\Http\Controllers\Billing\PaystackCheckoutController;
use App\Http\Controllers\Billing\PaystackWebhookController;
use App\Http\Controllers\Billing\PlanSelectionController;
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
});

Route::get('billing/paystack/callback', PaystackCallbackController::class)->name('billing.paystack.callback');
Route::post('billing/paystack/webhook', PaystackWebhookController::class)->name('billing.paystack.webhook');

require __DIR__.'/settings.php';
