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
use App\Notifications\WelcomeNotification;
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

        return Inertia::render('Onboarding/Step1', [
            'verticals' => $verticals,
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
        ], [
            'vertical_id.required' => 'Selecciona un tipo de negocio',
            'category_id.required' => 'Selecciona una categoría',
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

        return Inertia::render('Onboarding/Step2', [
            'onboardingData' => session('onboarding'),
            'siteSettings' => $this->getSiteSettings(),
        ]);
    }

    /**
     * Store Step 2 data and redirect to Step 3
     */
    public function storeStep2(Request $request)
    {
        $validated = $request->validate([
            'owner_name' => 'required|string|max:255',
            'owner_email' => 'required|email|unique:users,email',
            'owner_password' => 'required|string|min:8|confirmed',
        ], [
            'owner_name.required' => 'Ingresa tu nombre completo',
            'owner_email.required' => 'Ingresa tu correo electrónico',
            'owner_email.unique' => 'Este correo ya está registrado',
            'owner_password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'owner_password.confirmed' => 'Las contraseñas no coinciden',
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
        // Check if previous step was completed (Account data)
        if (!session('onboarding.owner_name')) {
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
            'field' => 'required|string|in:slug,tenant_name,owner_email',
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
            'owner_email' => 'required|email|max:255|unique:users,email',
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
            'tenant_name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:tenants,slug|alpha_dash',
        ], [
            'tenant_name.required' => 'Ingresa el nombre de tu negocio',
            'slug.required' => 'La URL de tu tienda es requerida',
            'slug.unique' => 'Este slug ya está en uso',
            'slug.alpha_dash' => 'La URL solo puede contener letras, números y guiones',
        ]);

        // Merge all data from session
        $onboardingData = session('onboarding', []);
        $allData = array_merge($onboardingData, $validated);

        \Log::info('Onboarding Complete (Simplified) - Data:', $allData);

        $category = BusinessCategory::find($allData['category_id']);
        $requiresApproval = $category && $category->require_verification;

        try {
            $tenant = null;
            $user = null;

            DB::transaction(function () use ($allData, $requiresApproval, &$tenant, &$user) {
                // Pre-check for Propietario Role
                $propietarioRole = \App\Models\Role::firstOrCreate(
                    ['name' => 'Propietario', 'tenant_id' => null],
                    ['guard_name' => 'web', 'is_system' => true]
                );

                // 1. Create User (Owner)
                $user = User::create([
                    'name' => $allData['owner_name'],
                    'email' => $allData['owner_email'],
                    'password' => Hash::make($allData['owner_password']),
                    'role_id' => $propietarioRole->id, // Assign global role
                ]);

                // 2. Create Tenant (Store)
                $tenant = Tenant::create([
                    'name' => $allData['tenant_name'],
                    'slug' => $allData['slug'],
                    'vertical_id' => $allData['vertical_id'],
                    'category_id' => $allData['category_id'],
                    'owner_id' => $user->id,
                    'contact_email' => $allData['owner_email'], // Default to owner email
                    'is_active' => !$requiresApproval,
                    'trial_ends_at' => now()->addHours(48),
                ]);

                // 3. Attach User to Tenant
                $tenant->users()->attach($user->id, [
                    'role' => 'owner',
                    'role_id' => $propietarioRole->id
                ]);

                // Initial Subscription: Removed to allow manual selection from dashboard.

                // 7. Notify SuperAdmins
                $superAdmins = User::where('is_super_admin', true)->get();
                foreach ($superAdmins as $admin) {
                    $admin->notify(new TenantCreatedNotification($tenant));
                }

                // 7.5 Send Welcome Email to Tenant Owner
                $user->notify(new WelcomeNotification($tenant));

                // 8. Broadcast
                broadcast(new TenantCreated($tenant));

                // 9. Automagically Login
                auth()->login($user);
            });

            // Clear session
            session()->forget('onboarding');

            // Store summary for success/building page
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
            return back()->withErrors(['error' => 'Hubo un error al crear tu tienda: ' . $e->getMessage()]);
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
