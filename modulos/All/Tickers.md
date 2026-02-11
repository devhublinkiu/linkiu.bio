# Módulo: Tickers (Barra de Anuncios)

## Descripción
Permite a los administradores crear y gestionar barras de anuncios horizontales que aparecen en la parte superior del sitio público. Útil para promociones, avisos de envío u ofertas temporales.

## Ubicación de Archivos
- **Controlador:** `app/Http/Controllers/Tenant/Admin/TickerController.php`
- **Vista:** `resources/js/Pages/Tenant/Admin/Tickers/Index.tsx`
- **Modelo:** `app/Models/Ticker.php`

## Lógica de Negocio
- Los tickers pueden tener un color de fondo personalizado.
- Se pueden activar/desactivar individualmente.
- Opcionalmente pueden incluir un enlace (link).
- Aislamiento de tenant mediante el trait `BelongsToTenant`.

## Permisos
- `tickers.view`: Ver la lista de tickers.
- `tickers.create`: Crear nuevos tickers.
- `tickers.update`: Editar tickers existentes.
- `tickers.delete`: Eliminar tickers.

## Mejoras Pendientes (Audit)
- Implementar `Gate::authorize` en el backend.
- Integrar `PermissionDeniedModal` en el frontend.
- Registrar permisos en el `PermissionSeeder`.
