import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import profile937a89 from './profile'
import payslip5f0ae0 from './payslip'
import taxDocumentsC4210b from './tax-documents'
import notifications1ce82a from './notifications'
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
/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::taxDocuments
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:17
 * @route '/employee/tax-documents'
 */
export const taxDocuments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: taxDocuments.url(options),
    method: 'get',
})

taxDocuments.definition = {
    methods: ["get","head"],
    url: '/employee/tax-documents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::taxDocuments
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:17
 * @route '/employee/tax-documents'
 */
taxDocuments.url = (options?: RouteQueryOptions) => {
    return taxDocuments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::taxDocuments
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:17
 * @route '/employee/tax-documents'
 */
taxDocuments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: taxDocuments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::taxDocuments
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:17
 * @route '/employee/tax-documents'
 */
taxDocuments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: taxDocuments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::taxDocuments
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:17
 * @route '/employee/tax-documents'
 */
    const taxDocumentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: taxDocuments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::taxDocuments
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:17
 * @route '/employee/tax-documents'
 */
        taxDocumentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: taxDocuments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\TaxDocumentsController::taxDocuments
 * @see app/Http/Controllers/Employee/TaxDocumentsController.php:17
 * @route '/employee/tax-documents'
 */
        taxDocumentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: taxDocuments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    taxDocuments.form = taxDocumentsForm
/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::leaveBalance
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
export const leaveBalance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveBalance.url(options),
    method: 'get',
})

leaveBalance.definition = {
    methods: ["get","head"],
    url: '/employee/leave-balance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::leaveBalance
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
leaveBalance.url = (options?: RouteQueryOptions) => {
    return leaveBalance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::leaveBalance
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
leaveBalance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: leaveBalance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::leaveBalance
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
leaveBalance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: leaveBalance.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::leaveBalance
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
    const leaveBalanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: leaveBalance.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::leaveBalance
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
        leaveBalanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leaveBalance.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\LeaveBalanceController::leaveBalance
 * @see app/Http/Controllers/Employee/LeaveBalanceController.php:16
 * @route '/employee/leave-balance'
 */
        leaveBalanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: leaveBalance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    leaveBalance.form = leaveBalanceForm
/**
* @see \App\Http\Controllers\Employee\NotificationController::notifications
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
export const notifications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})

notifications.definition = {
    methods: ["get","head"],
    url: '/employee/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employee\NotificationController::notifications
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
notifications.url = (options?: RouteQueryOptions) => {
    return notifications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employee\NotificationController::notifications
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
notifications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: notifications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employee\NotificationController::notifications
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
notifications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: notifications.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employee\NotificationController::notifications
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
    const notificationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: notifications.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employee\NotificationController::notifications
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
        notificationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employee\NotificationController::notifications
 * @see app/Http/Controllers/Employee/NotificationController.php:17
 * @route '/employee/notifications'
 */
        notificationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: notifications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    notifications.form = notificationsForm
const employee = {
    dashboard: Object.assign(dashboard, dashboard),
profile: Object.assign(profile, profile937a89),
payslip: Object.assign(payslip, payslip5f0ae0),
taxDocuments: Object.assign(taxDocuments, taxDocumentsC4210b),
leaveBalance: Object.assign(leaveBalance, leaveBalance),
notifications: Object.assign(notifications, notifications1ce82a),
}

export default employee