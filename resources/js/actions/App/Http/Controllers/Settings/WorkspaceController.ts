import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
 * @see app/Http/Controllers/Settings/WorkspaceController.php:17
 * @route '/settings/workspace'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/workspace',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
 * @see app/Http/Controllers/Settings/WorkspaceController.php:17
 * @route '/settings/workspace'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
 * @see app/Http/Controllers/Settings/WorkspaceController.php:17
 * @route '/settings/workspace'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
 * @see app/Http/Controllers/Settings/WorkspaceController.php:17
 * @route '/settings/workspace'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
 * @see app/Http/Controllers/Settings/WorkspaceController.php:17
 * @route '/settings/workspace'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
 * @see app/Http/Controllers/Settings/WorkspaceController.php:17
 * @route '/settings/workspace'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\WorkspaceController::edit
 * @see app/Http/Controllers/Settings/WorkspaceController.php:17
 * @route '/settings/workspace'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
 * @see app/Http/Controllers/Settings/WorkspaceController.php:29
 * @route '/settings/workspace'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/workspace',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
 * @see app/Http/Controllers/Settings/WorkspaceController.php:29
 * @route '/settings/workspace'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
 * @see app/Http/Controllers/Settings/WorkspaceController.php:29
 * @route '/settings/workspace'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\WorkspaceController::update
 * @see app/Http/Controllers/Settings/WorkspaceController.php:29
 * @route '/settings/workspace'
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
* @see \App\Http\Controllers\Settings\WorkspaceController::update
 * @see app/Http/Controllers/Settings/WorkspaceController.php:29
 * @route '/settings/workspace'
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
const WorkspaceController = { edit, update }

export default WorkspaceController