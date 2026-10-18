<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\OrganizationUser;
use App\Models\OrganizationInvitation;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationUsersController extends Controller
{
    private const ROLES = ['admin', 'hr', 'member', 'preparer', 'reviewer', 'authorizer', 'approver'];

    public function index(Request $request): Response
    {
        $organization = tenant();
        $members = $organization->users()->orderBy('name')->get()->map(fn ($user): array => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->pivot->role,
        ]);

        return Inertia::render('settings/users', [
            'members' => $members,
            'roles' => self::ROLES,
            'invitations' => OrganizationInvitation::query()
                ->where('organization_id', $organization->id)
                ->whereNull('accepted_at')
                ->where('expires_at', '>', now())
                ->orderByDesc('created_at')
                ->get(['id', 'email', 'role', 'expires_at'])
                ->map(fn ($invite): array => [
                    'id' => $invite->id,
                    'email' => $invite->email,
                    'role' => $invite->role,
                    'expiresAt' => $invite->expires_at->toDateString(),
                ]),
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'role' => ['required', Rule::in(self::ROLES)],
        ]);

        $organization = tenant();
        $email = mb_strtolower($validated['email']);
        $user = User::query()->whereRaw('LOWER(email) = ?', [$email])->first();

        if ($user) {
            if ($organization->users()->where('users.id', $user->id)->exists()) {
                return back()->withErrors(['email' => 'This user already belongs to the organization.']);
            }

            $organization->users()->attach($user->id, ['role' => $validated['role']]);

            return back()->with('status', 'organization-user-added');
        }

        $token = Str::random(64);
        $invitation = OrganizationInvitation::query()->firstOrNew([
            'organization_id' => $organization->id,
            'email' => $email,
            'accepted_at' => null,
        ]);
        $invitation->fill([
            'role' => $validated['role'],
            'token_hash' => hash('sha256', $token),
            'expires_at' => now()->addDays(7),
        ])->save();

        $centralDomain = (string) (config('tenancy.central_domains.0') ?? parse_url((string) config('app.url'), PHP_URL_HOST) ?? 'localhost');
        $scheme = app()->isProduction() ? 'https' : 'http';
        $inviteUrl = $scheme.'://'.$centralDomain.'/invitations/'.$token;
        Mail::raw("You have been invited to join {$organization->name} as {$validated['role']}. Accept the invitation and create your account here: {$inviteUrl}\n\nThis link expires in 7 days.", function ($message) use ($email, $organization): void {
            $message->to($email)->subject('Invitation to join '.$organization->name);
        });

        return back()->with('status', 'organization-invitation-sent');
    }

    public function update(Request $request, string $userId): RedirectResponse
    {
        $validated = $request->validate(['role' => ['required', Rule::in(self::ROLES)]]);
        $organization = tenant();
        $membership = $organization->users()->where('users.id', $userId)->firstOrFail();
        abort_if($membership->pivot->role === 'owner', 422, 'The organization owner role cannot be changed here.');
        $organization->users()->updateExistingPivot($userId, ['role' => $validated['role']]);

        return back()->with('status', 'organization-user-updated');
    }

    public function destroy(string $userId): RedirectResponse
    {
        $organization = tenant();
        $membership = $organization->users()->where('users.id', $userId)->firstOrFail();
        abort_if($membership->pivot->role === 'owner' || (string) $userId === (string) auth()->id(), 422, 'The owner and your own membership cannot be removed here.');
        $organization->users()->detach($userId);

        return back()->with('status', 'organization-user-removed');
    }
}
