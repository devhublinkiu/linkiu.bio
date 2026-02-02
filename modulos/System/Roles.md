# Arquitectura de Roles y Permisos (ACL)

Este documento define la estructura técnica para implementar un sistema de **Roles Personalizados por Inquilino (Tenant)**.

## 1. Visión General
El objetivo es permitir que cada Administrador de Tienda (Tenant Admin) cree sus propios roles (ej: "Cajero", "Editor", "Logística") y asigne permisos específicos a estos roles.

## 2. Base de Datos
Necesitamos una estructura flexible que soporte roles del sistema (globales/base) y roles creados por usuarios.

### Nuevas Tablas

#### `permissions`
Catálogo maestro de todas las acciones posibles en el sistema. Definido por nosotros (Desarrolladores).
- `id`: PK
- `name`: string (ej: `product.create`, `order.view`)
- `label`: string (ej: "Crear Productos")
- `module`: string (ej: "Inventario", "Ventas") - Para agrupar en la UI
- `guard_name`: string (default: `web`)

#### `roles`
Roles definidos. Pueden ser del sistema (para todos) o específicos de un tenant.
- `id`: PK
- `tenant_id`: FK `tenants.id` (Nullable).
    - `NULL`: Rol del Sistema (ej: 'Owner', 'SuperAdmin' si aplica).
    - `NOT NULL`: Rol personalizado creado por un Tenant específico.
- `name`: string (ej: "Cajero")
- `guard_name`: string
- `is_system`: boolean (Para proteger roles base que no se pueden borrar)

#### `role_has_permissions` (Pivote)
Relación Muchos a Muchos entre Roles y Permisos.
- `permission_id`
- `role_id`

### Modificaciones a Tablas Existentes

#### `tenant_user` (Pivote de Acceso)
Actualmente tiene un campo `role` (string).
- **Cambio:** Agregar columna `role_id` (FK -> `roles.id`).
- **Migración:**
    1.  Mantener `role` (string) temporalmente para migrar datos.
    2.  Crear roles base en tabla `roles` (ej: 'Admin' tenant_id=null).
    3.  Actualizar `role_id` basado en el string `role`.
    4.  Eliminar columna `role` antigua (o mantenerla como 'flag' de histórico/backup si se desea, pero mejor eliminar para normalizar).

## 3. Lógica de Negocio (Backend)

### Seeders
Necesitamos un `PermissionSeeder` robusto que popule la tabla `permissions` con todas las capacidades del sistema.
*   *Verticales:* Usaremos el campo `module` o una tabla adicional si necesitamos filtrar qué permisos ve cada tipo de negocio, pero por ahora `module` es suficiente.

### Middleware / Gates
En lugar de verificar roles (`$user->hasRole('admin')`), verificaremos permisos (`$user->can('product.create')`).
Esto permite que un "Cajero" pueda crear productos si el dueño así lo configura.

Recuperación de permisos:
1.  Identificar Tenant actual.
2.  Buscar en `tenant_user` el registro para `(user_id, tenant_id)`.
3.  Obtener el `role_id`.
4.  Cargar los permisos de ese rol.
5.  Registrarlos en el `Gate` de Laravel para ese request.

## 4. Interfaces de Usuario (Frontend)

### A. Gestión de Roles (Para el Dueño de la Tienda)
*   **Ruta:** `/admin/settings/roles`
*   **Vista:** Tabla de roles creados.
*   **Acciones:** Crear Rol, Editar Permisos, Borrar Rol.
*   **Editor:** Un formulario con casillas de verificación agrupadas por Módulo (Inventario, Usuarios, Configuración, etc.).

### B. Asignación de Roles (En Usuarios)
*   **Ruta:** `/admin/users` (o Equipo)
*   **Acción:** Al invitar o editar un miembro, un dropdown cargará los roles disponibles (`where tenant_id = current O tenant_id = null`).

## 5. Plan de Implementación
1.  [ ] Crear migraciones (`permissions`, `roles`, pivot, update `tenant_user`).
2.  [ ] Crear Modelos (`Permission`, `Role`) y relaciones en `User` y `Tenant`.
3.  [ ] Crear `PermissionSeeder` inicial.
4.  [ ] Implementar lógica de `Gates` en un ServiceProvider o Middleware.
5.  [ ] Crear CRUD de Roles en el Panel de Tenant.
6.  [ ] Actualizar gestión de miembros para usar `role_id`.
