<?php

namespace App\Services\Authorization;

use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\User;
use Spatie\Permission\Models\Role;

class OrganizationRoleSyncService
{
    /**
     * Sync the user's Spatie role for the active tenant based on organization pivot role.
     */
    public function syncForOrganizationUser(User $user, Organization $organization): void
    {
        if (! tenancy()->initialized || ! tenant() || tenant()->id !== $organization->id) {
            return;
        }

        $organizationRole = $user->organizations()
            ->whereKey($organization->id)
            ->value('organization_users.role');

        if (! is_string($organizationRole) || $organizationRole === '') {
            return;
        }

        $applicationRole = $this->mapOrganizationRoleToPermissionRole($organizationRole);

        if (! Role::query()->where('name', $applicationRole)->where('guard_name', 'web')->exists()) {
            return;
        }

        $user->syncRoles([$applicationRole]);
    }

    private function mapOrganizationRoleToPermissionRole(string $organizationRole): string
    {
        return match ($organizationRole) {
            OrganizationUser::ROLE_OWNER, OrganizationUser::ROLE_ADMIN => 'admin',
            OrganizationUser::ROLE_MEMBER => 'staff',
            default => 'staff',
        };
    }
}
