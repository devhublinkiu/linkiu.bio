<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\CategoryIcon;
use App\Models\IconRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IconRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $requests = IconRequest::with(['tenant.vertical', 'tenant.category'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('requested_name', 'like', "%{$search}%")
                        ->orWhereHas('tenant', function ($t) use ($search) {
                            $t->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->status, function ($query, $status) {
                if ($status !== 'all') {
                    $query->where('status', $status);
                }
            })
            ->orderByRaw("FIELD(status, 'pending', 'approved', 'rejected')")
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SuperAdmin/Support/Requests', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Approve the request (Update status only).
     */
    public function approve(Request $request, IconRequest $iconRequest)
    {
        $request->validate([
            'admin_feedback' => 'nullable|string|max:1000',
        ]);

        if ($iconRequest->status !== 'pending') {
            return back()->with('error', 'Esta solicitud ya ha sido procesada.');
        }

        $iconRequest->update([
            'status' => 'approved',
            'admin_feedback' => $request->admin_feedback,
        ]);

        // Dispatch Real-time Event (Bypasses Queue)
        \App\Events\IconRequestStatusUpdated::dispatch($iconRequest);

        // Notify Tenant Users (Owner or all users of that tenant)
        foreach ($iconRequest->tenant->users as $user) {
            $user->notify(new \App\Notifications\IconRequestStatusUpdatedNotification($iconRequest));
        }

        return back()->with('success', 'Solicitud aprobada.');
    }

    /**
     * Reject the request.
     */
    public function reject(Request $request, IconRequest $iconRequest)
    {
        $request->validate([
            'admin_feedback' => 'required|string|max:1000',
        ]);

        if ($iconRequest->status !== 'pending') {
            return back()->with('error', 'Esta solicitud ya ha sido procesada.');
        }

        $iconRequest->update([
            'status' => 'rejected',
            'admin_feedback' => $request->admin_feedback,
        ]);

        // Dispatch Real-time Event
        \App\Events\IconRequestStatusUpdated::dispatch($iconRequest);

        // Notify Tenant Users
        foreach ($iconRequest->tenant->users as $user) {
            $user->notify(new \App\Notifications\IconRequestStatusUpdatedNotification($iconRequest));
        }

        return back()->with('success', 'Solicitud rechazada.');
    }
}
