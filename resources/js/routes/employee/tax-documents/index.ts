import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::payeCertificate
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:104
 * @route '/employee/tax-documents/paye-certificate/{payrollRun}'
 */
export const payeCertificate = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payeCertificate.url(args, options),
    method: 'get',
})

payeCertificate.definition = {
    methods: ["get","head"],
    url: '/employee/tax-documents/paye-certificate/{payrollRun}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::payeCertificate
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:104
 * @route '/employee/tax-documents/paye-certificate/{payrollRun}'
 */
payeCertificate.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return payeCertificate.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::payeCertificate
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:104
 * @route '/employee/tax-documents/paye-certificate/{payrollRun}'
 */
payeCertificate.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payeCertificate.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::payeCertificate
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:104
 * @route '/employee/tax-documents/paye-certificate/{payrollRun}'
 */
payeCertificate.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payeCertificate.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::payeCertificate
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:104
 * @route '/employee/tax-documents/paye-certificate/{payrollRun}'
 */
    const payeCertificateForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payeCertificate.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::payeCertificate
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:104
 * @route '/employee/tax-documents/paye-certificate/{payrollRun}'
 */
        payeCertificateForm.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payeCertificate.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::payeCertificate
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:104
 * @route '/employee/tax-documents/paye-certificate/{payrollRun}'
 */
        payeCertificateForm.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payeCertificate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payeCertificate.form = payeCertificateForm
/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::pensionStatement
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:145
 * @route '/employee/tax-documents/pension-statement'
 */
export const pensionStatement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pensionStatement.url(options),
    method: 'get',
})

pensionStatement.definition = {
    methods: ["get","head"],
    url: '/employee/tax-documents/pension-statement',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::pensionStatement
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:145
 * @route '/employee/tax-documents/pension-statement'
 */
pensionStatement.url = (options?: RouteQueryOptions) => {
    return pensionStatement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::pensionStatement
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:145
 * @route '/employee/tax-documents/pension-statement'
 */
pensionStatement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pensionStatement.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::pensionStatement
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:145
 * @route '/employee/tax-documents/pension-statement'
 */
pensionStatement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pensionStatement.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::pensionStatement
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:145
 * @route '/employee/tax-documents/pension-statement'
 */
    const pensionStatementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pensionStatement.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::pensionStatement
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:145
 * @route '/employee/tax-documents/pension-statement'
 */
        pensionStatementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pensionStatement.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::pensionStatement
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:145
 * @route '/employee/tax-documents/pension-statement'
 */
        pensionStatementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pensionStatement.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pensionStatement.form = pensionStatementForm
const taxDocuments = {
    payeCertificate: Object.assign(payeCertificate, payeCertificate),
pensionStatement: Object.assign(pensionStatement, pensionStatement),
}

export default taxDocuments