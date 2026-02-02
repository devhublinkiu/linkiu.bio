<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\BusinessCategory;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vertical;
use App\Models\Subscription;
use App\Models\Invoice;
use App\Notifications\TenantCreatedNotification;
use App\Notifications\InvoiceGeneratedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function __construct()
    {
        $this->middleware('sa.permission:sa.tenants.view')->only(['index', 'show']);
        $this->middleware('sa.permission:sa.tenants.create')->only(['create', 'store']);
    }

    public function index(Request $request)
    {
        $tenants = Tenant::with(['category.vertical'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('doc_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SuperAdmin/Tenants/Index', [
            'tenants' => $tenants,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/Tenants/Create', [
            'verticals' => Vertical::with('categories')->get(),
            'plans' => Plan::where('is_public', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        // Pre-fill slug if plan forbids custom slug to pass validation
        if ($request->has('plan_id') && $request->has('tenant_name')) {
            $plan = Plan::find($request->plan_id);
            if ($plan && !$plan->allow_custom_slug) {
                // Generate slug by mixing random chars into the name
                // Example: 'linkiuecomm' -> 'le34@omm' (random chars replace middle section)
                $baseSlug = Str::slug($request->tenant_name);
                $length = strlen($baseSlug);

                if ($length > 6) {
                    // Keep first 2 chars, replace middle with random, keep last 3-4 chars
                    $start = substr($baseSlug, 0, 2);
                    $end = substr($baseSlug, -4);
                    $randomMiddle = Str::lower(Str::random(4));
                    $generatedSlug = $start . $randomMiddle . $end;
                } else {
                    // For short names, just add random suffix
                    $generatedSlug = $baseSlug . Str::lower(Str::random(3));
                }

                $request->merge(['slug' => $generatedSlug]);
            }
        }

        $validated = $request->validate([
            // Step 1
            'vertical_id' => 'required|exists:verticals,id',
            'category_id' => 'required|exists:business_categories,id',
            // Step 2
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,quarterly,semiannual,yearly',
            // Step 3 (Owner)
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|unique:users,email',
            'owner_doc_type' => 'required|in:CC,CE,PAS',
            'owner_doc_number' => 'required|string|max:20',
            'owner_phone' => 'nullable|string|max:20',
            'owner_address' => 'required|string|max:255',
            'owner_country' => 'required|string|max:100',
            'owner_state' => 'required|string|max:100',
            'owner_city' => 'required|string|max:100',
            'owner_password' => 'required|string|min:8',
            // Step 4 (Tenant Business)
            'tenant_name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug|alpha_dash',
            'regime' => 'required|in:comun,simple,especial',
            'tenant_doc_type' => 'required|in:NIT,RUT',
            'tenant_doc_number' => 'required|string|max:50',
            'tenant_contact_email' => 'required|email|max:255',
            'tenant_address' => 'required|string|max:255',
            'tenant_state' => 'required|string|max:100',
            'tenant_city' => 'required|string|max:100',
            'use_owner_address' => 'boolean',
            'verification_digit' => 'nullable|string|max:1',
        ], [
            // Generic Required Message for all fields
            'required' => 'Este campo es obligatorio.',

            // Specific Custom Messages
            'tenant_name.required' => 'Debes ingresar un nombre para tu negocio.',
            'slug.required' => 'El slug/URL es obligatorio.',
            'slug.unique' => 'Esta URL ya está en uso. Por favor ingresa otra diferente.',
            'slug.alpha_dash' => 'La URL solo puede contener letras, números y guiones.',
            'owner_email.required' => 'El correo electrónico es obligatorio.',
            'owner_email.email' => 'Ingresa un correo electrónico válido.',
            'owner_email.unique' => 'Este correo ya tiene una cuenta registrada.',
            'owner_password.min' => 'La contraseña debe tener al menos 8 caracteres.',

            // Step-specific context
            'tenant_doc_number.required' => 'El número de documento del negocio es obligatorio.',
            'tenant_contact_email.required' => 'El email de contacto público es obligatorio.',
            'tenant_address.required' => 'La dirección fiscal es obligatoria.',
        ]);

        $plan = Plan::findOrFail($validated['plan_id']);

        // The slug logic is now handled pre-validation, so this block is removed.

        try {
            DB::transaction(function () use ($validated, $request) {
                // 1. Create User
                $user = User::create([
                    'name' => $validated['owner_name'],
                    'email' => $validated['owner_email'],
                    'password' => Hash::make($validated['owner_password']),
                    'doc_type' => $validated['owner_doc_type'],
                    'doc_number' => $validated['owner_doc_number'],
                    'phone' => $validated['owner_phone'],
                    'address' => $validated['owner_address'],
                    'country' => $validated['owner_country'],
                    'state' => $validated['owner_state'],
                    'city' => $validated['owner_city'],
                ]);

                // 2. Create Tenant
                $tenant = Tenant::create([
                    'name' => $validated['tenant_name'],
                    'slug' => $validated['slug'],
                    'category_id' => $validated['category_id'],
                    'owner_id' => $user->id,
                    'regime' => $validated['regime'],
                    'doc_type' => $validated['tenant_doc_type'],
                    'doc_number' => $validated['tenant_doc_number'],
                    'verification_digit' => $validated['verification_digit'],
                    'contact_email' => $validated['tenant_contact_email'],
                    'address' => $validated['tenant_address'],
                    'state' => $validated['tenant_state'],
                    'city' => $validated['tenant_city'],
                    'params' => [], // Empty params for now
                    'settings' => [],
                ]);

                // 3. Attach User to Tenant as Owner
                $tenant->users()->attach($user->id, ['role' => 'owner']);

                // 4. Create Subscription
                $plan = Plan::find($validated['plan_id']);

                // Calculate end date based on cycle
                $months = match ($validated['billing_cycle']) {
                    'monthly' => 1,
                    'quarterly' => 3,
                    'semiannual' => 6,
                    'yearly' => 12,
                    default => 1
                };

                // Logic: If trial days > 0, start in trialing. Else start in pending (waiting for payment)
                $status = 'pending';
                $trialEndsAt = null;
                $startsAt = null;
                $endsAt = null;

                if ($plan->trial_days > 0) {
                    $status = 'trialing';
                    $startsAt = now();
                    $trialEndsAt = now()->addDays($plan->trial_days);
                    // Subscription technically ends when trial ends if no payment
                    $endsAt = $trialEndsAt;
                } else {
                    // Immediate payment required, but we mark as pending until paid
                    // Or if "no_initial_payment_required", maybe active? Let's stick to safe 'pending'
                    $status = 'pending';
                }

                $subscription = Subscription::create([
                    'tenant_id' => $tenant->id,
                    'plan_id' => $plan->id,
                    'status' => $status,
                    'billing_cycle' => $validated['billing_cycle'],
                    'starts_at' => $startsAt,
                    'trial_ends_at' => $trialEndsAt,
                    'ends_at' => $endsAt,
                ]);

                // 4.5 Create Initial Invoice
                $invoice = Invoice::create([
                    'tenant_id' => $tenant->id,
                    'subscription_id' => $subscription->id,
                    'amount' => $plan->getPriceForDuration($months),
                    'status' => 'pending',
                    'due_date' => now()->addDays(3),
                ]);

                // 5. Notify Tenant Admin (The newly created user)
                $user->notify(new InvoiceGeneratedNotification($invoice));

                // 6. Notify SuperAdmins
                $superAdmins = User::where('is_super_admin', true)->get();
                foreach ($superAdmins as $admin) {
                    $admin->notify(new TenantCreatedNotification($tenant));
                }

            });

            return redirect()->route('tenants.index')->with('success', 'Tienda creada exitosamente con usuario y suscripción.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al crear la tienda: ' . $e->getMessage()])->withInput();
        }
    }

    public function show(Tenant $tenant)
    {
        $tenant->load(['category.vertical', 'users', 'category']); // Missing 'subscriptions' relation on Tenant model yet, but we can load if added

        // Let's assume we want to show subscription info too
        // We need to add 'latestSubscription' relation to Tenant model ideally

        return Inertia::render('SuperAdmin/Tenants/Show', [
            'tenant' => $tenant
        ]);
    }
}
