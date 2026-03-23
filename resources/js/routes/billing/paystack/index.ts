import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:13
 * @route '/billing/paystack/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/billing/paystack/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:13
 * @route '/billing/paystack/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:13
 * @route '/billing/paystack/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:13
 * @route '/billing/paystack/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:13
 * @route '/billing/paystack/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:13
 * @route '/billing/paystack/callback'
 */
        callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Billing\PaystackCallbackController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCallbackController.php:13
 * @route '/billing/paystack/callback'
 */
        callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callback.form = callbackForm
/**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ["post"],
    url: '/billing/paystack/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
    const webhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: webhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\PaystackWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PaystackWebhookController.php:14
 * @route '/billing/paystack/webhook'
 */
        webhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: webhook.url(options),
            method: 'post',
        })
    
    webhook.form = webhookForm
const paystack = {
    callback: Object.assign(callback, callback),
webhook: Object.assign(webhook, webhook),
}

export default paystack