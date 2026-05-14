import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:25
 * @route '/payroll'
 */
const PayrollController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PayrollController.url(options),
    method: 'get',
})

PayrollController.definition = {
    methods: ["get","head"],
    url: '/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:25
 * @route '/payroll'
 */
PayrollController.url = (options?: RouteQueryOptions) => {
    return PayrollController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:25
 * @route '/payroll'
 */
PayrollController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PayrollController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:25
 * @route '/payroll'
 */
PayrollController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PayrollController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:25
 * @route '/payroll'
 */
    const PayrollControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: PayrollController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:25
 * @route '/payroll'
 */
        PayrollControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PayrollController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:25
 * @route '/payroll'
 */
        PayrollControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PayrollController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    PayrollController.form = PayrollControllerForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:67
 * @route '/payroll/runs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/runs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:67
 * @route '/payroll/runs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:67
 * @route '/payroll/runs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:67
 * @route '/payroll/runs'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:67
 * @route '/payroll/runs'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:114
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
export const finalize = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

finalize.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:114
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
finalize.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payrollRun: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payrollRun: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payrollRun: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payrollRun: typeof args.payrollRun === 'object'
                ? args.payrollRun.id
                : args.payrollRun,
                }

    return finalize.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:114
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
finalize.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:114
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
    const finalizeForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalize.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:114
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
        finalizeForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalize.url(args, options),
            method: 'post',
        })
    
    finalize.form = finalizeForm
PayrollController.store = store
PayrollController.finalize = finalize

export default PayrollController