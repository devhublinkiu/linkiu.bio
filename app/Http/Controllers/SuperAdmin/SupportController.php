<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;
use App\Events\TicketRepliedEvent;
use App\Notifications\SupportTicketNotification;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with(['tenant', 'user', 'lastReply'])
            ->orderBy('updated_at', 'desc')
            ->paginate(20);

        $agents = User::where('is_super_admin', true)->get();

        return Inertia::render('SuperAdmin/Support/Index', [
            'tickets' => $tickets,
            'agents' => $agents
        ]);
    }

    public function show(Ticket $support)
    {
        $support->load(['replies.user', 'tenant', 'user', 'assignedTo']);

        return Inertia::render('SuperAdmin/Support/Show', [
            'ticket' => $support
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $reply = TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'message' => $validated['message'],
            'is_staff' => true,
        ]);

        $ticket->touch();
        $ticket->update(['status' => 'awaiting_response']);

        // Real-time event for chat refresh
        $reply->load('user');
        $ticket->load('tenant', 'user');
        broadcast(new TicketRepliedEvent($ticket, $reply));

        // Notify Tenant Admin (ensure tenant is loaded for URL generation)
        $ticket->user->notify(new SupportTicketNotification(
            $ticket,
            'replied',
            $validated['message'],
            auth()->user()->name // Nombre de quien responde
        ));

        return back()->with('success', 'Respuesta enviada al cliente.');
    }

    public function assign(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'assigned_to_id' => 'required|exists:users,id',
        ]);

        $ticket->update([
            'assigned_to_id' => $validated['assigned_to_id'],
            'status' => 'in_progress'
        ]);

        // Load relationships for notification URL generation
        $ticket->load('tenant', 'user');

        $agent = User::find($validated['assigned_to_id']);

        // Broadcast real-time event
        broadcast(new \App\Events\TicketAssignedEvent($ticket, $agent));

        // Send email notification to assigned agent
        $agent->notify(new SupportTicketNotification($ticket, 'assigned', null, $agent->name));

        // Notify tenant that their ticket has been assigned
        $ticket->user->notify(new SupportTicketNotification(
            $ticket,
            'assigned',
            "Tu ticket ha sido asignado a {$agent->name} de nuestro equipo de soporte. Te responderemos pronto.",
            $agent->name
        ));

        return back()->with('success', 'Ticket asignado exitosamente.');
    }

    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,awaiting_response,resolved,closed',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $oldStatus = $ticket->status;
        $ticket->update($validated);

        if ($oldStatus !== $validated['status'] && $validated['status'] === 'resolved') {
            $ticket->user->notify(new SupportTicketNotification($ticket, 'resolved'));
        }

        return back()->with('success', 'Estado del ticket actualizado.');
    }
}
