<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayrollSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user) {
            return false;
        }

        return $user->can('tenant.manage-payroll-settings');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'basic_salary_percentage' => ['required', 'numeric', 'between:0,100'],
            'housing_allowance_percentage' => ['required', 'numeric', 'between:0,100'],
            'transport_allowance_percentage' => ['required', 'numeric', 'between:0,100'],
            'other_allowance_percentage' => ['required', 'numeric', 'between:0,100'],
            'pension_employee_rate' => ['required', 'numeric', 'between:0,100'],
            'pension_employer_rate' => ['required', 'numeric', 'between:0,100'],
            'nhf_rate' => ['required', 'numeric', 'between:0,100'],
            'nhis_employee_rate' => ['required', 'numeric', 'between:0,100'],
            'nhis_employer_rate' => ['required', 'numeric', 'between:0,100'],
            'nsitf_rate' => ['required', 'numeric', 'between:0,100'],
            'other_items' => ['nullable', 'array', 'max:5'],
            'other_items.*.label' => ['nullable', 'string', 'max:100'],
            'other_items.*.rate' => ['nullable', 'numeric', 'between:0,100'],
            'enabled_deductions' => ['nullable', 'array'],
            'enabled_deductions.*' => ['string', 'in:pension,nhf,nhis,nsitf,paye'],
            'effective_from' => ['nullable', 'date_format:Y-m-d'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'basic_salary_percentage.between' => 'Basic salary percentage must be between 0 and 100.',
            'housing_allowance_percentage.between' => 'Housing allowance percentage must be between 0 and 100.',
            'transport_allowance_percentage.between' => 'Transport allowance percentage must be between 0 and 100.',
            'other_allowance_percentage.between' => 'Other allowance percentage must be between 0 and 100.',
            'pension_employee_rate.between' => 'Employee pension rate must be between 0 and 100.',
            'pension_employer_rate.between' => 'Employer pension rate must be between 0 and 100.',
            'nhf_rate.between' => 'NHF rate must be between 0 and 100.',
            'nhis_employee_rate.between' => 'Employee NHIS rate must be between 0 and 100.',
            'nhis_employer_rate.between' => 'Employer NHIS rate must be between 0 and 100.',
            'nsitf_rate.between' => 'NSITF rate must be between 0 and 100.',
            'other_items.max' => 'You can only configure up to 5 custom deduction items.',
        ];
    }
}
