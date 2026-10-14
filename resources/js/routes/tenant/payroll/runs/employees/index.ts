import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\PayrollController::update
 * @see app/Http/Controllers/Tenant/PayrollController.php:234
 * @route '/payroll/runs/{payrollRun}/employees/{employee}'
 */
export const update = (args: { payrollRun: string | { id: string }, employee: string | { id: string } } | [payrollRun: string | { id: string }, employee: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/payroll/runs/{payrollRun}/employees/{employee}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Tenant\PayrollController::update
 * @see app/Http/Controllers/Tenant/PayrollController.php:234
 * @route '/payroll/runs/{payrollRun}/employees/{employee}'
 */
update.url = (args: { payrollRun: string | { id: string }, employee: string | { id: string } } | [payrollRun: string | { id: string }, employee: string | { id: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    payrollRun: args[0],
                    employee: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payrollRun: typeof args.payrollRun === 'object'
                ? args.payrollRun.id
                : args.payrollRun,
                                employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return update.definition.url
            .replace('{payrollRun}', parsedArgs.payrollRun.toString())
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\PayrollController::update
 * @see app/Http/Controllers/Tenant/PayrollController.php:234
 * @route '/payroll/runs/{payrollRun}/employees/{employee}'
 */
update.patch = (args: { payrollRun: string | { id: string }, employee: string | { id: string } } | [payrollRun: string | { id: string }, employee: string | { id: string } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Tenant\PayrollController::update
 * @see app/Http/Controllers/Tenant/PayrollController.php:234
 * @route '/payroll/runs/{payrollRun}/employees/{employee}'
 */
    const updateForm = (args: { payrollRun: string | { id: string }, employee: string | { id: string } } | [payrollRun: string | { id: string }, employee: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\PayrollController::update
 * @see app/Http/Controllers/Tenant/PayrollController.php:234
 * @route '/payroll/runs/{payrollRun}/employees/{employee}'
 */
        updateForm.patch = (args: { payrollRun: string | { id: string }, employee: string | { id: string } } | [payrollRun: string | { id: string }, employee: string | { id: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const employees = {
    update: Object.assign(update, update),
}

export default employees