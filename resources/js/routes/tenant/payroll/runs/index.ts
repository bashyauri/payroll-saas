import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
import employees from './employees'
/**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:82
 * @route '/payroll/runs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/runs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:82
 * @route '/payroll/runs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:82
 * @route '/payroll/runs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:82
 * @route '/payroll/runs'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::store
 * @see app/Http/Controllers/Tenant/PayrollController.php:82
 * @route '/payroll/runs'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::show
 * @see app/Http/Controllers/Tenant/PayrollController.php:156
 * @route '/payroll/runs/{payrollRun}'
 */
export const show = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payroll/runs/{payrollRun}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::show
 * @see app/Http/Controllers/Tenant/PayrollController.php:156
 * @route '/payroll/runs/{payrollRun}'
 */
show.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::show
 * @see app/Http/Controllers/Tenant/PayrollController.php:156
 * @route '/payroll/runs/{payrollRun}'
 */
show.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\PayrollController::show
 * @see app/Http/Controllers/Tenant/PayrollController.php:156
 * @route '/payroll/runs/{payrollRun}'
 */
show.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::show
 * @see app/Http/Controllers/Tenant/PayrollController.php:156
 * @route '/payroll/runs/{payrollRun}'
 */
    const showForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::show
 * @see app/Http/Controllers/Tenant/PayrollController.php:156
 * @route '/payroll/runs/{payrollRun}'
 */
        showForm.get = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\PayrollController::show
 * @see app/Http/Controllers/Tenant/PayrollController.php:156
 * @route '/payroll/runs/{payrollRun}'
 */
        showForm.head = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::recalculate
 * @see app/Http/Controllers/Tenant/PayrollController.php:320
 * @route '/payroll/runs/{payrollRun}/recalculate'
 */
export const recalculate = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculate.url(args, options),
    method: 'post',
})

recalculate.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/recalculate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::recalculate
 * @see app/Http/Controllers/Tenant/PayrollController.php:320
 * @route '/payroll/runs/{payrollRun}/recalculate'
 */
recalculate.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return recalculate.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::recalculate
 * @see app/Http/Controllers/Tenant/PayrollController.php:320
 * @route '/payroll/runs/{payrollRun}/recalculate'
 */
recalculate.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recalculate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::recalculate
 * @see app/Http/Controllers/Tenant/PayrollController.php:320
 * @route '/payroll/runs/{payrollRun}/recalculate'
 */
    const recalculateForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recalculate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::recalculate
 * @see app/Http/Controllers/Tenant/PayrollController.php:320
 * @route '/payroll/runs/{payrollRun}/recalculate'
 */
        recalculateForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recalculate.url(args, options),
            method: 'post',
        })
    
    recalculate.form = recalculateForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::submitApproval
 * @see app/Http/Controllers/Tenant/PayrollController.php:390
 * @route '/payroll/runs/{payrollRun}/submit-approval'
 */
export const submitApproval = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitApproval.url(args, options),
    method: 'post',
})

submitApproval.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/submit-approval',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::submitApproval
 * @see app/Http/Controllers/Tenant/PayrollController.php:390
 * @route '/payroll/runs/{payrollRun}/submit-approval'
 */
submitApproval.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return submitApproval.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::submitApproval
 * @see app/Http/Controllers/Tenant/PayrollController.php:390
 * @route '/payroll/runs/{payrollRun}/submit-approval'
 */
submitApproval.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitApproval.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::submitApproval
 * @see app/Http/Controllers/Tenant/PayrollController.php:390
 * @route '/payroll/runs/{payrollRun}/submit-approval'
 */
    const submitApprovalForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitApproval.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::submitApproval
 * @see app/Http/Controllers/Tenant/PayrollController.php:390
 * @route '/payroll/runs/{payrollRun}/submit-approval'
 */
        submitApprovalForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitApproval.url(args, options),
            method: 'post',
        })
    
    submitApproval.form = submitApprovalForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::approve
 * @see app/Http/Controllers/Tenant/PayrollController.php:423
 * @route '/payroll/runs/{payrollRun}/approve'
 */
export const approve = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::approve
 * @see app/Http/Controllers/Tenant/PayrollController.php:423
 * @route '/payroll/runs/{payrollRun}/approve'
 */
approve.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::approve
 * @see app/Http/Controllers/Tenant/PayrollController.php:423
 * @route '/payroll/runs/{payrollRun}/approve'
 */
approve.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::approve
 * @see app/Http/Controllers/Tenant/PayrollController.php:423
 * @route '/payroll/runs/{payrollRun}/approve'
 */
    const approveForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::approve
 * @see app/Http/Controllers/Tenant/PayrollController.php:423
 * @route '/payroll/runs/{payrollRun}/approve'
 */
        approveForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::reject
 * @see app/Http/Controllers/Tenant/PayrollController.php:458
 * @route '/payroll/runs/{payrollRun}/reject'
 */
export const reject = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::reject
 * @see app/Http/Controllers/Tenant/PayrollController.php:458
 * @route '/payroll/runs/{payrollRun}/reject'
 */
reject.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::reject
 * @see app/Http/Controllers/Tenant/PayrollController.php:458
 * @route '/payroll/runs/{payrollRun}/reject'
 */
reject.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::reject
 * @see app/Http/Controllers/Tenant/PayrollController.php:458
 * @route '/payroll/runs/{payrollRun}/reject'
 */
    const rejectForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::reject
 * @see app/Http/Controllers/Tenant/PayrollController.php:458
 * @route '/payroll/runs/{payrollRun}/reject'
 */
        rejectForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:497
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
export const finalize = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

finalize.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:497
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
finalize.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return finalize.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:497
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
finalize.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:497
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
    const finalizeForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalize.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::finalize
 * @see app/Http/Controllers/Tenant/PayrollController.php:497
 * @route '/payroll/runs/{payrollRun}/finalize'
 */
        finalizeForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalize.url(args, options),
            method: 'post',
        })
    
    finalize.form = finalizeForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::requestVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:550
 * @route '/payroll/runs/{payrollRun}/request-void'
 */
export const requestVoid = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestVoid.url(args, options),
    method: 'post',
})

requestVoid.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/request-void',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::requestVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:550
 * @route '/payroll/runs/{payrollRun}/request-void'
 */
requestVoid.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return requestVoid.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::requestVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:550
 * @route '/payroll/runs/{payrollRun}/request-void'
 */
requestVoid.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestVoid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::requestVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:550
 * @route '/payroll/runs/{payrollRun}/request-void'
 */
    const requestVoidForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: requestVoid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::requestVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:550
 * @route '/payroll/runs/{payrollRun}/request-void'
 */
        requestVoidForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: requestVoid.url(args, options),
            method: 'post',
        })
    
    requestVoid.form = requestVoidForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::approveVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:589
 * @route '/payroll/runs/{payrollRun}/approve-void'
 */
export const approveVoid = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveVoid.url(args, options),
    method: 'post',
})

approveVoid.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/approve-void',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::approveVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:589
 * @route '/payroll/runs/{payrollRun}/approve-void'
 */
approveVoid.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return approveVoid.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::approveVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:589
 * @route '/payroll/runs/{payrollRun}/approve-void'
 */
approveVoid.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveVoid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::approveVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:589
 * @route '/payroll/runs/{payrollRun}/approve-void'
 */
    const approveVoidForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveVoid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::approveVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:589
 * @route '/payroll/runs/{payrollRun}/approve-void'
 */
        approveVoidForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveVoid.url(args, options),
            method: 'post',
        })
    
    approveVoid.form = approveVoidForm
/**
* @see \App\Http\Controllers\Tenant\PayrollController::rejectVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:641
 * @route '/payroll/runs/{payrollRun}/reject-void'
 */
export const rejectVoid = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectVoid.url(args, options),
    method: 'post',
})

rejectVoid.definition = {
    methods: ["post"],
    url: '/payroll/runs/{payrollRun}/reject-void',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::rejectVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:641
 * @route '/payroll/runs/{payrollRun}/reject-void'
 */
rejectVoid.url = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return rejectVoid.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::rejectVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:641
 * @route '/payroll/runs/{payrollRun}/reject-void'
 */
rejectVoid.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectVoid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::rejectVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:641
 * @route '/payroll/runs/{payrollRun}/reject-void'
 */
    const rejectVoidForm = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rejectVoid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::rejectVoid
 * @see app/Http/Controllers/Tenant/PayrollController.php:641
 * @route '/payroll/runs/{payrollRun}/reject-void'
 */
        rejectVoidForm.post = (args: { payrollRun: string | number | { id: string | number } } | [payrollRun: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rejectVoid.url(args, options),
            method: 'post',
        })
    
    rejectVoid.form = rejectVoidForm
const runs = {
    store: Object.assign(store, store),
show: Object.assign(show, show),
recalculate: Object.assign(recalculate, recalculate),
employees: Object.assign(employees, employees),
submitApproval: Object.assign(submitApproval, submitApproval),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
finalize: Object.assign(finalize, finalize),
requestVoid: Object.assign(requestVoid, requestVoid),
approveVoid: Object.assign(approveVoid, approveVoid),
rejectVoid: Object.assign(rejectVoid, rejectVoid),
}

export default runs