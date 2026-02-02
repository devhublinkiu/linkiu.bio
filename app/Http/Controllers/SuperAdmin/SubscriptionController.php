<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('sa.permission:sa.subscriptions.view');
    }

    public function index(Request $request)
    {
        $subscriptions = Subscription::with(['tenant', 'plan'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('tenant', function ($q) use ($search) {
                    $q->where('id', 'like', "%{$search}%");
                    // Assuming tenant has a name or we search by ID for now as Tenant model details were scarce in previous views
                    // Ideally tenant has a 'name' or related user name. 
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SuperAdmin/Billing/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }
}
