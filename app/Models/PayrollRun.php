<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class PayrollRun extends Model
{
    use HasUlids;

    public const STATUS_DRAFT = 'draft';

    public const STATUS_FINALIZED = 'finalized';

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
        'finalized_at',
        'finalized_by_user_id',
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
            'finalized_at' => 'datetime',
        ];
    }
}
