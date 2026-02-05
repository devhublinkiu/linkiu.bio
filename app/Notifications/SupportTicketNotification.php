<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupportTicketNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Ticket $ticket;
    public string $action;
    public ?string $comment;
    public ?string $responderName; // Nombre de quien responde

    /**
     * @param Ticket $ticket
     * @param string $action ('created', 'replied', 'assigned', 'resolved')
     * @param string|null $comment
     * @param string|null $responderName Nombre de quien responde (para 'replied')
     */
    public function __construct(Ticket $ticket, string $action, ?string $comment = null, ?string $responderName = null)
    {
        $this->ticket = $ticket;
        $this->action = $action;
        $this->comment = $comment;
        $this->responderName = $responderName;
    }

    public function via(object $notifiable): array
    {
        return $notifiable->email ? ['database', 'mail'] : ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $template = match ($this->action) {
            'created' => 'emails.support.ticket-created',
            'replied' => 'emails.support.ticket-replied',
            'resolved' => 'emails.support.ticket-resolved',
            default => 'emails.support.ticket-replied'
        };

        $ticketId = sprintf('%04d', $this->ticket->id);

        $subject = match ($this->action) {
            'created' => "😊 Soporte Creamos tu ticket #{$ticketId} – {$this->ticket->subject}",
            'replied' => "✨ " . ($this->responderName ?? 'Soporte') . " Hay novedades en tu ticket #{$ticketId}",
            'assigned' => "📋 Soporte Ticket #{$ticketId} asignado",
            'resolved' => "🎉 Soporte ¡Ticket #{$ticketId} resuelto!",
            default => "📬 Soporte Actualización en ticket #{$ticketId}"
        };

        return (new MailMessage)
            ->from(config('mail.addresses.support'), 'Soporte ' . config('app.name'))
            ->replyTo(config('mail.addresses.support'))
            ->subject($subject)
            ->markdown($template, [
                'ticket' => $this->ticket,
                'user' => $notifiable,
                'comment' => $this->comment,
                'actionUrl' => $this->getTicketUrl($notifiable)
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'action' => $this->action,
            'message' => $this->getMessageContent(),
            'url' => $this->getTicketUrl($notifiable),
            'icon' => 'LifeBuoy',
        ];
    }

    protected function getMessageContent(): string
    {
        return match ($this->action) {
            'created' => "Se ha creado un nuevo ticket con el asunto: '{$this->ticket->subject}'",
            'replied' => "Hay una nueva respuesta en el ticket: '{$this->ticket->subject}'",
            'assigned' => "El ticket ha sido asignado a un agente de soporte.",
            'resolved' => "El ticket ha sido marcado como resuelto.",
            default => "El ticket ha sido actualizado."
        };
    }

    protected function getTicketUrl($notifiable): string
    {
        // If user is superadmin, use superadmin route
        if ($notifiable->is_super_admin ?? false) {
            return route('superadmin.support.show', $this->ticket->id);
        }

        // For tenant users, we need the tenant slug
        $tenant = $this->ticket->tenant;
        return route('tenant.support.show', [
            'tenant' => $tenant->slug,
            'support' => $this->ticket->id
        ]);
    }
}
