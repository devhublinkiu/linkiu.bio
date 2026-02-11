# Módulo: WhatsApp (Notificaciones)

**Versión:** 1.0  
**Fecha:** 10 de Febrero 2026  
**Responsable:** Darwin Martinez / Antigravity  
**Alcance:** Módulo Transversal (`All`). Aplica a todas las verticales que requieran notificaciones transaccionales.

## 1. Descripción General
Este módulo centraliza la configuración de notificaciones automáticas para el negocio y sus clientes, integrándose con la plataforma **Infobip**.

*   **Administrador (Tenant):** Configura el número de WhatsApp donde recibirá alertas de nuevos pedidos y reservas.
*   **Clientes:** Reciben confirmaciones y recordatorios automáticos (si el plan lo permite).
*   **Regla de Oro:** El envío de mensajes está estrictamente ligado al plan de suscripción (`whatsapp_notifications`).

---

## 2. Actores y Permisos
Registrado en `PermissionSeeder.php`.

| Actor | Permisos Necesarios | Acciones Principales |
| :--- | :--- | :--- |
| **Dueño / Admin** | `whatsapp.view` | Ver configuración e instrucciones. |
| **Dueño / Admin** | `whatsapp.update` | Actualizar número de alertas. |

---

## 3. Arquitectura Técnica
El sistema utiliza un servicio centralizado para garantizar que las reglas de negocio se cumplan en todo el ecosistema.

### A. Centralización de Reglas (`InfobipService`)
Todas las notificaciones pasan por un "embudo" de validación:
1.  Se detecta el Tenant actual.
2.  Se verifica la feature `whatsapp_notifications`.
3.  Si no está activo en el plan, el mensaje **no se envía** y se registra en logs de auditoría.

### B. Plantillas Universales
Las plantillas están pre-aprobadas en Infobip y se documentan en `modulos/WHATSAPP_TEMPLATES.md`. No son editables por el tenant para garantizar rapidez y cumplimiento de políticas.

---

## 4. Flujos de Usuario (UX/UI)

### 4.1 Configuración
*   **Vista:** `Configuración > WhatsApp`
*   **Estados:** 
    *   **Activo:** Muestra badge verde y permite editar el teléfono.
    *   **Bloqueado (Plan):** Muestra alerta de "Mejorar Plan", badge ámbar y bloquea el botón de guardar.

### 4.2 Restricción Proactiva
*   **Sidebar:** Si el plan no incluye el módulo, se muestra el badge **PRO**. Si el usuario tiene el permiso de facturación, se le invita a subir de nivel; de lo contrario, se muestra el candado de permisos.

---

## 5. Implementación
### Backend
*   **Controller:** `WhatsAppController.php` (Protegido con Gates y Validation).
*   **Engine:** `InfobipService.php` (Seguridad de plan a nivel de servicio).
*   **Model:** Se almacena en el campo `settings` de la tabla `tenants`.

### Frontend
*   **Página:** `WhatsApp/Settings.tsx` (React + Inertia).

---

## 6. Lista de Verificación
- [x] Agregar permisos a `PermissionSeeder`.
- [x] Blindaje de `InfobipService` contra envíos sin plan.
- [x] Protección de `WhatsAppController` con `Gate::authorize`.
- [x] Validación de formato internacional de teléfono.
- [x] Documentación de plantillas en `WHATSAPP_TEMPLATES.md`.
