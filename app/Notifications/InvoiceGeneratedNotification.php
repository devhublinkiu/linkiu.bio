<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceGeneratedNotification extends Notification
{
    use Queueable;

    public $invoice;

    /**
     * Create a new notification instance.
     */
    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return $notifiable->email ? ['database', 'broadcast', 'mail'] : ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $tenant = $this->invoice->tenant;
        $subscription = $this->invoice->subscription;
        $plan = $subscription->plan;

        $billingCycleMap = [
            'monthly' => 'Mensual',
            'quarterly' => 'Trimestral',
            'yearly' => 'Anual',
        ];

        return (new MailMessage)
            ->from(config('mail.addresses.billing'), 'Facturación ' . config('app.name'))
            ->subject('📄 Nueva Factura Generada - ' . config('app.name'))
            ->markdown('emails.billing.invoice-generated', [
                'user' => $notifiable,
                'tenant' => $tenant,
                'invoice' => $this->invoice,
                'planName' => $plan->name,
                'billingCycle' => $billingCycleMap[$subscription->billing_cycle] ?? 'Mensual',
                'paymentUrl' => route('tenant.subscription.index', ['tenant' => $tenant->slug]),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $tenant = $this->invoice->tenant;
        return [
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'message' => "Se ha generado una nueva factura por $" . number_format($this->invoice->amount, 0, ',', '.'),
            'type' => 'invoice_generated',
            'url' => route('tenant.invoices.index', ['tenant' => $tenant->slug]),
        ];
    }

    /**
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        $tenant = $this->invoice->tenant;
        return new BroadcastMessage([
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'message' => "Se ha generado una nueva factura por $" . number_format($this->invoice->amount, 0, ',', '.'),
            'type' => 'invoice_generated',
            'url' => route('tenant.invoices.index', ['tenant' => $tenant->slug]),
        ]);
    }

    /**
     * Determine the broadcast channel.
     */
    public function broadcastOn()
    {
        return ['tenant-updates.' . $this->invoice->tenant_id];
    }

    /**
     * Get the broadcast name.
     */
    public function broadcastType()
    {
        return 'invoice.generated';
    }
}
