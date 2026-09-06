import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::update
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/employee/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::update
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::update
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Employee\SelfServiceController::update
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::update
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const profile = {
    update: Object.assign(update, update),
}

export default profile