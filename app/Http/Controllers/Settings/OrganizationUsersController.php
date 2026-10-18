<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\OrganizationUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', Rule::exists(config('tenancy.database.central_connection').'.users', 'email')],
            'role' => ['required', Rule::in(self::ROLES)],
        ], ['email.exists' => 'This email must belong to an existing account before it can be added.']);

        $user = DB::connection(config('tenancy.database.central_connection'))
            ->table('users')->where('email', $validated['email'])->first();
        abort_unless($user, 422, 'User account not found.');

        $organization = tenant();
        $alreadyMember = $organization->users()->where('users.id', $user->id)->exists();
        if ($alreadyMember) {
            return back()->withErrors(['email' => 'This user already belongs to the organization.']);
        }

        $organization->users()->attach($user->id, ['role' => $validated['role']]);

        return back()->with('status', 'organization-user-added');
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
