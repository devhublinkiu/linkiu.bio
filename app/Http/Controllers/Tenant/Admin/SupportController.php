<?php

namespace App\Http\Controllers\Tenant\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;
use App\Events\TicketCreatedEvent;
use App\Events\TicketRepliedEvent;
use App\Notifications\SupportTicketNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        // El trait BelongsToTenant ya aplica el filtro global mediante TenantScope
        $tickets = Ticket::withLastReply()
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        // Las estadísticas pueden seguir filtradas explícitamente por seguridad extra
        $tenantId = auth()->user()->tenant_id;
        $stats = [
            'resolved' => Ticket::where('tenant_id', $tenantId)
                ->whereIn('status', ['resolved', 'closed'])
                ->count(),
            'pending' => Ticket::where('tenant_id', $tenantId)
                ->whereIn('status', ['open', 'in_progress', 'awaiting_response'])
                ->count(),
            'total' => Ticket::where('tenant_id', $tenantId)->count(),
        ];

        return Inertia::render('Tenant/Admin/Support/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Tenant/Admin/Support/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'priority' => 'required|in:low,medium,high,urgent',
            'message' => 'required|string',
        ]);

        return DB::transaction(function () use ($validated) {
            $ticket = Ticket::create([
                'user_id' => auth()->id(),
                'subject' => $validated['subject'],
                'category' => $validated['category'],
                'priority' => $validated['priority'],
                'status' => 'open',
            ]);

            $reply = TicketReply::create([
                'ticket_id' => $ticket->id,
                'user_id' => auth()->id(),
                'message' => $validated['message'],
                'is_staff' => false,
            ]);

            // Real-time Event for SuperAdmin Toast
            $ticket->load('tenant');
            broadcast(new TicketCreatedEvent($ticket));

            // Notify SuperAdmins (Database & Email)
            $superAdmins = User::where('is_super_admin', true)->get();
            Notification::send($superAdmins, new SupportTicketNotification($ticket, 'created', $validated['message']));

            return redirect()->route('tenant.support.show', [
                'tenant' => app('currentTenant')->slug,
                'support' => $ticket->id
            ])->with('success', 'Ticket creado con éxito.');
        });
    }

    public function show($tenant, Ticket $support)
    {
        $support->load(['replies.user', 'assignedTo']);

        return Inertia::render('Tenant/Admin/Support/Show', [
            'ticket' => $support
        ]);
    }

    public function reply(Request $request, $tenant, Ticket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $reply = TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $validated['message'],
            'is_staff' => false,
        ]);

        $ticket->touch(); // Update updated_at
        $ticket->update(['status' => 'open']); // Reopen if it was awaiting or something

        // Real-time event for chat refresh
        $reply->load('user');
        broadcast(new TicketRepliedEvent($ticket, $reply));

        // Notify Assigned Agent or SuperAdmins
        if ($ticket->assigned_to_id) {
            $ticket->assignedTo->notify(new SupportTicketNotification(
                $ticket,
                'replied',
                $validated['message'],
                auth()->user()->name
            ));
        } else {
            $superAdmins = User::where('is_super_admin', true)->get();
            Notification::send($superAdmins, new SupportTicketNotification(
                $ticket,
                'replied',
                $validated['message'],
                auth()->user()->name
            ));
        }

        return back()->with('success', 'Respuesta enviada.');
    }

    public function close($tenant, Ticket $ticket)
    {
        $ticket->update(['status' => 'closed']);

        return back()->with('success', 'Ticket cerrado correctamente.');
    }
}
