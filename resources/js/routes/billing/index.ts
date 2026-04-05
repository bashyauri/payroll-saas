import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import paystack from './paystack'
/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
export const plans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})

plans.definition = {
    methods: ["get","head"],
    url: '/billing/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
plans.url = (options?: RouteQueryOptions) => {
    return plans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
plans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
plans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: plans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
    const plansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: plans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
        plansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
        plansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: plans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    plans.form = plansForm
/**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:17
 * @route '/billing/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/billing/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:17
 * @route '/billing/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:17
 * @route '/billing/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:17
 * @route '/billing/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\PaystackCheckoutController::__invoke
 * @see app/Http/Controllers/Billing/PaystackCheckoutController.php:17
 * @route '/billing/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
const billing = {
    plans: Object.assign(plans, plans),
checkout: Object.assign(checkout, checkout),
paystack: Object.assign(paystack, paystack),
}

export default billing