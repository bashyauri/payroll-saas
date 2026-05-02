<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var Organization $organization */
        $organization = tenant();

        $type = (string) $request->query('type', 'pension');

        return Inertia::render('reports/index', [
            'organization' => [
                'name' => $organization->name,
                'domain' => $organization->domains()->value('domain'),
            ],
            'activeType' => $type,
            'reportOptions' => [
                ['key' => 'pension', 'label' => 'Pension Schedule', 'href' => '/reports?type=pension'],
                ['key' => 'paye', 'label' => 'PAYE Remittance', 'href' => '/reports?type=paye'],
                ['key' => 'bank', 'label' => 'Bank Transfer Sheet', 'href' => '/reports?type=bank'],
                ['key' => 'nhf', 'label' => 'NHF Contribution', 'href' => '/reports?type=nhf'],
            ],
        ]);
    }
}
