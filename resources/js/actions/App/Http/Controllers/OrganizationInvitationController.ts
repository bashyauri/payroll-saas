import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationInvitationController::__invoke
 * @see app/Http/Controllers/OrganizationInvitationController.php:13
 * @route '/invitations/{token}'
 */
const OrganizationInvitationController = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OrganizationInvitationController.url(args, options),
    method: 'get',
})

OrganizationInvitationController.definition = {
    methods: ["get","head"],
    url: '/invitations/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationInvitationController::__invoke
 * @see app/Http/Controllers/OrganizationInvitationController.php:13
 * @route '/invitations/{token}'
 */
OrganizationInvitationController.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return OrganizationInvitationController.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationInvitationController::__invoke
 * @see app/Http/Controllers/OrganizationInvitationController.php:13
 * @route '/invitations/{token}'
 */
OrganizationInvitationController.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OrganizationInvitationController.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationInvitationController::__invoke
 * @see app/Http/Controllers/OrganizationInvitationController.php:13
 * @route '/invitations/{token}'
 */
OrganizationInvitationController.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: OrganizationInvitationController.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationInvitationController::__invoke
 * @see app/Http/Controllers/OrganizationInvitationController.php:13
 * @route '/invitations/{token}'
 */
    const OrganizationInvitationControllerForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: OrganizationInvitationController.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationInvitationController::__invoke
 * @see app/Http/Controllers/OrganizationInvitationController.php:13
 * @route '/invitations/{token}'
 */
        OrganizationInvitationControllerForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: OrganizationInvitationController.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationInvitationController::__invoke
 * @see app/Http/Controllers/OrganizationInvitationController.php:13
 * @route '/invitations/{token}'
 */
        OrganizationInvitationControllerForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: OrganizationInvitationController.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    OrganizationInvitationController.form = OrganizationInvitationControllerForm
export default OrganizationInvitationController