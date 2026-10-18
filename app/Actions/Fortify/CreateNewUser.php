<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Http\Controllers\OrganizationInvitationController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'invitation' => ['nullable', 'string', 'max:100'],
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);

            if (! empty($input['invitation'])) {
                $invitation = OrganizationInvitationController::findInvitation((string) $input['invitation']);
                Validator::make(['invitation' => $input['invitation']], [
                    'invitation' => [function ($attribute, $value, $fail) use ($invitation, $input): void {
                        if (! $invitation || $invitation->expires_at->isPast() || mb_strtolower($invitation->email) !== mb_strtolower($input['email'])) {
                            $fail('This organization invitation is invalid, expired, or was sent to another email address.');
                        }
                    }],
                ])->validate();

                $invitation->organization->users()->syncWithoutDetaching([
                    $user->id => ['role' => $invitation->role],
                ]);
                $invitation->update(['accepted_at' => now()]);
                session(['tenant_id' => $invitation->organization_id]);
            }

            return $user;
        });
    }
}
