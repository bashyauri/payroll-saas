import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:28
 * @route '/reports'
 */
const ReportsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReportsController.url(options),
    method: 'get',
})

ReportsController.definition = {
    methods: ["get","head"],
    url: '/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:28
 * @route '/reports'
 */
ReportsController.url = (options?: RouteQueryOptions) => {
    return ReportsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:28
 * @route '/reports'
 */
ReportsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ReportsController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:28
 * @route '/reports'
 */
ReportsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ReportsController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:28
 * @route '/reports'
 */
    const ReportsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ReportsController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:28
 * @route '/reports'
 */
        ReportsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReportsController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::__invoke
 * @see app/Http/Controllers/Tenant/ReportsController.php:28
 * @route '/reports'
 */
        ReportsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ReportsController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ReportsController.form = ReportsControllerForm
/**
* @see \App\Http\Controllers\Tenant\ReportsController::view
 * @see app/Http/Controllers/Tenant/ReportsController.php:140
 * @route '/reports/view'
 */
export const view = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/reports/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\ReportsController::view
 * @see app/Http/Controllers/Tenant/ReportsController.php:140
 * @route '/reports/view'
 */
view.url = (options?: RouteQueryOptions) => {
    return view.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::view
 * @see app/Http/Controllers/Tenant/ReportsController.php:140
 * @route '/reports/view'
 */
view.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::view
 * @see app/Http/Controllers/Tenant/ReportsController.php:140
 * @route '/reports/view'
 */
view.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::view
 * @see app/Http/Controllers/Tenant/ReportsController.php:140
 * @route '/reports/view'
 */
    const viewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::view
 * @see app/Http/Controllers/Tenant/ReportsController.php:140
 * @route '/reports/view'
 */
        viewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::view
 * @see app/Http/Controllers/Tenant/ReportsController.php:140
 * @route '/reports/view'
 */
        viewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:186
 * @route '/reports/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/reports/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:186
 * @route '/reports/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:186
 * @route '/reports/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:186
 * @route '/reports/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:186
 * @route '/reports/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:186
 * @route '/reports/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportMethod
 * @see app/Http/Controllers/Tenant/ReportsController.php:186
 * @route '/reports/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportPdf
 * @see app/Http/Controllers/Tenant/ReportsController.php:226
 * @route '/reports/export-pdf'
 */
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/reports/export-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportPdf
 * @see app/Http/Controllers/Tenant/ReportsController.php:226
 * @route '/reports/export-pdf'
 */
exportPdf.url = (options?: RouteQueryOptions) => {
    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportPdf
 * @see app/Http/Controllers/Tenant/ReportsController.php:226
 * @route '/reports/export-pdf'
 */
exportPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportPdf
 * @see app/Http/Controllers/Tenant/ReportsController.php:226
 * @route '/reports/export-pdf'
 */
exportPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportPdf
 * @see app/Http/Controllers/Tenant/ReportsController.php:226
 * @route '/reports/export-pdf'
 */
    const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportPdf
 * @see app/Http/Controllers/Tenant/ReportsController.php:226
 * @route '/reports/export-pdf'
 */
        exportPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportPdf
 * @see app/Http/Controllers/Tenant/ReportsController.php:226
 * @route '/reports/export-pdf'
 */
        exportPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPdf.form = exportPdfForm
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportExcel
 * @see app/Http/Controllers/Tenant/ReportsController.php:274
 * @route '/reports/export-excel'
 */
export const exportExcel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})

exportExcel.definition = {
    methods: ["get","head"],
    url: '/reports/export-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportExcel
 * @see app/Http/Controllers/Tenant/ReportsController.php:274
 * @route '/reports/export-excel'
 */
exportExcel.url = (options?: RouteQueryOptions) => {
    return exportExcel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportExcel
 * @see app/Http/Controllers/Tenant/ReportsController.php:274
 * @route '/reports/export-excel'
 */
exportExcel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportExcel.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Tenant\ReportsController::exportExcel
 * @see app/Http/Controllers/Tenant/ReportsController.php:274
 * @route '/reports/export-excel'
 */
exportExcel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportExcel.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportExcel
 * @see app/Http/Controllers/Tenant/ReportsController.php:274
 * @route '/reports/export-excel'
 */
    const exportExcelForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportExcel.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportExcel
 * @see app/Http/Controllers/Tenant/ReportsController.php:274
 * @route '/reports/export-excel'
 */
        exportExcelForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportExcel.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Tenant\ReportsController::exportExcel
 * @see app/Http/Controllers/Tenant/ReportsController.php:274
 * @route '/reports/export-excel'
 */
        exportExcelForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportExcel.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportExcel.form = exportExcelForm
ReportsController.view = view
ReportsController.exportMethod = exportMethod
ReportsController.exportPdf = exportPdf
ReportsController.exportExcel = exportExcel

export default ReportsController