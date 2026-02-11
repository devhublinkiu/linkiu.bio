<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Location;

class PublicController extends Controller
{
    /**
     * Display all active locations for the current tenant
     */
    public function locations(Request $request)
    {
        $tenant = app('currentTenant');

        $locations = Location::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderByRaw('is_main DESC') // Main location first
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Tenant/Public/Locations/Index', [
            'tenant' => $tenant,
            'locations' => $locations
        ]);
    }
}
