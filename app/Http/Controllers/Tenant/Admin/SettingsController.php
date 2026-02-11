<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Get the current tenant from the container (resolved by middleware).
     */
    protected function getTenant(): Tenant
    {
        $tenant = app("currentTenant");

        if (!$tenant) {
            abort(404, "Negocio no encontrado.");
        }

        return $tenant;
    }

    /**
     * Display the tenant's settings form.
     */
    public function edit(Request $request): Response
    {
        Gate::authorize("settings.view");

        $tenant = $this->getTenant();
        $settings = $tenant->settings ?? [];

        // Prepare URLs for assets
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk("s3");

        if (isset($settings["logo_path"])) {
            $settings["logo_url"] = $disk->url($settings["logo_path"]);
        }

        if (isset($settings["favicon_path"])) {
            $settings["favicon_url"] = $disk->url($settings["favicon_path"]);
        }

        return Inertia::render("Tenant/Admin/Settings/Edit", [
            "tenantSettings" => $settings,
            "tenant" => $tenant->only(["id", "name", "slug", "logo_url", "slug_changes_count", "last_slug_changed_at"]),
            "slugChangePrice" => SiteSetting::first()?->slug_change_price ?? 10000.00,
            "status" => session("status"),
        ]);
    }

    /**
     * Update the tenant's settings.
     */
    public function update(Request $request): RedirectResponse
    {
        Gate::authorize("settings.update");

        $tenant = $this->getTenant();

        $validated = $request->validate([
            // Identity
            "store_name" => ["nullable", "string", "max:255"],
            "store_description" => ["nullable", "string", "max:60"],
            "bg_color" => ["nullable", "string", "regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/"],
            "name_color" => ["nullable", "string", "regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/"],
            "description_color" => ["nullable", "string", "regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/"],

            // SEO
            "meta_title" => ["nullable", "string", "max:255"],
            "meta_description" => ["nullable", "string", "max:500"],
            "meta_keywords" => ["nullable", "string", "max:255"],
            "maintenance_mode" => ["nullable", "boolean"],

            // Integrations
            "facebook_pixel_id" => ["nullable", "string", "max:100"],
            "google_analytics_id" => ["nullable", "string", "max:100"],
            "tiktok_pixel_id" => ["nullable", "string", "max:100"],

            // Tax Settings
            "tax_name" => ["nullable", "string", "max:255"],
            "tax_rate" => ["nullable", "numeric", "min:0", "max:100"],
            "price_includes_tax" => ["nullable", "boolean"],
        ]);

        $currentSettings = $tenant->settings ?? [];
        $newSettings = array_merge($currentSettings, $validated);

        $updateData = ["settings" => $newSettings];

        // Slug Change Management
        if ($request->has("slug") && $request->slug !== $tenant->slug) {
            $request->validate([
                "slug" => ["required", "string", "alpha_dash", "max:255", "unique:tenants,slug," . $tenant->id],
            ]);

            // Frequency Check (3 months)
            if ($tenant->last_slug_changed_at && $tenant->last_slug_changed_at->addMonths(3)->isFuture()) {
                $nextDate = $tenant->last_slug_changed_at->addMonths(3)->format("d/m/Y");
                return Redirect::back()->withErrors(["slug" => "Solo puedes cambiar tu URL cada 3 meses. Próximo cambio disponible: {$nextDate}."]);
            }

            // Price Logic (First one free)
            if ($tenant->slug_changes_count > 0) {
                $price = SiteSetting::first()?->slug_change_price ?? 10000.00;
                return Redirect::back()->withErrors([
                    "slug" => "A partir del segundo cambio, la modificación de URL tiene un costo de $" . number_format($price, 0, ",", ".") . ". Por favor contacta a soporte para proceder."
                ]);
            }

            $updateData["slug"] = $request->slug;
            $updateData["slug_changes_count"] = $tenant->slug_changes_count + 1;
            $updateData["last_slug_changed_at"] = now();
        }

        if ($request->has("store_name")) {
            $updateData["name"] = $request->store_name;
        }

        $tenant->update($updateData);

        if (isset($updateData["slug"])) {
            return Redirect::to(route("tenant.settings.edit", ["tenant" => $updateData["slug"]]))
                ->with("success", "URL y configuración actualizadas correctamente.");
        }

        return Redirect::back()->with("success", "Configuración actualizada correctamente.");
    }

    /**
     * Update the tenant's logo.
     */
    public function updateLogo(Request $request): RedirectResponse
    {
        Gate::authorize("settings.update");

        $request->validate([
            "logo" => ["required"], 
        ]);

        $input = $request->input("logo") ?? $request->file("logo");
        if (!$input) {
            return Redirect::back()->withErrors(["logo" => "Logo requerido"]);
        }

        $tenant = $this->getTenant();
        $settings = $tenant->settings ?? [];

        if (is_string($input)) {
            $settings["logo_url"] = $input;
            if (isset($settings["logo_path"])) {
                unset($settings["logo_path"]);
            }
        } elseif ($request->hasFile("logo")) {
            if (isset($settings["logo_path"])) {
                Storage::disk("s3")->delete($settings["logo_path"]);
            }
            $path = $request->file("logo")->store("tenants/logos", "s3");
            $settings["logo_path"] = $path;
            unset($settings["logo_url"]); 
        }

        $tenant->update(["settings" => $settings]);

        return Redirect::back()->with("success", "Logo actualizado.");
    }

    /**
     * Update the tenant's favicon.
     */
    public function updateFavicon(Request $request): RedirectResponse
    {
        Gate::authorize("settings.update");

        $input = $request->input("favicon") ?? $request->file("favicon");
        if (!$input) {
            return Redirect::back()->withErrors(["favicon" => "Favicon requerido"]);
        }

        $tenant = $this->getTenant();
        $settings = $tenant->settings ?? [];

        if (is_string($input)) {
            $settings["favicon_url"] = $input;
            if (isset($settings["favicon_path"])) {
                unset($settings["favicon_path"]);
            }
        } elseif ($request->hasFile("favicon")) {
            if (isset($settings["favicon_path"])) {
                Storage::disk("s3")->delete($settings["favicon_path"]);
            }
            $path = $request->file("favicon")->store("tenants/favicons", "s3");
            $settings["favicon_path"] = $path;
            unset($settings["favicon_url"]);
        }

        $tenant->update(["settings" => $settings]);

        return Redirect::back()->with("success", "Favicon actualizado.");
    }
}