import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::__invoke
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
export const __invoke = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(args, options),
    method: 'get',
})

__invoke.definition = {
    methods: ["get","head"],
    url: '/employee/payslips/{payrollRun}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::__invoke
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
__invoke.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return __invoke.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::__invoke
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
__invoke.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: __invoke.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::__invoke
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
__invoke.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: __invoke.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\PayslipPdfController::__invoke
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
    const __invokeForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: __invoke.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\PayslipPdfController::__invoke
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
        __invokeForm.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: __invoke.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\PayslipPdfController::__invoke
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
        __invokeForm.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: __invoke.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    __invoke.form = __invokeForm
const PayslipPdfController = { __invoke }

export default PayslipPdfController