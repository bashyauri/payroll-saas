<?php

namespace App\Http\Requests\Settings;

use App\Models\OrganizationUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubdomainRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user) {
            return false;
        }

        if (tenancy()->initialized && tenancy()->tenant) {
            return $user->organizations()
                ->whereKey(tenancy()->tenant->id)
                ->wherePivotIn('role', [
                    OrganizationUser::ROLE_OWNER,
                    OrganizationUser::ROLE_ADMIN,
                ])
                ->exists();
        }

        $sessionOrgId = (string) $this->session()->get('tenant_id', '');

        if ($sessionOrgId === '') {
            return false;
        }

        return $user->organizations()
            ->whereKey($sessionOrgId)
            ->wherePivotIn('role', [
                OrganizationUser::ROLE_OWNER,
                OrganizationUser::ROLE_ADMIN,
            ])
            ->exists();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'subdomain' => [
                'required',
                'string',
                'min:3',
                'max:63',
                'regex:/^[a-z0-9][a-z0-9\-]*[a-z0-9]$/',
                Rule::notIn([
                    'www', 'mail', 'ftp', 'smtp', 'pop', 'imap',
                    'admin', 'administrator', 'api', 'app',
                    'billing', 'dashboard', 'static', 'cdn', 'assets',
                    'test', 'dev', 'staging', 'sandbox', 'demo',
                ]),
                Rule::unique('tenants', 'slug')->ignore($this->resolveCurrentOrgId()),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'subdomain.regex' => 'Subdomain must start and end with a letter or number, and may only contain lowercase letters, numbers, and hyphens.',
            'subdomain.not_in' => 'This subdomain name is reserved. Please choose a different one.',
            'subdomain.unique' => 'This subdomain is already taken. Please choose a different one.',
        ];
    }

    private function resolveCurrentOrgId(): ?string
    {
        $user = $this->user();

        if (! $user) {
            return null;
        }

        if (tenancy()->initialized) {
            return tenancy()->tenant?->id;
        }

        $sessionOrgId = (string) $this->session()->get('tenant_id', '');

        if ($sessionOrgId !== '') {
            $org = $user->organizations()->whereKey($sessionOrgId)->first();

            if ($org) {
                return $org->id;
            }
        }

        return null;
    }
}
