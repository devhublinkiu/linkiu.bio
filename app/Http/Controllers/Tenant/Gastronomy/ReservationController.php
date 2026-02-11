<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Gastronomy\Reservation;
use App\Models\Tenant\Gastronomy\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    /**
     * Display the public booking form.
     */
    public function index()
    {
        $tenant = app('currentTenant');
        $locations = \App\Models\Location::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();

        // Eager load bank accounts
        // Fetch Payment Methods (Bank Transfer) and map to BankAccount structure
        $paymentMethods = \App\Models\TenantPaymentMethod::where('tenant_id', $tenant->id)
            ->where('type', 'bank_transfer')
            ->where('is_active', true)
            ->get();

        $mappedMethods = $paymentMethods->map(function ($pm) {
            $settings = $pm->settings ?? [];
            return [
            'id' => 'pm_' . $pm->id,
            'bank_name' => $settings['bank_name'] ?? 'Banco',
            'account_type' => $settings['account_type'] ?? 'Cuenta',
            'account_number' => $settings['account_number'] ?? '',
            'account_holder' => $settings['owner_name'] ?? '',
            'sort_order' => 0,
            ];
        });

        // Fetch Legacy Bank Accounts
        $bankAccounts = \App\Models\TenantBankAccount::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        // Merge both sources
        $allBankAccounts = $mappedMethods->merge($bankAccounts);

        return Inertia::render('Tenant/Gastronomy/Public/Reservations/Index', [
            'tenant' => $tenant,
            'locations' => $locations,
            'bankAccounts' => $allBankAccounts,
            // 'bankAccounts' => $tenant->bankAccounts // passed inside tenant or separate, checking model tenant has bankAccounts rel.
        ]);
    }

    /**
     * Store a newly created reservation in storage.
     */
    public function store(Request $request, \App\Services\InfobipService $infobip)
    {
        $tenant = app('currentTenant');

        // Sanitize phone: remove non-numeric characters and ensure country code
        if ($request->has('customer_phone')) {
            $phone = preg_replace('/[^0-9]/', '', $request->customer_phone);

            // If it's a 10-digit number (Col mobile), prepend 57
            if (strlen($phone) === 10) {
                $phone = '57' . $phone;
            }

            $request->merge(['customer_phone' => $phone]);
        }

        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'reservation_date' => 'required|date', // Relaxed for TZ edge cases
            'reservation_time' => 'required',
            'party_size' => 'required|integer|min:1',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:30', // Increased
            'customer_email' => 'nullable|email|max:255',
            'notes' => 'nullable|string',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        // Check if proof is required by location settings
        $location = \App\Models\Location::where('tenant_id', $tenant->id)->findOrFail($validated['location_id']);
        if ($location->reservation_payment_proof_required && !$request->hasFile('payment_proof')) {
            return redirect()->back()->withErrors(['payment_proof' => 'El comprobante de pago es obligatorio para esta sede.']);
        }

        try {
            DB::beginTransaction();

            // Handle file upload
            $paymentProofPath = null;
            if ($request->hasFile('payment_proof')) {
                $paymentProofPath = $request->file('payment_proof')->store('reservation_proofs', 'public');
            }

            // 1. Find or Create Customer
            $customer = Customer::firstOrCreate(
            [
                'phone' => $validated['customer_phone'],
                'tenant_id' => $tenant->id
            ],
            [
                'name' => $validated['customer_name'],
                'email' => $validated['customer_email'],
            ]
            );

            // 2. Create Reservation
            $reservation = Reservation::create([
                'tenant_id' => $tenant->id,
                'location_id' => $validated['location_id'],
                'customer_id' => $customer->id,
                'reservation_date' => $validated['reservation_date'],
                'reservation_time' => $validated['reservation_time'],
                'party_size' => $validated['party_size'],
                'status' => 'pending', // Pending approval by default
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'customer_email' => $validated['customer_email'],
                'notes' => $validated['notes'],
                'payment_proof' => $paymentProofPath,
            ]);


            // 3. Send WhatsApp Notifications
            $formattedDate = \Carbon\Carbon::parse($validated['reservation_date'])->format('d/m/Y');

            // A. Notify Customer (Pending Confirmation)
            // Template: linkiu_confirmed_v1 
            // Vars: {{1}} Name, {{2}} Tenant, {{3}} Date, {{4}} Time
            $infobip->sendTemplate(
                $validated['customer_phone'],
                'linkiu_confirmed_v1',
            [
                $validated['customer_name'],
                $tenant->name,
                $formattedDate,
                $validated['reservation_time']
            ],
                "{$tenant->slug}/sedes" // Button param
            );

            // B. Notify Admin (New Reservation Alert)
            // Template: linkiu_alert_v1
            // Vars: {{1}} Client, {{2}} Date, {{3}} Quantity
            if ($tenant->contact_phone) {
                $infobip->sendTemplate(
                    $tenant->contact_phone,
                    'linkiu_alert_v1',
                [
                    $validated['customer_name'],
                    $formattedDate,
                    $validated['party_size']
                ],
                    null // No button
                );
            }
            // 4. Dispatch Real-Time Event (Socket)
            \App\Events\ReservationCreated::dispatch($reservation);

            // 5. Send Database Notification to Admin (Bell)
            $adminUser = $tenant->users()->where('role', 'admin')->first() ?? $tenant->users()->first();
            if ($adminUser) {
                $adminUser->notify(new \App\Notifications\NewReservationNotification($reservation));
            }

            DB::commit();

            // Return JSON for frontend step handling
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Solicitud recibida',
                    'reservation' => $reservation
                ]);
            }

            return redirect()->back()->with('success', 'Solicitud de reserva recibida. Te confirmaremos pronto por WhatsApp.');

        }
        catch (\Exception $e) {
            DB::rollBack();
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
            }
            return redirect()->back()->withErrors(['message' => 'Error al procesar la reserva: ' . $e->getMessage()]);
        }
    }
}
