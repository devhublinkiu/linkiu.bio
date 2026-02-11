<?php

namespace App\Http\Controllers\Tenant\Gastronomy;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Events\Tenant\PaymentProofUploaded;
use Intervention\Image\Laravel\Facades\Image; // Assuming Intervention Image is installed, or omit optimization for now if not sure

class MagicLinkController extends Controller
{
    public function show($token)
    {
        $tenant = app('currentTenant');

        return Inertia::render('Tenant/Gastronomy/Public/MagicUpload', [
            'token' => $token,
            'tenant' => $tenant, // Pass full tenant model so frontend has slug/id
        ]);
    }

    public function store(Request $request, $token)
    {
        $tenant = app('currentTenant');

        $request->validate([
            'image' => 'required|image|max:10240', // 10MB max
        ]);

        $file = $request->file('image');
        $path = $file->store('payment_proofs', 'public');
        $url = Storage::url($path);

        // Broadcast event
        // We broadcast to channel: pos.{tenantId}.magic.{token}
        broadcast(new PaymentProofUploaded($tenant->id, $token, $url));

        return response()->json(['success' => true, 'url' => $url]);
    }
}
