@component('mail::message')
# Nueva Factura Generada 📄

Hola **{{ $user->name }}**,

Se ha generado una nueva factura para tu tienda **{{ $tenant->name }}**.

## Detalles de la Factura

@component('mail::table')
| | |
|:---|:---|
| **Factura #** | {{ $invoice->id }} |
| **Plan** | {{ $planName }} |
| **Ciclo de Facturación** | {{ $billingCycle }} |
| **Monto** | ${{ number_format($invoice->amount, 0, ',', '.') }} COP |
| **Estado** | {{ ucfirst($invoice->status) }} |
| **Fecha de Emisión** | {{ $invoice->created_at->format('d/m/Y H:i') }} |
@endcomponent

## Métodos de Pago Disponibles

- **Transferencia Bancaria** - Sube tu comprobante de pago
- **Wompi** - Paga con tarjeta de crédito/débito *(próximamente)*

@component('mail::button', ['url' => $paymentUrl])
Ver Factura y Pagar
@endcomponent

Si ya realizaste el pago, por favor sube tu comprobante para que podamos activar tu suscripción.

Gracias por confiar en nosotros,<br>
**Equipo {{ config('app.name') }}**

@component('mail::subcopy')
Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
[{{ $paymentUrl }}]({{ $paymentUrl }})
@endcomponent
@endcomponent