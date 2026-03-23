import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
const PaystackWebhookController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PaystackWebhookController.url(options),
    method: 'post',
})

PaystackWebhookController.definition = {
    methods: ["post"],
    url: '/billing/paystack/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
PaystackWebhookController.url = (options?: RouteQueryOptions) => {
    return PaystackWebhookController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
PaystackWebhookController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PaystackWebhookController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
    const PaystackWebhookControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: PaystackWebhookController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
        PaystackWebhookControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: PaystackWebhookController.url(options),
            method: 'post',
        })
    
    PaystackWebhookController.form = PaystackWebhookControllerForm
export default PaystackWebhookController