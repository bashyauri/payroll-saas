<?php

namespace App\Services\Authorization;

use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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

        $this->syncRoleOnUsersConnection($user, $applicationRole);
    }

    private function syncRoleOnUsersConnection(User $user, string $roleName): void
    {
        $connection = $user->getConnectionName();
        $modelMorphKey = config('permission.column_names.model_morph_key', 'model_id');
        $tableNames = config('permission.table_names');
        $rolesTable = $tableNames['roles'] ?? 'roles';
        $modelHasRolesTable = $tableNames['model_has_roles'] ?? 'model_has_roles';

        $roleModel = new Role;
        $roleModel->setConnection($connection);

        $role = $roleModel->newQuery()->firstOrCreate([
            'name' => $roleName,
            'guard_name' => 'web',
        ]);

        DB::connection($connection)
            ->table($modelHasRolesTable)
            ->where('model_type', User::class)
            ->where($modelMorphKey, $user->getKey())
            ->delete();

        DB::connection($connection)
            ->table($modelHasRolesTable)
            ->insert([
                'role_id' => $role->getKey(),
                'model_type' => User::class,
                $modelMorphKey => $user->getKey(),
            ]);
    }

    private function mapOrganizationRoleToPermissionRole(string $organizationRole): string
    {
        return match ($organizationRole) {
            OrganizationUser::ROLE_OWNER, OrganizationUser::ROLE_ADMIN => 'admin',
            OrganizationUser::ROLE_HR => 'hr',
            OrganizationUser::ROLE_MEMBER => 'staff',
            default => 'staff',
        };
    }
}
