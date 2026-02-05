<?php

namespace App\Http\Controllers;

use App\Events\TenantCreated;
use App\Models\BusinessCategory;
use App\Models\Invoice;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use App\Models\User;
use App\Models\Vertical;
use App\Notifications\InvoiceGeneratedNotification;
use App\Notifications\TenantCreatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    /**
     * Step 1: Show vertical, category, and plan selection
     */
    public function step1()
    {
        $verticals = Vertical::with('categories')->get();
        $plans = Plan::all()->map(function ($plan) {
            if ($plan->cover_path) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = \Illuminate\Support\Facades\Storage::disk('s3');
                $plan->cover_url = $disk->url($plan->cover_path);
            } else {
                $plan->cover_url = null;
            }
            return $plan;
        });

        return Inertia::render('Onboarding/Step1', [
            'verticals' => $verticals,
            'plans' => $plans,
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Store Step 1 data and redirect to Step 2
     */
    public function storeStep1(Request $request)
    {
        $validated = $request->validate([
            'vertical_id' => 'required|exists:verticals,id',
            'category_id' => 'required|exists:business_categories,id',
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,quarterly,semiannual,yearly',
        ], [
            'vertical_id.required' => 'Selecciona un tipo de negocio',
            'category_id.required' => 'Selecciona una categoría',
            'plan_id.required' => 'Selecciona un plan',
        ]);

        // Store in session
        session(['onboarding' => $validated]);

        return redirect()->route('onboarding.step2');
    }

    /**
     * Step 2: Business details (name, slug, phone)
     */
    public function step2()
    {
        // Check if step 1 was completed
        if (!session('onboarding.vertical_id')) {
            return redirect()->route('onboarding.step1');
        }

        $onboardingData = session('onboarding');
        $plan = Plan::find($onboardingData['plan_id'] ?? null);

        return Inertia::render('Onboarding/Step2', [
            'onboardingData' => $onboardingData,
            'plan' => $plan,
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Store Step 2 data and redirect to Step 3
     */
    public function storeStep2(Request $request)
    {
        $validated = $request->validate([
            'tenant_name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug|alpha_dash',
            'owner_phone' => 'nullable|string|max:20',
            'owner_country_code' => 'nullable|string|max:5',
            'fiscal_regime' => 'required|string|max:255',
            'doc_type' => 'required|string|max:20',
            'doc_number' => 'required|string|max:50',
            'doc_dv' => 'nullable|string|max:10',
            'is_address_same' => 'boolean',
            'fiscal_address' => 'required_if:is_address_same,false|nullable|string|max:500',
            'public_email' => 'required|email|max:255|unique:tenants,contact_email',
        ], [
            'tenant_name.required' => 'Ingresa el nombre de tu negocio',
            'slug.required' => 'La URL de tu tienda es requerida',
            'slug.unique' => 'Este slug ya está en uso',
            'slug.alpha_dash' => 'La URL solo puede contener letras, números y guiones',
            'fiscal_regime.required' => 'El régimen fiscal es obligatorio',
            'doc_type.required' => 'El tipo de documento es obligatorio',
            'doc_number.required' => 'El número de documento es obligatorio',
            'public_email.required' => 'El correo de contacto público es obligatorio',
            'public_email.email' => 'Ingresa un correo de contacto válido',
            'public_email.unique' => 'Este correo ya está registrado en otra tienda',
        ]);

        // Merge with existing session data
        session(['onboarding' => array_merge(session('onboarding', []), $validated)]);

        return redirect()->route('onboarding.step3');
    }

    /**
     * Step 3: Account creation (name, email, password)
     */
    public function step3()
    {
        // Check if previous steps were completed
        if (!session('onboarding.tenant_name')) {
            return redirect()->route('onboarding.step2');
        }

        return Inertia::render('Onboarding/Step3', [
            'onboardingData' => session('onboarding'),
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Validate a specific field (Real-time checks)
     */
    public function validateField(Request $request)
    {
        $request->validate([
            'field' => 'required|string|in:slug,tenant_name,public_email',
            'value' => 'nullable|string',
        ]);

        $field = $request->field;
        $value = $request->value;

        // Custom messages map
        $messages = [
            'slug.unique' => 'Este slug ya está en uso',
            'slug.alpha_dash' => 'Solo letras, números y guiones',
            'public_email.email' => 'Ingresa un correo válido',
            'public_email.unique' => 'Este correo ya está registrado',
            'tenant_name.required' => 'El nombre es obligatorio',
        ];

        $rules = match ($field) {
            'slug' => 'required|string|max:255|unique:tenants,slug|alpha_dash',
            'tenant_name' => 'required|string|max:255',
            'public_email' => 'required|email|max:255|unique:tenants,contact_email',
            default => 'nullable'
        };

        $validator = \Illuminate\Support\Facades\Validator::make(
            [$field => $value],
            [$field => $rules],
            $messages
        );

        if ($validator->fails()) {
            return response()->json([
                'valid' => false,
                'message' => $validator->errors()->first($field),
            ]);
        }

        return response()->json(['valid' => true]);
    }

    /**
     * Complete registration - create user, tenant, and subscription
     */
    public function complete(Request $request)
    {
        $validated = $request->validate([
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|unique:users,email',
            'owner_password' => 'required|string|min:8|confirmed',
            'owner_doc_type' => 'required|string',
            'owner_doc_number' => 'required|string',
            'owner_phone' => 'required|string',
            'owner_address' => 'required|string',
            'owner_country' => 'required|string',
            'owner_state' => 'required|string',
            'owner_city' => 'required|string',
        ], [
            'owner_name.required' => 'Ingresa tu nombre completo',
            'owner_email.required' => 'Ingresa tu correo electrónico',
            'owner_email.email' => 'Ingresa un correo válido',
            'owner_email.unique' => 'Este correo ya está registrado',
            'owner_password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'owner_password.confirmed' => 'Las contraseñas no coinciden',
            'owner_doc_type.required' => 'Selecciona el tipo de documento',
            'owner_doc_number.required' => 'Ingresa el número de documento',
            'owner_phone.required' => 'Ingresa tu celular',
            'owner_address.required' => 'Ingresa tu dirección',
            'owner_country.required' => 'Selecciona el país',
            'owner_state.required' => 'Ingresa el departamento',
            'owner_city.required' => 'Ingresa la ciudad',
        ]);

        // Merge all data
        $onboardingData = session('onboarding', []);
        $allData = array_merge($onboardingData, $validated);

        \Log::info('Onboarding Complete - Data:', $allData);

        $plan = Plan::findOrFail($allData['plan_id']);
        $category = BusinessCategory::find($allData['category_id']);
        $requiresApproval = $category && $category->require_verification;

        try {
            $tenant = null;
            $user = null;

            DB::transaction(function () use ($allData, $plan, $requiresApproval, &$tenant, &$user) {
                // 1. Create User
                $user = User::create([
                    'name' => $allData['owner_name'],
                    'email' => $allData['owner_email'],
                    'password' => Hash::make($allData['owner_password']),
                    'doc_type' => $allData['owner_doc_type'],
                    'doc_number' => $allData['owner_doc_number'],
                    'phone' => $allData['owner_phone'],
                    'address' => $allData['owner_address'],
                    'country' => $allData['owner_country'],
                    'state' => $allData['owner_state'],
                    'city' => $allData['owner_city'],
                ]);

                // 2. Create Tenant
                $tenant = Tenant::create([
                    'name' => $allData['tenant_name'],
                    'slug' => $allData['slug'],
                    'vertical_id' => $allData['vertical_id'],
                    'category_id' => $allData['category_id'],
                    'owner_id' => $user->id,
                    'doc_type' => $allData['doc_type'], // From Step 2
                    'doc_number' => $allData['doc_number'], // From Step 2
                    'verification_digit' => $allData['doc_dv'] ?? null,
                    'regime' => $allData['fiscal_regime'],
                    'contact_email' => $allData['public_email'],
                    'address' => $allData['is_address_same'] ? $allData['owner_address'] : ($allData['fiscal_address'] ?? $allData['owner_address']),
                    'state' => $allData['owner_state'], // Using owner state as default for tenant
                    'city' => $allData['owner_city'], // Using owner city as default for tenant
                    'is_active' => !$requiresApproval, // Inactive if requires approval
                ]);

                // 3. Attach User to Tenant as Owner (Pivot Table)
                $tenant->users()->attach($user->id, ['role' => 'owner']);

                // 4. Create Subscription
                $startDate = now();
                $trialDays = $plan->trial_days ?? 0;
                $trialEndsAt = $trialDays > 0 ? $startDate->copy()->addDays($trialDays) : null;

                $months = match ($allData['billing_cycle']) {
                    'monthly' => 1,
                    'quarterly' => 3,
                    'semiannual' => 6,
                    'yearly' => 12,
                    default => 1,
                };

                $amount = $plan->getPriceForDuration($months);

                $endDate = $startDate->copy()->addMonths($months);

                // Logic:
                // 1. Free Plan matched by amount=0 => 'active'
                // 2. Paid Plan + Trial => 'trialing'
                // 3. Paid Plan + NO Trial => 'on_hold' (This blocks public access via middleware until paid)

                $status = 'active'; // Default
                if ($amount > 0) {
                    $status = ($trialDays > 0) ? 'trialing' : 'on_hold';
                }

                // Calculate next payment date
                if ($amount > 0 && $trialDays > 0) {
                    $nextPaymentDate = $trialEndsAt;
                } else {
                    $nextPaymentDate = $endDate;
                }

                $subscription = Subscription::create([
                    'tenant_id' => $tenant->id,
                    'plan_id' => $plan->id,
                    'status' => $status,
                    'billing_cycle' => $allData['billing_cycle'],
                    'starts_at' => $startDate,
                    'ends_at' => $endDate,
                    'trial_ends_at' => ($amount > 0) ? $trialEndsAt : null,
                    'next_payment_date' => $nextPaymentDate,
                ]);

                // 5. Create Initial Invoice (Only if amount > 0)
                if ($amount > 0) {
                    $invoice = Invoice::create([
                        'tenant_id' => $tenant->id,
                        'subscription_id' => $subscription->id,
                        'amount' => $amount,
                        'status' => 'pending',
                        'due_date' => now()->addDays(3),
                    ]);

                    // 6. Notify Tenant Admin
                    $user->notify(new InvoiceGeneratedNotification($invoice));
                }

                // 7. Notify SuperAdmins (Database Notification)
                $superAdmins = User::where('is_super_admin', true)->get();
                /** @var \App\Models\User $admin */
                foreach ($superAdmins as $admin) {
                    $admin->notify(new TenantCreatedNotification($tenant));
                }

                // 8. Broadcast Real-time Event (for toasts)
                broadcast(new TenantCreated($tenant));

                // 5. Log the user in
                /** @var \Illuminate\Contracts\Auth\StatefulGuard $auth */
                $auth = auth();
                $auth->login($user);
            });

            // Clear onboarding session
            session()->forget('onboarding');

            // Store data for building page
            session([
                'onboarding_complete' => [
                    'tenant_name' => $tenant->name,
                    'tenant_slug' => $tenant->slug,
                    'owner_name' => $user->name,
                    'owner_email' => $user->email,
                    'requires_approval' => $requiresApproval,
                    'category_name' => $category?->name,
                ]
            ]);

            return redirect()->route('onboarding.building');

        } catch (\Exception $e) {
            \Log::error('Onboarding Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Hubo un error al crear tu tienda. Por favor intenta de nuevo.']);
        }
    }

    /**
     * Building animation page
     */
    public function building()
    {
        $data = session('onboarding_complete');

        if (!$data) {
            return redirect()->route('onboarding.step1');
        }

        return Inertia::render('Onboarding/Building', [
            'tenantName' => $data['tenant_name'],
            'tenantSlug' => $data['tenant_slug'],
            'requiresApproval' => $data['requires_approval'],
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Success page (auto-approved)
     */
    public function success()
    {
        $data = session('onboarding_complete');

        if (!$data) {
            return redirect()->route('welcome');
        }

        // Clear session after showing
        session()->forget('onboarding_complete');

        return Inertia::render('Onboarding/Success', [
            'tenant' => [
                'name' => $data['tenant_name'],
                'slug' => $data['tenant_slug'],
            ],
            'ownerName' => $data['owner_name'],
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Pending approval page (manual review required)
     */
    public function pending()
    {
        $data = session('onboarding_complete');

        if (!$data) {
            return redirect()->route('welcome');
        }

        // Clear session after showing
        session()->forget('onboarding_complete');

        return Inertia::render('Onboarding/Pending', [
            'tenant' => [
                'name' => $data['tenant_name'],
                'slug' => $data['tenant_slug'],
            ],
            'ownerName' => $data['owner_name'],
            'ownerEmail' => $data['owner_email'],
            'categoryName' => $data['category_name'] ?? null,
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Get site settings helper
     */
    private function getSiteSettings(): array
    {
        $setting = \App\Models\SiteSetting::first();

        return [
            'app_name' => $setting->app_name ?? config('app.name', 'Linkiu'),
            'logo_url' => $setting?->logo_path
                ? (function () use ($setting) {
                    /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                    $disk = \Illuminate\Support\Facades\Storage::disk('s3');
                    return $disk->url($setting->logo_path);
                })()
                : null,
        ];
    }
}
