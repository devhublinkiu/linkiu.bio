@component('mail::message')
# Pago Recibido - En Revisión ⏳

Hola **{{ $user->name }}**,

¡Gracias por tu pago! Hemos recibido tu comprobante de pago y está siendo revisado por nuestro equipo.

## Detalles del Pago

@component('mail::table')
| | |
|:---|:---|
| **Factura #** | {{ $invoice->id }} |
| **Monto** | ${{ number_format($invoice->amount, 0, ',', '.') }} COP |
| **Método de Pago** | Transferencia Bancaria |
| **Estado** | Pendiente de Revisión |
| **Fecha de Reporte** | {{ now()->format('d/m/Y H:i') }} |
@endcomponent

## ¿Qué Sigue?

Nuestro equipo revisará tu comprobante en las próximas **24-48 horas**. Una vez aprobado:

✅ Tu suscripción se activará automáticamente
✅ Recibirás un correo de confirmación
✅ Podrás descargar tu recibo oficial

@component('mail::button', ['url' => $statusUrl])
Ver Estado del Pago
@endcomponent

Si tienes alguna pregunta, no dudes en contactarnos.

Gracias por tu paciencia,<br>
**Equipo {{ config('app.name') }}**

@component('mail::subcopy')
Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
[{{ $statusUrl }}]({{ $statusUrl }})
@endcomponent
@endcomponent