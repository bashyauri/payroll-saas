import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\RefundController::check
 * @see app/Http/Controllers/Billing/RefundController.php:21
 * @route '/billing/refund/{subscription}/check'
 */
export const check = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})

check.definition = {
    methods: ["get","head"],
    url: '/billing/refund/{subscription}/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Billing\RefundController::check
 * @see app/Http/Controllers/Billing/RefundController.php:21
 * @route '/billing/refund/{subscription}/check'
 */
check.url = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return check.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\RefundController::check
 * @see app/Http/Controllers/Billing/RefundController.php:21
 * @route '/billing/refund/{subscription}/check'
 */
check.get = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: check.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Billing\RefundController::check
 * @see app/Http/Controllers/Billing/RefundController.php:21
 * @route '/billing/refund/{subscription}/check'
 */
check.head = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: check.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Billing\RefundController::check
 * @see app/Http/Controllers/Billing/RefundController.php:21
 * @route '/billing/refund/{subscription}/check'
 */
    const checkForm = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: check.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Billing\RefundController::check
 * @see app/Http/Controllers/Billing/RefundController.php:21
 * @route '/billing/refund/{subscription}/check'
 */
        checkForm.get = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Billing\RefundController::check
 * @see app/Http/Controllers/Billing/RefundController.php:21
 * @route '/billing/refund/{subscription}/check'
 */
        checkForm.head = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: check.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    check.form = checkForm
/**
* @see \App\Http\Controllers\Billing\RefundController::process
 * @see app/Http/Controllers/Billing/RefundController.php:49
 * @route '/billing/refund/{subscription}/process'
 */
export const process = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/billing/refund/{subscription}/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\RefundController::process
 * @see app/Http/Controllers/Billing/RefundController.php:49
 * @route '/billing/refund/{subscription}/process'
 */
process.url = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return process.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\RefundController::process
 * @see app/Http/Controllers/Billing/RefundController.php:49
 * @route '/billing/refund/{subscription}/process'
 */
process.post = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\RefundController::process
 * @see app/Http/Controllers/Billing/RefundController.php:49
 * @route '/billing/refund/{subscription}/process'
 */
    const processForm = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: process.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\RefundController::process
 * @see app/Http/Controllers/Billing/RefundController.php:49
 * @route '/billing/refund/{subscription}/process'
 */
        processForm.post = (args: { subscription: string | { id: string } } | [subscription: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: process.url(args, options),
            method: 'post',
        })
    
    process.form = processForm
const refund = {
    check: Object.assign(check, check),
process: Object.assign(process, process),
}

export default refund