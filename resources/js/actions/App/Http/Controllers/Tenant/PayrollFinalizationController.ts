import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
const PayrollFinalizationController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PayrollFinalizationController.url(options),
    method: 'post',
})

PayrollFinalizationController.definition = {
    methods: ["post"],
    url: '/payroll/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
PayrollFinalizationController.url = (options?: RouteQueryOptions) => {
    return PayrollFinalizationController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
PayrollFinalizationController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PayrollFinalizationController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
    const PayrollFinalizationControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: PayrollFinalizationController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
        PayrollFinalizationControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: PayrollFinalizationController.url(options),
            method: 'post',
        })
    
    PayrollFinalizationController.form = PayrollFinalizationControllerForm
export default PayrollFinalizationController