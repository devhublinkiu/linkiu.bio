<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Tenant\Locations\Location;

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
            ->orderByRaw('is_main DESC')
            ->orderBy('name', 'asc')
            ->get([
                'id', 'name', 'description', 'is_main', 'phone', 'whatsapp', 'whatsapp_message',
                'state', 'city', 'address', 'latitude', 'longitude', 'opening_hours', 'social_networks', 'is_active',
            ]);

        return Inertia::render('Tenant/Public/Locations/Index', [
            'tenant' => $tenant,
            'locations' => $locations,
            'selected_location_id' => session('selected_location_id'),
        ]);
    }
}
