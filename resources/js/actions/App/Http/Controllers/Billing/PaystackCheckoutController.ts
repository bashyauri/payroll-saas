import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:14
 * @route '/billing/checkout'
 */
const PaystackCheckoutController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PaystackCheckoutController.url(options),
    method: 'post',
})

PaystackCheckoutController.definition = {
    methods: ["post"],
    url: '/billing/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:14
 * @route '/billing/checkout'
 */
PaystackCheckoutController.url = (options?: RouteQueryOptions) => {
    return PaystackCheckoutController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:14
 * @route '/billing/checkout'
 */
PaystackCheckoutController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PaystackCheckoutController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:14
 * @route '/billing/checkout'
 */
    const PaystackCheckoutControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: PaystackCheckoutController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:14
 * @route '/billing/checkout'
 */
        PaystackCheckoutControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: PaystackCheckoutController.url(options),
            method: 'post',
        })
    
    PaystackCheckoutController.form = PaystackCheckoutControllerForm
export default PaystackCheckoutController