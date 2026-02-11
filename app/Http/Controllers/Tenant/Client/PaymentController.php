<?php

namespace App\Http\Controllers\Tenant\Client;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request, Tenant $tenant)
    {
        // For public checkout, we only return active methods
        $methods = $tenant->paymentMethods()
            ->where('is_active', true)
            ->get()
            ->map(function ($method) {
            return [
            'id' => $method->id,
            'type' => $method->type,
            'settings' => $method->settings,
            ];
        });

        // If bank transfer is active, include active bank accounts
        $bankTransferActive = $methods->contains('type', 'bank_transfer');
        $bankAccounts = [];

        if ($bankTransferActive) {
            $bankAccounts = $tenant->bankAccounts()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();
        }

        return response()->json([
            'methods' => $methods,
            'bank_accounts' => $bankAccounts,
        ]);
    }
}
