<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $tenant = app('currentTenant')->load(['latestSubscription.plan', 'vertical']);

        // Fetch plans for the same vertical OR public plans if no vertical set
        $plans = Plan::where('is_public', true)
            ->when($tenant->vertical_id, function ($query) use ($tenant) {
                return $query->where('vertical_id', $tenant->vertical_id);
            })
            ->get();

        return Inertia::render('Tenant/Admin/Dashboard', [
            'plans' => $plans,
        ]);
    }
}
