import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::index
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:22
 * @route '/settings/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::index
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:22
 * @route '/settings/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::index
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:22
 * @route '/settings/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::index
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:22
 * @route '/settings/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::index
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:22
 * @route '/settings/users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::index
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:22
 * @route '/settings/users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::index
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:22
 * @route '/settings/users'
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
/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::store
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:52
 * @route '/settings/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::store
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:52
 * @route '/settings/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::store
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:52
 * @route '/settings/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::store
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:52
 * @route '/settings/users'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::store
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:52
 * @route '/settings/users'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::update
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:103
 * @route '/settings/users/{userId}'
 */
export const update = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/users/{userId}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::update
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:103
 * @route '/settings/users/{userId}'
 */
update.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return update.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::update
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:103
 * @route '/settings/users/{userId}'
 */
update.patch = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::update
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:103
 * @route '/settings/users/{userId}'
 */
    const updateForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::update
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:103
 * @route '/settings/users/{userId}'
 */
        updateForm.patch = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::destroy
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:114
 * @route '/settings/users/{userId}'
 */
export const destroy = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/users/{userId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::destroy
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:114
 * @route '/settings/users/{userId}'
 */
destroy.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return destroy.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::destroy
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:114
 * @route '/settings/users/{userId}'
 */
destroy.delete = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::destroy
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:114
 * @route '/settings/users/{userId}'
 */
    const destroyForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\OrganizationUsersController::destroy
 * @see app/Http/Controllers/Settings/OrganizationUsersController.php:114
 * @route '/settings/users/{userId}'
 */
        destroyForm.delete = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const OrganizationUsersController = { index, store, update, destroy }

export default OrganizationUsersController