<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ticker;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class TickerController extends Controller
{
    public function index()
    {
        Gate::authorize("tickers.view");

        return Inertia::render("Tenant/Admin/Tickers/Index", [
            "tickers" => Ticker::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        Gate::authorize("tickers.create");

        $validated = $request->validate([
            "content" => "required|string|max:255",
            "link" => "nullable|url|max:255",
            "background_color" => "required|string|max:10",
            "is_active" => "boolean"
        ]);

        Ticker::create($validated);

        return redirect()->route("tenant.admin.tickers.index", ["tenant" => app("currentTenant")->slug])
            ->with("success", "Ticker creado correctamente");
    }

    public function update(Request $request, Ticker $ticker)
    {
        Gate::authorize("tickers.update");

        $validated = $request->validate([
            "content" => "required|string|max:255",
            "link" => "nullable|url|max:255",
            "background_color" => "required|string|max:10",
            "is_active" => "boolean"
        ]);

        $ticker->update($validated);

        return redirect()->route("tenant.admin.tickers.index", ["tenant" => app("currentTenant")->slug])
            ->with("success", "Ticker actualizado correctamente");
    }

    public function destroy(Ticker $ticker)
    {
        Gate::authorize("tickers.delete");

        $ticker->delete();

        return redirect()->route("tenant.admin.tickers.index", ["tenant" => app("currentTenant")->slug])
            ->with("success", "Ticker eliminado correctamente");
    }
}