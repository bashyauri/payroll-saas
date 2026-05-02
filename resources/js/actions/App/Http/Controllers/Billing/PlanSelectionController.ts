import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
const PlanSelectionController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PlanSelectionController.url(options),
    method: 'get',
})

PlanSelectionController.definition = {
    methods: ["get","head"],
    url: '/billing/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
PlanSelectionController.url = (options?: RouteQueryOptions) => {
    return PlanSelectionController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
PlanSelectionController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: PlanSelectionController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
PlanSelectionController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: PlanSelectionController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
    const PlanSelectionControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: PlanSelectionController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
        PlanSelectionControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PlanSelectionController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Billing\PlanSelectionController::__invoke
 * @see app/Http/Controllers/Billing/PlanSelectionController.php:16
 * @route '/billing/plans'
 */
        PlanSelectionControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: PlanSelectionController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    PlanSelectionController.form = PlanSelectionControllerForm
export default PlanSelectionController