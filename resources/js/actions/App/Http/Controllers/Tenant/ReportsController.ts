import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:13
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
 * @see app/Http/Controllers/Tenant/ReportsController.php:13
 * @route '/reports'
 */
ReportsController.url = (options?: RouteQueryOptions) => {
    return ReportsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:13
 * @route '/reports'
 */
ReportsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReportsController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:13
 * @route '/reports'
 */
ReportsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ReportsController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:13
 * @route '/reports'
 */
    const ReportsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ReportsController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:13
 * @route '/reports'
 */
        ReportsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReportsController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:13
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
export default ReportsController