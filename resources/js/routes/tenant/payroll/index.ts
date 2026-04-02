import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
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
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
finalize.url = (options?: RouteQueryOptions) => {
    return finalize.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
finalize.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
    const finalizeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalize.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollFinalizationController::__invoke
 * @see app/Http/Controllers/Tenant/PayrollFinalizationController.php:19
 * @route '/payroll/finalize'
 */
        finalizeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalize.url(options),
            method: 'post',
        })
    
    finalize.form = finalizeForm
const payroll = {
    finalize: Object.assign(finalize, finalize),
}

export default payroll