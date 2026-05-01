<?php

namespace App\Http\Requests\Tenant;

use App\Models\OrganizationUser;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
        return [
            'employee_number' => ['required', 'string', 'max:50', 'unique:employees,employee_number'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'work_email' => ['nullable', 'email', 'max:150', 'unique:employees,work_email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'nin' => ['nullable', 'digits:11', 'unique:employees,nin'],
            'bvn' => ['nullable', 'digits:11', 'unique:employees,bvn'],
            'tax_identification_number' => ['nullable', 'string', 'max:50'],
            'pension_pin' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['required', 'string', 'max:150'],
            'bank_account_name' => ['required', 'string', 'max:150'],
            'bank_account_number' => ['required', 'digits:10'],
            'monthly_gross_salary' => ['required', 'numeric', 'min:0'],
            'monthly_tax_deduction' => ['nullable', 'numeric', 'min:0'],
            'monthly_pension_deduction' => ['nullable', 'numeric', 'min:0'],
            'monthly_nhf_deduction' => ['nullable', 'numeric', 'min:0'],
            'other_monthly_deductions' => ['nullable', 'numeric', 'min:0'],
            'department' => ['nullable', 'string', 'max:100'],
            'job_title' => ['nullable', 'string', 'max:100'],
            'employment_type' => ['required', 'string', 'in:full_time,part_time,contract,temporary,intern'],
            'hire_date' => ['nullable', 'date'],
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
        ];
    }
}
