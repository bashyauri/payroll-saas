<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class PayrollSetting extends Model
{
    use HasUlids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'profile',
        'basic_salary_percentage',
        'housing_allowance_percentage',
        'transport_allowance_percentage',
        'other_allowance_percentage',
        'salary_input_mode',
        'pension_employee_rate',
        'pension_employer_rate',
        'pension_contribution_base',
        'nhf_rate',
        'nhf_contribution_base',
        'nhis_employee_rate',
        'nhis_employer_rate',
        'nsitf_rate',
        'use_statutory_default_rates',
        'other_items',
        'enabled_deductions',
        'payroll_type',
        'payroll_month',
        'report_date',
        'project_name',
        'employer_tax_id',
        'employer_pension_id',
    ];

    protected $casts = [
        'basic_salary_percentage' => 'decimal:2',
        'housing_allowance_percentage' => 'decimal:2',
        'transport_allowance_percentage' => 'decimal:2',
        'other_allowance_percentage' => 'decimal:2',
        'salary_input_mode' => 'string',
        'pension_employee_rate' => 'decimal:2',
        'pension_employer_rate' => 'decimal:2',
        'pension_contribution_base' => 'string',
        'nhf_rate' => 'decimal:2',
        'nhf_contribution_base' => 'string',
        'nhis_employee_rate' => 'decimal:2',
        'nhis_employer_rate' => 'decimal:2',
        'nsitf_rate' => 'decimal:2',
        'use_statutory_default_rates' => 'boolean',
        'other_items' => 'array',
        'enabled_deductions' => 'array',
        'report_date' => 'date',
    ];
}
