@component('mail::message')
# Nuevo Ticket de Soporte

Hola **{{ $user->name }}**,

Se ha creado un nuevo ticket de soporte:

@component('mail::table')
| | |
|:---|:---|
| **Asunto** | {{ $ticket->subject }} |
| **ID** | {{ sprintf('%04d', $ticket->id) }} |
| **Prioridad** | {{ ucfirst(str_replace('_', ' ', $ticket->priority)) }} |
| **Estado** | {{ ucfirst(str_replace('_', ' ', $ticket->status)) }} |
| **Categoría** | {{ ucfirst(str_replace('_', ' ', $ticket->category)) }} |
@if($comment)
    | **Mensaje** | {{ $comment }} |
@endif
@endcomponent

@component('mail::button', ['url' => $actionUrl])
Ver Ticket
@endcomponent

Nuestro equipo de soporte te responderá lo antes posible.

Gracias por contactarnos,<br>
**{{ config('app.name') }}**

@component('mail::subcopy')
Si tienes problemas para hacer clic en el botón "Ver Ticket", copia y pega la siguiente URL en tu navegador:
[{{ $actionUrl }}]({{ $actionUrl }})
@endcomponent
@endcomponent