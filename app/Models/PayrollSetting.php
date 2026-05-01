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
        'pension_employee_rate',
        'pension_employer_rate',
        'nhf_rate',
        'nhis_employee_rate',
        'nhis_employer_rate',
        'nsitf_rate',
        'other_items',
    ];

    protected $casts = [
        'basic_salary_percentage' => 'decimal:2',
        'housing_allowance_percentage' => 'decimal:2',
        'transport_allowance_percentage' => 'decimal:2',
        'other_allowance_percentage' => 'decimal:2',
        'pension_employee_rate' => 'decimal:2',
        'pension_employer_rate' => 'decimal:2',
        'nhf_rate' => 'decimal:2',
        'nhis_employee_rate' => 'decimal:2',
        'nhis_employer_rate' => 'decimal:2',
        'nsitf_rate' => 'decimal:2',
        'other_items' => 'array',
    ];
}
