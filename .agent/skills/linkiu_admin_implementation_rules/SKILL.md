---
name: linkiu_admin_implementation_rules
description: Reglas Mandatorias de Implementación para Módulos Administrativos (Admin) en Linkiu. Define estándares de arquitectura, seguridad, UX y rendimiento.
---

# Reglas de Implementación de Módulos Admin (Linkiu)

Este documento contiene el mandato técnico para la creación, modificación y auditoría de módulos en el panel administrativo de Linkiu. Seguir estas reglas es obligatorio para garantizar la escalabilidad, seguridad y estética premium de la plataforma.

## 1. Arquitectura y Estructura de Archivos
Toda implementación debe seguir estrictamente la jerarquía multi-tenant:
- **Admin Backend**: `app/Http/Controllers/Tenant/Admin/[Modulo]/`
- **Admin Frontend (Inertia)**: `resources/js/Pages/Tenant/Admin/[Modulo]/`
- **Modelos**: **Regla fija:** Los modelos con scope de tenant (BelongsToTenant) deben ubicarse en `app/Models/Tenant/[Modulo]/` (Singular, PascalCase), para no mezclarlos con los globales de SuperAdmin (`app/Models/`: Tenant, Plan, Subscription). Los que ya existan en `app/Models/` pueden permanecer hasta que se decida migrarlos para alinear.
- **Componentes Locales**: Si son exclusivos del módulo, ubicarlos en `Components/` dentro de la ruta del frontend del módulo.
- **Namespaces**: Deben ser un reflejo exacto de la ubicación física en el disco.

## 2. Seguridad y Aislamiento (Mandato Crítico)
- **Multi-Tenant Isolation**: Todos los modelos deben usar el trait `BelongsToTenant`. Está prohibido omitir el filtrado por `tenant_id`.
- **Aislamiento de SuperAdmin**: Los inquilinos nunca deben ver datos globales o de otros inquilinos.
- **Seguridad de Rutas**: Todas las rutas deben estar envueltas en los middlewares `auth` y `tenant`.
- **Protección de IDOR**: Validar siempre que el recurso solicitado pertenece al `tenant_id` y `location_id` del usuario.
- **Location-Awareness**: En módulos operativos (Gastronomía, Pedidos), el filtrado por `location_id` es obligatorio. **En caso de duda, PREGUNTAR AL USUARIO.**

## 3. Lógica de Negocio y Código
- **Validación**: Usar `FormRequests` dedicados. Prohibida la validación manual en controladores.
- **Manejo de Errores**: Bloques `try-catch` en **operaciones críticas** (subida de archivos, APIs externas, transacciones DB, operaciones en lote), devolviendo JSON estandarizado (422 validación, 500 sistema). No es obligatorio en CRUD simple con FormRequest (Laravel ya devuelve 422/500 según corresponda).
- **Desacoplamiento**: Lógica compleja en `Traits` o `Servicios`. Los controladores solo orquestan.
- **Tipado**: Type hinting en PHP e Interfaces/Types claros en TypeScript (Prohibido el uso de `any`).

## 4. Experiencia de Usuario (UX Premium)
- **Feedback Visual**: Acciones asíncronas >300ms deben mostrar `Skeleton` o `Spinner`.
- **Notificaciones**: Usar `Sonner` en posición `bottom-center`. Mensajes específicos (ej: "Mesa liberada") en lugar de genéricos.
- **Acciones Destructivas**: Uso obligatorio de `AlertDialog` con variante `destructive`. Prohibido el `window.confirm()` nativo.
- **Estados Vacíos**: Uso obligatorio de componentes `EmptyState` con iconografía y CTA cuando no hay datos.
- **Responsividad**: Diseño Mobile-First usando breakpoints de Tailwind. Priorizar `Drawers` en móvil vs `Modales` en escritorio.

## 5. Rendimiento de Datos
- **Consultas N+1**: Prohibido el acceso a relaciones sin Eager Loading (`with()`).
- **Paginación**: Todo listado dinámico debe usar `paginate()` en backend y componentes de paginación en frontend.
- **Selección de Columnas**: Evitar `select *`. Pedir solo los campos necesarios.

## 6. Sistema de UI y Componentes
- **Shadcn Only**: Solo usar componentes de `resources/js/Components/ui/`.
- **Protocolo de Componente Faltante**: Si falta un componente de Shadcn, **PAUSAR, NOTIFICAR AL USUARIO Y ESPERAR APROBACIÓN** antes de instalarlo o continuar.

## 7. Infraestructura y Lenguaje
- **Idioma**: 100% Español para el usuario final. Cero "Spanglish".
- **Almacenamiento**: 100% Bunny.net. Prohibido el almacenamiento local (`Storage::disk('local')`).
- **Optimización**: Subir imágenes en formato WebP mediante los Traits estandarizados.

---
**MANDATO FINAL:** Si un desarrollo viola cualquiera de estas reglas, se considera defectuoso y debe ser refactorizado inmediatamente.
