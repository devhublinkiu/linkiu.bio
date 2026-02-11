# Módulo: Usuarios (Equipo)

## Descripción
Gestión de miembros del equipo para un tenant. Permite invitar usuarios existentes o crear nuevos usuarios vinculados al negocio, asignar roles y gestionar el acceso.

## Ubicación de Archivos
- **Controlador:** `app/Http/Controllers/Tenant/Admin/MemberController.php`
- **Vista:** `resources/js/Pages/Tenant/Admin/Members/Index.tsx`
- **Rutas:** `routes/web.php` (Grupo `members`)

## Lógica de Negocio
- Vinculación a través de la tabla pivote `tenant_user`.
- Si el correo electrónico no existe en el sistema, se crea un nuevo registro en `users`.
- El **Propietario (owner)** tiene protecciones especiales: no se puede eliminar ni cambiar su rol desde este módulo.
- La eliminación de un miembro es un `detach()`, lo que mantiene al usuario en el sistema pero le quita el acceso al tenant.

## Permisos
- `users.view`: Ver la lista de miembros.
- `users.create`: Agregar/Invitar nuevos miembros.
- `users.update`: Cambiar el rol de un miembro existente.
- `users.delete`: Eliminar a un miembro del equipo.

## Componentes Compartidos
- `Avatar`, `Badge`, `Badge` (UI Library).
- `PermissionDeniedModal`: Para control de acceso visual.
- `Sonner`: Para notificaciones de éxito/error.
