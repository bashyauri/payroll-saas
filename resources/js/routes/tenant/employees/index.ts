import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\EmployeeController::index
 * @see app/Http/Controllers/Tenant/EmployeeController.php:22
 * @route '/employees'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::index
 * @see app/Http/Controllers/Tenant/EmployeeController.php:22
 * @route '/employees'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::index
 * @see app/Http/Controllers/Tenant/EmployeeController.php:22
 * @route '/employees'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\EmployeeController::index
 * @see app/Http/Controllers/Tenant/EmployeeController.php:22
 * @route '/employees'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\EmployeeController::index
 * @see app/Http/Controllers/Tenant/EmployeeController.php:22
 * @route '/employees'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\EmployeeController::index
 * @see app/Http/Controllers/Tenant/EmployeeController.php:22
 * @route '/employees'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\EmployeeController::index
 * @see app/Http/Controllers/Tenant/EmployeeController.php:22
 * @route '/employees'
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
* @see \App\Http\Controllers\Tenant\EmployeeController::create
 * @see app/Http/Controllers/Tenant/EmployeeController.php:54
 * @route '/employees/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employees/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::create
 * @see app/Http/Controllers/Tenant/EmployeeController.php:54
 * @route '/employees/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::create
 * @see app/Http/Controllers/Tenant/EmployeeController.php:54
 * @route '/employees/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\EmployeeController::create
 * @see app/Http/Controllers/Tenant/EmployeeController.php:54
 * @route '/employees/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\EmployeeController::create
 * @see app/Http/Controllers/Tenant/EmployeeController.php:54
 * @route '/employees/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\EmployeeController::create
 * @see app/Http/Controllers/Tenant/EmployeeController.php:54
 * @route '/employees/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\EmployeeController::create
 * @see app/Http/Controllers/Tenant/EmployeeController.php:54
 * @route '/employees/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Tenant\EmployeeController::store
 * @see app/Http/Controllers/Tenant/EmployeeController.php:121
 * @route '/employees'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::store
 * @see app/Http/Controllers/Tenant/EmployeeController.php:121
 * @route '/employees'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::store
 * @see app/Http/Controllers/Tenant/EmployeeController.php:121
 * @route '/employees'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Tenant\EmployeeController::store
 * @see app/Http/Controllers/Tenant/EmployeeController.php:121
 * @route '/employees'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Tenant\EmployeeController::store
 * @see app/Http/Controllers/Tenant/EmployeeController.php:121
 * @route '/employees'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Tenant\EmployeeController::show
 * @see app/Http/Controllers/Tenant/EmployeeController.php:70
 * @route '/employees/{employee}'
 */
export const show = (args: { employee: string | number | { id: string | number } } | [employee: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::show
 * @see app/Http/Controllers/Tenant/EmployeeController.php:70
 * @route '/employees/{employee}'
 */
show.url = (args: { employee: string | number | { id: string | number } } | [employee: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\EmployeeController::show
 * @see app/Http/Controllers/Tenant/EmployeeController.php:70
 * @route '/employees/{employee}'
 */
show.get = (args: { employee: string | number | { id: string | number } } | [employee: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\EmployeeController::show
 * @see app/Http/Controllers/Tenant/EmployeeController.php:70
 * @route '/employees/{employee}'
 */
show.head = (args: { employee: string | number | { id: string | number } } | [employee: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\EmployeeController::show
 * @see app/Http/Controllers/Tenant/EmployeeController.php:70
 * @route '/employees/{employee}'
 */
    const showForm = (args: { employee: string | number | { id: string | number } } | [employee: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\EmployeeController::show
 * @see app/Http/Controllers/Tenant/EmployeeController.php:70
 * @route '/employees/{employee}'
 */
        showForm.get = (args: { employee: string | number | { id: string | number } } | [employee: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\EmployeeController::show
 * @see app/Http/Controllers/Tenant/EmployeeController.php:70
 * @route '/employees/{employee}'
 */
        showForm.head = (args: { employee: string | number | { id: string | number } } | [employee: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const employees = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
}

export default employees