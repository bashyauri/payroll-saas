<?php

test('unknown tenant domain redirects to central onboarding instead of crashing', function () {
    $response = $this->get('http://missing-workspace.payrollsaas.test/settings/workspace');

    $response->assertRedirect('http://payroll-saas.test/onboarding/continue');
    $response->assertSessionHas('warning', 'We could not find that workspace URL. Please continue from your current workspace link.');
});
