import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:19
 * @route '/reports'
 */
const ReportsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReportsController.url(options),
    method: 'get',
})

ReportsController.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:19
 * @route '/reports'
 */
ReportsController.url = (options?: RouteQueryOptions) => {
    return ReportsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:19
 * @route '/reports'
 */
ReportsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReportsController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:19
 * @route '/reports'
 */
ReportsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ReportsController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:19
 * @route '/reports'
 */
    const ReportsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ReportsController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:19
 * @route '/reports'
 */
        ReportsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReportsController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:19
 * @route '/reports'
 */
        ReportsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReportsController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ReportsController.form = ReportsControllerForm
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:65
 * @route '/reports/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:65
 * @route '/reports/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:65
 * @route '/reports/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:65
 * @route '/reports/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:65
 * @route '/reports/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:65
 * @route '/reports/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:65
 * @route '/reports/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
ReportsController.exportMethod = exportMethod

export default ReportsController