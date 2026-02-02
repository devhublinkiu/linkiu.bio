<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\Vertical;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::with('vertical')->orderBy('sort_order')->orderBy('created_at', 'desc')->get();
        return Inertia::render('SuperAdmin/Plans/Index', [
            'plans' => $plans
        ]);
    }

    public function create()
    {
        $verticals = Vertical::all();
        return Inertia::render('SuperAdmin/Plans/Create', [
            'verticals' => $verticals
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:plans,slug',
            'vertical_id' => 'required|exists:verticals,id',
            'description' => 'nullable|string',
            'monthly_price' => 'required|numeric|min:0',
            'currency' => 'required|string|in:USD,COP',
            'quarterly_discount_percent' => 'integer|min:0|max:100',
            'semiannual_discount_percent' => 'integer|min:0|max:100',
            'yearly_discount_percent' => 'integer|min:0|max:100',
            'trial_days' => 'integer|min:0',
            'no_initial_payment_required' => 'boolean',
            'support_level' => 'required|string',
            'allow_custom_slug' => 'boolean',
            'is_public' => 'boolean',
            'is_featured' => 'boolean',
            'highlight_text' => 'nullable|string|max:50',
            'sort_order' => 'integer',
            'features' => 'nullable|array',
            'features' => 'nullable|array',
            'cover' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('cover')) {
            $validated['cover_path'] = $request->file('cover')->store('plans', ['disk' => 's3', 'visibility' => 'public']);
        }

        Plan::create($validated);

        return redirect()->route('plans.index')->with('success', 'Plan creado correctamente.');
    }

    public function show(Plan $plan)
    {
        $plan->load('vertical');
        $plan->cover_url = $plan->cover_path ? Storage::disk('s3')->url($plan->cover_path) : null;

        return Inertia::render('SuperAdmin/Plans/Show', [
            'plan' => $plan
        ]);
    }

    public function edit(Plan $plan)
    {
        $verticals = Vertical::all();
        // Ensure image URL is accessible via proxy/S3
        $plan->cover_url = $plan->cover_path ? Storage::disk('s3')->url($plan->cover_path) : null;

        return Inertia::render('SuperAdmin/Plans/Edit', [
            'plan' => $plan,
            'verticals' => $verticals
        ]);
    }

    public function update(Request $request, Plan $plan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['required', 'string', 'max:255', Rule::unique('plans')->ignore($plan->id)],
            'vertical_id' => 'required|exists:verticals,id',
            'description' => 'nullable|string',
            'monthly_price' => 'required|numeric|min:0',
            'currency' => 'required|string|in:USD,COP',
            'quarterly_discount_percent' => 'integer|min:0|max:100',
            'semiannual_discount_percent' => 'integer|min:0|max:100',
            'yearly_discount_percent' => 'integer|min:0|max:100',
            'trial_days' => 'integer|min:0',
            'no_initial_payment_required' => 'boolean',
            'support_level' => 'required|string',
            'allow_custom_slug' => 'boolean',
            'is_public' => 'boolean',
            'is_featured' => 'boolean',
            'highlight_text' => 'nullable|string|max:50',
            'sort_order' => 'integer',
            'features' => 'nullable|array',
            'features' => 'nullable|array',
            'cover' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('cover')) {
            if ($plan->cover_path) {
                Storage::disk('s3')->delete($plan->cover_path);
            }
            $validated['cover_path'] = $request->file('cover')->store('plans', ['disk' => 's3', 'visibility' => 'public']);
        }

        $plan->update($validated);

        return redirect()->route('plans.index')->with('success', 'Plan actualizado correctamente.');
    }

    public function destroy(Plan $plan)
    {
        if ($plan->cover_path) {
            Storage::disk('s3')->delete($plan->cover_path);
        }
        $plan->delete();

        return redirect()->back()->with('success', 'Plan eliminado correctamente.');
    }
}
