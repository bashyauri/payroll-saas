import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:16
 * @route '/billing/paystack/callback'
 */
const PaystackCallbackController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PaystackCallbackController.url(options),
    method: 'get',
})

PaystackCallbackController.definition = {
    methods: ["get","head"],
    url: '/billing/paystack/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:16
 * @route '/billing/paystack/callback'
 */
PaystackCallbackController.url = (options?: RouteQueryOptions) => {
    return PaystackCallbackController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:16
 * @route '/billing/paystack/callback'
 */
PaystackCallbackController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PaystackCallbackController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:16
 * @route '/billing/paystack/callback'
 */
PaystackCallbackController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PaystackCallbackController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:16
 * @route '/billing/paystack/callback'
 */
    const PaystackCallbackControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: PaystackCallbackController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:16
 * @route '/billing/paystack/callback'
 */
        PaystackCallbackControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PaystackCallbackController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:16
 * @route '/billing/paystack/callback'
 */
        PaystackCallbackControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PaystackCallbackController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    PaystackCallbackController.form = PaystackCallbackControllerForm
export default PaystackCallbackController