import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:17
 * @route '/payroll/finalize'
 */
export const finalize = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(options),
    method: 'post',
})

finalize.definition = {
    methods: ["post"],
    url: '/payroll/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:17
 * @route '/payroll/finalize'
 */
finalize.url = (options?: RouteQueryOptions) => {
    return finalize.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:17
 * @route '/payroll/finalize'
 */
finalize.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:17
 * @route '/payroll/finalize'
 */
    const finalizeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalize.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:17
 * @route '/payroll/finalize'
 */
        finalizeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalize.url(options),
            method: 'post',
        })
    
    finalize.form = finalizeForm
const payroll = {
    index: Object.assign(index, index),
finalize: Object.assign(finalize, finalize),
}

export default payroll