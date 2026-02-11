@component('mail::message')
# ¡Bienvenido a {{ config('app.name') }}! 🎉

Hola **{{ $user->name }}**,

¡Gracias por crear tu tienda en {{ config('app.name') }}! Estamos emocionados de tenerte con nosotros.

## Tu Tienda

@component('mail::table')
| | |
|:---|:---|
| **Nombre** | {{ $tenant->name }} |
| **URL** | {{ $tenant->domain }} |
| **Plan** | {{ $planName }} |
@endcomponent

## Período de Prueba

Tienes **48 horas de prueba gratuita** para explorar todas las funcionalidades. Tu período de prueba termina el
**{{ $trialEndsAt }}**.

## Próximos Pasos

1. **Personaliza tu tienda** - Configura tu logo, colores y preferencias
2. **Agrega tus productos** - Comienza a crear tu catálogo
3. **Explora las funcionalidades** - Descubre todo lo que puedes hacer
4. **Selecciona tu plan** - Antes de que termine tu prueba

@component('mail::button', ['url' => $dashboardUrl])
Ir a mi Dashboard
@endcomponent

Si tienes alguna pregunta, nuestro equipo de soporte está aquí para ayudarte.

¡Mucho éxito con tu tienda!<br>
**Equipo {{ config('app.name') }}**

@component('mail::subcopy')
Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:
[{{ $dashboardUrl }}]({{ $dashboardUrl }})
@endcomponent
@endcomponent