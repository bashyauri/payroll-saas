<?php

namespace App\Http\Requests\Tenant;

use App\Models\Employee;
use App\Models\OrganizationUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user || ! tenancy()->initialized || ! tenancy()->tenant) {
            return false;
        }

        if (in_array((string) tenancy()->tenant->billing_status, ['canceled', 'suspended'], true)) {
            return false;
        }

        return $user->organizations()
            ->whereKey(tenancy()->tenant->id)
            ->wherePivotIn('role', [
                OrganizationUser::ROLE_OWNER,
                OrganizationUser::ROLE_ADMIN,
                OrganizationUser::ROLE_HR,
            ])
            ->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Employee $employee */
        $employee = $this->route('employee');

        return [
            'employee_number' => ['required', 'string', 'max:50', Rule::unique('employees', 'employee_number')->ignore($employee->id)],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'work_email' => ['nullable', 'email', 'max:150', Rule::unique('employees', 'work_email')->ignore($employee->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'nin' => ['nullable', 'digits:11', Rule::unique('employees', 'nin')->ignore($employee->id)],
            'bvn' => ['nullable', 'digits:11', Rule::unique('employees', 'bvn')->ignore($employee->id)],
            'tax_identification_number' => ['nullable', 'string', 'max:50'],
            'pension_pin' => ['nullable', 'string', 'max:50'],
            'pfa_name' => ['nullable', 'string', 'max:150'],
            'nhis_number' => ['nullable', 'string', 'max:50'],
            'nhf_number' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['required', 'string', 'max:150'],
            'bank_account_name' => ['required', 'string', 'max:150'],
            'bank_account_number' => ['required', 'digits:10'],
            'monthly_gross_salary' => ['required', 'numeric', 'min:0'],
            'annual_gross_salary' => ['nullable', 'numeric', 'min:0'],
            'salary_input_mode' => ['nullable', 'string', 'in:gross,salary_elements'],
            'monthly_tax_deduction' => ['nullable', 'numeric', 'min:0'],
            'apply_paye_deduction' => ['nullable', 'boolean'],
            'monthly_pension_deduction' => ['nullable', 'numeric', 'min:0'],
            'apply_pension_deduction' => ['nullable', 'boolean'],
            'monthly_nhf_deduction' => ['nullable', 'numeric', 'min:0'],
            'apply_nhf_deduction' => ['nullable', 'boolean'],
            'other_monthly_deductions' => ['nullable', 'numeric', 'min:0'],
            'other_allowance_1' => ['nullable', 'numeric', 'min:0'],
            'other_allowance_2' => ['nullable', 'numeric', 'min:0'],
            'total_salary' => ['nullable', 'numeric', 'min:0'],
            'personal_life_insurance' => ['nullable', 'numeric', 'min:0'],
            'rent_relief' => ['nullable', 'numeric', 'min:0'],
            'custom_items' => ['nullable', 'array', 'max:5'],
            'custom_items.*.label' => ['nullable', 'string', 'max:100'],
            'custom_items.*.category' => ['nullable', 'string', 'in:allowance,deduction'],
            'custom_items.*.rate' => ['nullable', 'numeric', 'between:0,100'],
            'custom_items.*.value' => ['nullable', 'numeric', 'min:0'],
            'department' => ['nullable', 'string', 'max:100'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'location' => ['nullable', 'string', 'max:150'],
            'date_of_birth' => ['nullable', 'date'],
            'employment_type' => ['required', 'string', 'in:full_time,part_time,contract,temporary,intern'],
            'hire_date' => ['nullable', 'date'],
            'exit_date' => ['nullable', 'date', 'after_or_equal:hire_date'],
            'status' => ['required', 'string', 'in:active,inactive'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nin.digits' => 'NIN must be exactly 11 digits.',
            'bvn.digits' => 'BVN must be exactly 11 digits.',
            'bank_account_number.digits' => 'Bank account number must be exactly 10 digits.',
            'custom_items.max' => 'You can only submit up to 5 custom payroll fields.',
        ];
    }
}
