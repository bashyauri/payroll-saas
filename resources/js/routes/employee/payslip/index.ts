import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::pdf
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
export const pdf = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/employee/payslips/{payrollRun}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::pdf
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
pdf.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return pdf.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::pdf
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
pdf.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\PayslipPdfController::pdf
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
pdf.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\PayslipPdfController::pdf
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
    const pdfForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\PayslipPdfController::pdf
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
        pdfForm.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\PayslipPdfController::pdf
 * @see app/Http/Controllers/Employee/PayslipPdfController.php:15
 * @route '/employee/payslips/{payrollRun}/pdf'
 */
        pdfForm.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
const payslip = {
    pdf: Object.assign(pdf, pdf),
}

export default payslip