<?php

namespace App\Http\Requests\Employee;

use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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

        $employee = $this->route('employee');
        
        // User can only update their own employee record
        return $employee && $employee->work_email === $user->email;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'phone' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:150'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.max' => 'Phone number must not exceed 20 characters.',
            'location.max' => 'Location must not exceed 150 characters.',
        ];
    }
}