import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:18
 * @route '/onboarding/continue'
 */
const ContinueOnboardingController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ContinueOnboardingController.url(options),
    method: 'get',
})

ContinueOnboardingController.definition = {
    methods: ["get","head"],
    url: '/onboarding/continue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:18
 * @route '/onboarding/continue'
 */
ContinueOnboardingController.url = (options?: RouteQueryOptions) => {
    return ContinueOnboardingController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:18
 * @route '/onboarding/continue'
 */
ContinueOnboardingController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ContinueOnboardingController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:18
 * @route '/onboarding/continue'
 */
ContinueOnboardingController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ContinueOnboardingController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:18
 * @route '/onboarding/continue'
 */
    const ContinueOnboardingControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ContinueOnboardingController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:18
 * @route '/onboarding/continue'
 */
        ContinueOnboardingControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ContinueOnboardingController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:18
 * @route '/onboarding/continue'
 */
        ContinueOnboardingControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ContinueOnboardingController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ContinueOnboardingController.form = ContinueOnboardingControllerForm
export default ContinueOnboardingController