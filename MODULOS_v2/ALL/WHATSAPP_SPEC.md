# Módulo: NOTIFICACIONES WHATSAPP (Configuración)

## Descripción
Configuración para recibir notificaciones por WhatsApp (Infobip): número administrativo donde llegan alertas de nuevas reservas y pedidos. El módulo está sujeto a feature del plan (`hasFeature('whatsapp')`). Es **clave** para la operación del negocio.

## Clasificación
- **Tipo**: Transversal (compartido entre verticales)
- **Verticales**: Ecommerce, Gastronomía, Servicios
- **Scope**: Por tenant (configuración global del tenant; sin `location_id` en esta pantalla)
- **Límite por plan**: Feature flag (no cantidad; el plan incluye o no el módulo)
- **Soft delete**: N/A

---

## Auditoría: lógica actual

### Origen del número admin
- **Pantalla Notificaciones WhatsApp**: guarda en `tenant.settings['whatsapp_admin_phone']`. No se escribe en ninguna otra columna.
- **Columna** `tenants.contact_phone`: Onboarding / SuperAdmin (ficha del tenant). No se edita en la pantalla de WhatsApp.
- **Origen único para alertas al admin**: `tenant.settings['whatsapp_admin_phone']`. Reservas (RE-03) y pedidos (PE-01) envían solo si `hasFeature('whatsapp')` y ese número está configurado.

### Dónde se envía WhatsApp
- **Al admin**: nueva reserva (linkiu_alert_v1), nuevo pedido (linkiu_order_alert_v1). Siempre a `whatsapp_admin_phone`.
- **Al cliente**: reservas RE-01, RE-02, RE-04; pedidos PE-02 a PE-06. Ver `MODULOS_v2/GASTRONOMY/WHATSAPP_TEMPLATES.md`.

---

## Stack Técnico
- **Backend**: `app/Http/Controllers/Tenant/Admin/WhatsApp/WhatsAppController.php`
- **FormRequest**: `app/Http/Requests/Tenant/Admin/UpdateWhatsAppSettingsRequest.php`
- **Frontend**: `resources/js/Pages/Tenant/Admin/WhatsApp/Settings.tsx` (Inertia + React)
- **Datos**: `tenant.settings['whatsapp_admin_phone']` (persistencia en `tenants.settings` JSON)
- **Integración**: `InfobipService::sendTemplate()` (controladores/traits)

## Reglas de Negocio
1. Solo se puede editar si el tenant tiene la feature `whatsapp` en su plan.
2. Número en formato internacional (E.164): `+?[1-9]\d{1,14}`.
3. Origen único para alertas al admin: `tenant.settings['whatsapp_admin_phone']`.
4. Plantillas: ver `MODULOS_v2/GASTRONOMY/WHATSAPP_TEMPLATES.md`.

## Permisos
| Permiso | Descripción | Seeded |
|---------|-------------|--------|
| `whatsapp.view` | Ver configuración WhatsApp | Sí |
| `whatsapp.update` | Editar configuración WhatsApp | Sí |

## Rutas
- `GET /{tenant}/admin/whatsapp` → `edit` — `tenant.whatsapp.edit`
- `PATCH /{tenant}/admin/whatsapp` → `update` — `tenant.whatsapp.update`

## Archivos
- Controller: `app/Http/Controllers/Tenant/Admin/WhatsApp/WhatsAppController.php`
- FormRequest: `app/Http/Requests/Tenant/Admin/UpdateWhatsAppSettingsRequest.php`
- Page: `resources/js/Pages/Tenant/Admin/WhatsApp/Settings.tsx`
- Servicio: `app/Services/InfobipService.php`
- Canal: `app/Notifications/Channels/InfobipChannel.php`
