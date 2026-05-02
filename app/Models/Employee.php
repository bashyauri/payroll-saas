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
        'pfa_name',
        'nhis_number',
        'nhf_number',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'monthly_gross_salary',
        'annual_gross_salary',
        'monthly_tax_deduction',
        'monthly_pension_deduction',
        'monthly_nhf_deduction',
        'other_monthly_deductions',
        'other_allowance_1',
        'other_allowance_2',
        'total_salary',
        'personal_life_insurance',
        'rent_relief',
        'custom_items',
        'department',
        'job_title',
        'location',
        'date_of_birth',
        'employment_type',
        'hire_date',
        'exit_date',
        'status',
    ];

    protected $casts = [
        'monthly_gross_salary' => 'decimal:2',
        'annual_gross_salary' => 'decimal:2',
        'monthly_tax_deduction' => 'decimal:2',
        'monthly_pension_deduction' => 'decimal:2',
        'monthly_nhf_deduction' => 'decimal:2',
        'other_monthly_deductions' => 'decimal:2',
        'other_allowance_1' => 'decimal:2',
        'other_allowance_2' => 'decimal:2',
        'total_salary' => 'decimal:2',
        'personal_life_insurance' => 'decimal:2',
        'rent_relief' => 'decimal:2',
        'custom_items' => 'array',
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'exit_date' => 'date',
    ];
}
