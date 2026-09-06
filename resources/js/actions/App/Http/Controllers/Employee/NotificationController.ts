import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\NotificationController::index
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\NotificationController::index
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\NotificationController::index
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\NotificationController::index
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\NotificationController::index
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\NotificationController::index
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\NotificationController::index
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
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
* @see \App\Http\Controllers\Employee\NotificationController::markAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
export const markAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/employee/notifications/mark-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\NotificationController::markAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
markAsRead.url = (options?: RouteQueryOptions) => {
    return markAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\NotificationController::markAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
markAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employee\NotificationController::markAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
    const markAsReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employee\NotificationController::markAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
        markAsReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsRead.url(options),
            method: 'post',
        })
    
    markAsRead.form = markAsReadForm
/**
* @see \App\Http\Controllers\Employee\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/employee/notifications/mark-all-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employee\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
    const markAllAsReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllAsRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employee\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
        markAllAsReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllAsRead.url(options),
            method: 'post',
        })
    
    markAllAsRead.form = markAllAsReadForm
const NotificationController = { index, markAsRead, markAllAsRead }

export default NotificationController