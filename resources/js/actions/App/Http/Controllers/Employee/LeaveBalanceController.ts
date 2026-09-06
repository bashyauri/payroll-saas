import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::index
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee/leave-balance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::index
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::index
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::index
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::index
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::index
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::index
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
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
const LeaveBalanceController = { index }

export default LeaveBalanceController