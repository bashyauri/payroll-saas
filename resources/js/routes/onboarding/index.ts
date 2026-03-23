import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:15
 * @route '/onboarding/continue'
 */
export const continueMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: continueMethod.url(options),
    method: 'get',
})

continueMethod.definition = {
    methods: ["get","head"],
    url: '/onboarding/continue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:15
 * @route '/onboarding/continue'
 */
continueMethod.url = (options?: RouteQueryOptions) => {
    return continueMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:15
 * @route '/onboarding/continue'
 */
continueMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: continueMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:15
 * @route '/onboarding/continue'
 */
continueMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: continueMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:15
 * @route '/onboarding/continue'
 */
    const continueMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: continueMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:15
 * @route '/onboarding/continue'
 */
        continueMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: continueMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Onboarding\ContinueOnboardingController::__invoke
 * @see app/Http/Controllers/Onboarding/ContinueOnboardingController.php:15
 * @route '/onboarding/continue'
 */
        continueMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: continueMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    continueMethod.form = continueMethodForm
const onboarding = {
    continue: Object.assign(continueMethod, continueMethod),
}

export default onboarding