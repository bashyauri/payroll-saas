<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationProfileController extends Controller
{
    public function edit(): Response
    {
        /** @var Organization $organization */
        $organization = tenant();

        return Inertia::render('settings/organization', [
            'organization' => $organization->only(['name', 'address', 'phone', 'email', 'tax_id', 'website']),
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'website' => ['nullable', 'url', 'max:255'],
        ]);

        tenant()->update($validated);

        return back()->with('status', 'organization-profile-updated');
    }
}
