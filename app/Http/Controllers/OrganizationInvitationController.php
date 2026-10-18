<?php

namespace App\Http\Controllers;

use App\Models\OrganizationInvitation;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class OrganizationInvitationController extends Controller
{
    public function __invoke(Request $request, string $token): Response
    {
        $invitation = self::findInvitation($token);

        if (! $invitation || $invitation->expires_at->isPast()) {
            abort(404, 'This invitation has expired or is no longer valid.');
        }

        if (! $request->user()) {
            return Inertia::location('/register?invitation='.urlencode($token));
        }

        $user = $request->user();
        abort_unless(mb_strtolower($user->email) === mb_strtolower($invitation->email), 403, 'Sign in with the email address this invitation was sent to.');

        $organization = $invitation->organization;
        if (! $organization->users()->where('users.id', $user->id)->exists()) {
            $organization->users()->attach($user->id, ['role' => $invitation->role]);
        }
        $invitation->update(['accepted_at' => now()]);

        $domain = $organization->domains()->value('domain');
        abort_unless($domain, 404, 'The invited workspace is unavailable.');
        $request->session()->put('tenant_id', $organization->id);
        $url = ($request->isSecure() ? 'https://' : 'http://').$domain.'/dashboard';

        return Inertia::location($url);
    }

    public static function findInvitation(string $token): ?OrganizationInvitation
    {
        return OrganizationInvitation::query()
            ->with('organization.domains')
            ->where('token_hash', hash('sha256', $token))
            ->whereNull('accepted_at')
            ->first();
    }
}
