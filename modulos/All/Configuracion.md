# Módulo: Configuración (Settings)

## Descripción
Módulo transversal para gestionar la identidad visual, SEO, integraciones legales e impuestos de cada tenant (negocio).

## Ubicación de Archivos
- **Controlador:** `app/Http/Controllers/Tenant/Admin/SettingsController.php`
- **Vista:** `resources/js/Pages/Tenant/Admin/Settings/Edit.tsx`
- **Rutas:** `routes/web.php` (Grupo `settings`)

## Lógica de Negocio
- Los ajustes se almacenan en la columna JSON `settings` de la tabla `tenants`.
- El cambio de **URL (slug)** tiene restricciones:
  - Primer cambio: Gratuito.
  - Cambios posteriores: Tienen costo y solo se permiten cada 3 meses.
- **Impuestos:** Configuración global para el tenant que se aplica a productos a menos que se especifique lo contrario.

## Permisos
- `settings.view`: Permite ver la página de configuración.
- `settings.update`: Permite modificar cualquier ajuste, incluyendo logo e impuestos.

## Componentes Compartidos
- `PermissionDeniedModal`: Para control de acceso visual.
- `Sonner`: Para notificaciones de guardado.
