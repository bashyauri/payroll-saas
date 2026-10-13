<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class PayrollRun extends Model
{
    use HasUlids;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_PENDING_APPROVAL = 'pending_approval';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_FINALIZED = 'finalized';

    public const STATUS_VOID_REQUESTED = 'void_requested';

    public const STATUS_VOIDED = 'voided';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'period_month',
        'period_start',
        'period_end',
        'status',
        'employee_count',
        'total_gross_salary',
        'total_deductions',
        'total_net_pay',
        'settings_snapshot',
        'created_by_user_id',
        'submitted_at',
        'submitted_by_user_id',
        'approved_at',
        'approved_by_user_id',
        'approval_notes',
        'rejected_at',
        'rejected_by_user_id',
        'rejection_reason',
        'finalized_at',
        'finalized_by_user_id',
        'void_requested_at',
        'void_requested_by_user_id',
        'void_reason',
        'voided_at',
        'voided_by_user_id',
        'void_approval_notes',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'employee_count' => 'integer',
            'total_gross_salary' => 'decimal:2',
            'total_deductions' => 'decimal:2',
            'total_net_pay' => 'decimal:2',
            'settings_snapshot' => 'array',
            'submitted_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'finalized_at' => 'datetime',
            'void_requested_at' => 'datetime',
            'voided_at' => 'datetime',
        ];
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isPendingApproval(): bool
    {
        return $this->status === self::STATUS_PENDING_APPROVAL;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isFinalized(): bool
    {
        return $this->status === self::STATUS_FINALIZED;
    }

    public function isVoidRequested(): bool
    {
        return $this->status === self::STATUS_VOID_REQUESTED;
    }

    public function isVoided(): bool
    {
        return $this->status === self::STATUS_VOIDED;
    }

    public function canBeEdited(): bool
    {
        return $this->isDraft();
    }

    public function canBeSubmittedForApproval(): bool
    {
        return $this->isDraft();
    }

    public function canBeApproved(): bool
    {
        return $this->isPendingApproval();
    }

    public function canBeFinalized(): bool
    {
        return $this->isApproved();
    }

    public function canRequestVoid(): bool
    {
        return $this->isFinalized();
    }

    public function canApproveVoid(): bool
    {
        return $this->isVoidRequested() || $this->isFinalized();
    }
}
