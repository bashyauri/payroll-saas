import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
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
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
PayrollController.url = (options?: RouteQueryOptions) => {
    return PayrollController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
PayrollController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PayrollController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
PayrollController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PayrollController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
    const PayrollControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: PayrollController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
 * @route '/payroll'
 */
        PayrollControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PayrollController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\PayrollController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollController.php:15
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
export default PayrollController