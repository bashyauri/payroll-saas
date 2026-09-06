import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::dashboard
 * @see app/Http/Controllers/Employee/SelfServiceController.php:19
 * @route '/employee/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/employee/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::dashboard
 * @see app/Http/Controllers/Employee/SelfServiceController.php:19
 * @route '/employee/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::dashboard
 * @see app/Http/Controllers/Employee/SelfServiceController.php:19
 * @route '/employee/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::dashboard
 * @see app/Http/Controllers/Employee/SelfServiceController.php:19
 * @route '/employee/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\SelfServiceController::dashboard
 * @see app/Http/Controllers/Employee/SelfServiceController.php:19
 * @route '/employee/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::dashboard
 * @see app/Http/Controllers/Employee/SelfServiceController.php:19
 * @route '/employee/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::dashboard
 * @see app/Http/Controllers/Employee/SelfServiceController.php:19
 * @route '/employee/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::profile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:83
 * @route '/employee/profile'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/employee/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::profile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:83
 * @route '/employee/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::profile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:83
 * @route '/employee/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::profile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:83
 * @route '/employee/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\SelfServiceController::profile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:83
 * @route '/employee/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::profile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:83
 * @route '/employee/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::profile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:83
 * @route '/employee/profile'
 */
        profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::updateProfile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
export const updateProfile = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateProfile.url(options),
    method: 'patch',
})

updateProfile.definition = {
    methods: ["patch"],
    url: '/employee/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::updateProfile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
updateProfile.url = (options?: RouteQueryOptions) => {
    return updateProfile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::updateProfile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
updateProfile.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateProfile.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Employee\SelfServiceController::updateProfile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
    const updateProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfile.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::updateProfile
 * @see app/Http/Controllers/Employee/SelfServiceController.php:125
 * @route '/employee/profile'
 */
        updateProfileForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateProfile.form = updateProfileForm
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::payslip
 * @see app/Http/Controllers/Employee/SelfServiceController.php:137
 * @route '/employee/payslips/{payrollRun}'
 */
export const payslip = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})

payslip.definition = {
    methods: ["get","head"],
    url: '/employee/payslips/{payrollRun}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::payslip
 * @see app/Http/Controllers/Employee/SelfServiceController.php:137
 * @route '/employee/payslips/{payrollRun}'
 */
payslip.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return payslip.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\SelfServiceController::payslip
 * @see app/Http/Controllers/Employee/SelfServiceController.php:137
 * @route '/employee/payslips/{payrollRun}'
 */
payslip.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payslip.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\SelfServiceController::payslip
 * @see app/Http/Controllers/Employee/SelfServiceController.php:137
 * @route '/employee/payslips/{payrollRun}'
 */
payslip.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payslip.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\SelfServiceController::payslip
 * @see app/Http/Controllers/Employee/SelfServiceController.php:137
 * @route '/employee/payslips/{payrollRun}'
 */
    const payslipForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payslip.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::payslip
 * @see app/Http/Controllers/Employee/SelfServiceController.php:137
 * @route '/employee/payslips/{payrollRun}'
 */
        payslipForm.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslip.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\SelfServiceController::payslip
 * @see app/Http/Controllers/Employee/SelfServiceController.php:137
 * @route '/employee/payslips/{payrollRun}'
 */
        payslipForm.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payslip.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payslip.form = payslipForm
const SelfServiceController = { dashboard, profile, updateProfile, payslip }

export default SelfServiceController