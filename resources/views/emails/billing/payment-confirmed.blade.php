@component('mail::message')
# ¡Pago Confirmado! 🎉

Hola **{{ $user->name }}**,

¡Excelentes noticias! Tu pago ha sido confirmado y tu suscripción está ahora **activa**.

## Detalles de la Suscripción

@component('mail::table')
| | |
|:---|:---|
| **Plan** | {{ $planName }} |
| **Ciclo de Facturación** | {{ $billingCycle }} |
| **Monto Pagado** | ${{ number_format($invoice->amount, 0, ',', '.') }} COP |
| **Fecha de Activación** | {{ now()->format('d/m/Y H:i') }} |
| **Válido Hasta** | {{ $subscription->ends_at->format('d/m/Y') }} |
| **Próximo Pago** | {{ $subscription->next_payment_date->format('d/m/Y') }} |
@endcomponent

## Tu Recibo

Puedes descargar tu recibo oficial desde tu panel de control.

@component('mail::button', ['url' => $dashboardUrl])
Ir a mi Dashboard
@endcomponent

¡Gracias por confiar en {{ config('app.name') }}! Estamos aquí para ayudarte a hacer crecer tu negocio.

Con gratitud,<br>
**Equipo {{ config('app.name') }}**

@component('mail::subcopy')
Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
[{{ $dashboardUrl }}]({{ $dashboardUrl }})
@endcomponent
@endcomponent