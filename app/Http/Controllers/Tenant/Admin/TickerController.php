<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\Admin\StoreTickerRequest;
use App\Http\Requests\Tenant\Admin\UpdateTickerRequest;
use App\Models\Tenant\All\Ticker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TickerController extends Controller
{
    public function index()
    {
        Gate::authorize('tickers.view');

        $tenant = app('currentTenant');
        $tickers = Ticker::select(['id', 'content', 'link', 'background_color', 'text_color', 'order', 'is_active', 'created_at'])
            ->orderBy('order', 'asc')
            ->paginate(15);

        $tickersLimit = $tenant->getLimit('tickers');
        $tickersCount = Ticker::count();

        return Inertia::render('Tenant/Admin/Tickers/Index', [
            'tickers' => $tickers,
            'tickers_limit' => $tickersLimit,
            'tickers_count' => $tickersCount,
        ]);
    }

    public function store(StoreTickerRequest $request, $tenant)
    {
        Gate::authorize('tickers.create');

        $tenant = app('currentTenant');
        $maxTickers = $tenant->getLimit('tickers');
        if ($maxTickers !== null && Ticker::count() >= $maxTickers) {
            return back()->withErrors([
                'limit' => "Has alcanzado el máximo de {$maxTickers} tickers permitidos en tu plan.",
            ]);
        }

        Ticker::create($request->validated());

        return redirect()
            ->route('tenant.admin.tickers.index', ['tenant' => $tenant->slug])
            ->with('success', 'Ticker creado correctamente');
    }

    public function update(UpdateTickerRequest $request, $tenant, Ticker $ticker)
    {
        Gate::authorize('tickers.update');

        $ticker->update($request->validated());

        return redirect()
            ->route('tenant.admin.tickers.index', ['tenant' => app('currentTenant')->slug])
            ->with('success', 'Ticker actualizado correctamente');
    }

    public function destroy($tenant, Ticker $ticker)
    {
        Gate::authorize('tickers.delete');

        $ticker->delete();

        return redirect()
            ->route('tenant.admin.tickers.index', ['tenant' => app('currentTenant')->slug])
            ->with('success', 'Ticker eliminado correctamente');
    }

    public function reorder(Request $request)
    {
        Gate::authorize('tickers.update');

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:tickers,id',
        ]);

        foreach ($request->ids as $index => $id) {
            Ticker::where('id', $id)->update(['order' => $index]);
        }

        return response()->json(['message' => 'Orden actualizado']);
    }
}
