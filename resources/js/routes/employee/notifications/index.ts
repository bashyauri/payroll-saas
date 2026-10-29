import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\NotificationController::markRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
export const markRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markRead.url(options),
    method: 'post',
})

markRead.definition = {
    methods: ["post"],
    url: '/employee/notifications/mark-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\NotificationController::markRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
markRead.url = (options?: RouteQueryOptions) => {
    return markRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\NotificationController::markRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
markRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markRead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employee\NotificationController::markRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
    const markReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employee\NotificationController::markRead
 * @see app/Http/Controllers/Employee/NotificationController.php:89
 * @route '/employee/notifications/mark-read'
 */
        markReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markRead.url(options),
            method: 'post',
        })
    
    markRead.form = markReadForm
/**
* @see \App\Http\Controllers\Employee\NotificationController::markAllRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
export const markAllRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

markAllRead.definition = {
    methods: ["post"],
    url: '/employee/notifications/mark-all-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employee\NotificationController::markAllRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
markAllRead.url = (options?: RouteQueryOptions) => {
    return markAllRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\NotificationController::markAllRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
markAllRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employee\NotificationController::markAllRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
    const markAllReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employee\NotificationController::markAllRead
 * @see app/Http/Controllers/Employee/NotificationController.php:105
 * @route '/employee/notifications/mark-all-read'
 */
        markAllReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllRead.url(options),
            method: 'post',
        })
    
    markAllRead.form = markAllReadForm
const notifications = {
    markRead: Object.assign(markRead, markRead),
markAllRead: Object.assign(markAllRead, markAllRead),
}

export default notifications