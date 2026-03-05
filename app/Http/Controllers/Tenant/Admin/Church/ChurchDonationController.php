<?php

namespace App\Http\Controllers\Tenant\Admin\Church;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Church\ChurchDonation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ChurchDonationController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('donations.view');

        $query = ChurchDonation::with('bankAccount:id,bank_name,account_number')
            ->orderBy('created_at', 'desc');

        if ($request->filled('status') && in_array($request->status, ['pending', 'confirmed'], true)) {
            $query->where('status', $request->status);
        }

        $donations = $query->paginate(20)->withQueryString();

        return Inertia::render('Tenant/Admin/Donations/Index', [
            'donations' => $donations,
            'statusLabels' => [
                'pending' => 'Pendiente',
                'confirmed' => 'Confirmada',
            ],
        ]);
    }

    public function confirm(string $tenant, ChurchDonation $donation)
    {
        Gate::authorize('donations.update');

        $donation->update(['status' => ChurchDonation::STATUS_CONFIRMED]);

        return back()->with('success', 'Donación marcada como confirmada.');
    }
}
