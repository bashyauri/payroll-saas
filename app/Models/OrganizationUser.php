<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

/**
 * Pivot model linking users to organizations with roles
 *
 * @property string $role owner|admin|member
 */
class OrganizationUser extends Model
{
    use CentralConnection, HasUlids;

    protected $table = 'organization_user';

    protected $fillable = ['user_id', 'organization_id', 'role'];

    public const ROLE_OWNER = 'owner';

    public const ROLE_ADMIN = 'admin';

    public const ROLE_HR = 'hr';

    public const ROLE_MEMBER = 'member';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function isOwner(): bool
    {
        return $this->role === self::ROLE_OWNER;
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_OWNER, self::ROLE_ADMIN]);
    }
}
