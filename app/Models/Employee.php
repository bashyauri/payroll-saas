<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasUlids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'employee_number',
        'first_name',
        'last_name',
        'middle_name',
        'work_email',
        'phone',
        'nin',
        'bvn',
        'tax_identification_number',
        'pension_pin',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'monthly_gross_salary',
        'monthly_tax_deduction',
        'monthly_pension_deduction',
        'monthly_nhf_deduction',
        'other_monthly_deductions',
        'department',
        'job_title',
        'employment_type',
        'hire_date',
        'status',
    ];

    protected $casts = [
        'monthly_gross_salary' => 'decimal:2',
        'monthly_tax_deduction' => 'decimal:2',
        'monthly_pension_deduction' => 'decimal:2',
        'monthly_nhf_deduction' => 'decimal:2',
        'other_monthly_deductions' => 'decimal:2',
        'hire_date' => 'date',
    ];
}
