# Reglas de Desarrollo - Linkiu.Bio

Este documento establece las reglas críticas para el desarrollo y mantenimiento de la plataforma, asegurando la integridad de los datos y la correcta visualización de recursos.

## 1. Aislamiento Estricto de Datos (Tenant vs. SuperAdmin)

**Regla de Oro:** NUNCA mezclar información entre inquilinos (Tenants) ni entre un Inquilino y el SuperAdmin.

### Principios:
*   **Contexto del Inquilino:** Siempre verificar `app('currentTenant')`. Si existe, TODAS las consultas a base de datos deben estar filtradas por el `id` de ese inquilino.
*   **Contexto Global (SuperAdmin):** Si no hay inquilino (`currentTenant` es null) y el usuario es SuperAdmin, se asume contexto global.
    *   **Cuidado:** El SuperAdmin NO debe ver datos mezclados de todos los tenants en vistas que no sean explícitamente de "Auditoría" o "Listado Global".
    *   **Aislamiento:** En vistas como "Gestor de Archivos", el SuperAdmin debe ver SOLO sus archivos globales (carpeta `uploads/global`), nunca los de los usuarios.
*   **Relaciones Eloquent:**
    *   Usar siempre la relación `$tenant->relation()` en lugar de `Model::all()`.
    *   Evitar consultas crudas que olviden el `where('tenant_id', ...)` o el scope `BelongsToTenant`.

### Ejemplo Incorrecto:
```php
// MAL: Trae archivos de todos los clientes
$files = MediaFile::all(); 
```

### Ejemplo Correcto:
```php
// BIEN: Filtra por el tenant actual o muestra global si es SuperAdmin
if ($tenant) {
    $files = $tenant->mediaFiles; // o MediaFile::where('tenant_id', $tenant->id)->get();
} else {
    $files = MediaFile::whereNull('tenant_id')->get(); // Solo archivos del sistema
}
```

---

## 2. Manejo de Imágenes y Archivos Media

**Objetivo:** Garantizar que ninguna imagen salga rota (404) independientemente del entorno (Local, S3) o la vista (Tenant, SuperAdmin).

### Reglas de Implementación:
1.  **Almacenamiento (Storage):**
    *   Usar siempre `Storage::disk('s3')` (o el disco configurado) para guardar y eliminar.
    *   Estructura de carpetas recomendada:
        *   `uploads/{tenant_id}/...` para archivos de clientes.
        *   `uploads/global/...` o `site-assets/...` para archivos del sistema.

2.  **Generación de URLs:**
    *   **NUNCA** guardar URLs hardcodeadas (ej. `http://localhost/...`) en la base de datos si es posible evitarlo. Guardar el `path` relativo (ej. `uploads/1/imagen.png`).
    *   Usar Accessors en los Modelos (ej. `getProfilePhotoUrlAttribute`) para generar la URL completa dinámicamente.
    *   Si se usa S3, utilizar `Storage::disk('s3')->url($path)`.

3.  **Proxy de Archivos (Anti-Roturas):**
    *   Debido a que el frontend puede intentar acceder a rutas relativas como `/media/site-assets/logo.png`, DEBE existir una ruta proxy en `routes/web.php` que intercepte estas peticiones y sirva el archivo desde S3.
    *   **Ruta Proxy Global:**
        ```php
        Route::get('/media/{path}', [\App\Http\Controllers\Shared\MediaController::class, 'file'])
            ->where('path', '.*') // Permite subcarpetas
            ->name('media.proxy');
        ```
    *   Esta regla asegura que si una imagen no carga por URL directa de S3 (por permisos o CORS), el backend la sirva correctamente.

4.  **Frontend (React/Inertia):**
    *   Manejar siempre el evento `onError` en las etiquetas `<img>` críticas (Logos, Avatares).
    *   Mostrar un placeholder o UI alternativa si la imagen falla, en lugar del icono de imagen rota del navegador.

### Checklist de Verificación para Imágenes:
- [ ] ¿La imagen se guarda en la carpeta del tenant correcto?
- [ ] ¿La base de datos guarda el path relativo?
- [ ] ¿El modelo tiene un Accesor `_url` que resuelve la ruta completa?
- [ ] ¿Existe la ruta proxy `/media/{path}` en `web.php`?
- [ ] ¿El componente de imagen tiene fallback (`onError`)?

---

## 3. Sistema de Roles y Permisos (ACL)

**Objetivo:** Seguridad granular. Cada acción importante debe estar protegida.

### Reglas de Implementación:
1.  **Cobertura Total por Módulo:**
    *   Cada módulo debe tener sus permisos definidos (ej. `[modulo].view`, `[modulo].create`, `[modulo].update`, `[modulo].delete`).
    *   **NO** asumir que si un usuario puede ver (`view`), puede editar. Validar cada acción por separado.

2.  **Protección en Vistas (Create/Edit):**
    *   Las vistas de creación y edición (`create.tsx`, `edit.tsx`) DEBEN verificar permisos al cargar.
    *   **UI:** Si el usuario no tiene permiso, deshabilitar inputs y botones de guardado.
    *   **Modal de Bloqueo:** Implementar interceptores (`onClickCapture`) en botones críticos para mostrar el `PermissionDeniedModal` en lugar de simplemente ocultar el botón (para feedback visual).
    *   **Backend:** Proteger las rutas de almacenamiento (`store`, `update`, `destroy`) con Middleware o Gates (ej. `$this->authorize('create', Model::class)`). NUNCA confiar solo en el frontend.

3.  **Hábito de Desarrollo:**
    *   Antes de iniciar cualquier módulo, preguntar: "¿Qué permisos necesita esto?".
    *   Agregar los permisos al Seeder (`RolesAndPermissionsSeeder`).

---

## 4. UI/UX y Estándares de Frontend

**Objetivo:** Mantener una experiencia de usuario consistente, profesional y fácil de usar.

### Reglas de Implementación:
1.  **Feedback de Acciones (Mouse Pointer):**
    *   Toda función o elemento que requiera una acción del usuario (clic, hover interactivo) DEBE tener el cursor `cursor-pointer`.
    *   Esto aplica a botones, enlaces, tarjetas clickeables y filas de tabla interactivas.

2.  **Consistencia de Layouts:**
    *   **SuperAdmin:** Siempre usar `SuperAdminLayout` (con su Navbar, Sidebar y Footer específicos).
    *   **Tenant Admin:** Siempre usar `AppLayout` (o el layout específico del panel de tenant).
    *   **NUNCA** usar layouts genéricos (`GuestLayout`, `AuthenticatedLayout`) para vistas internas de administración a menos que sea explícitamente necesario (ej. Login, Error 404).

3.  **Idioma y Terminología:**
    *   **Español:** Todos los textos visibles para el usuario deben estar en **Español**.
    *   **Claridad:** Evitar términos técnicos confusos (ej. "Payload", "Tenant ID", "Stack Trace"). Usar lenguaje natural (ej. "Datos enviados", "Identificador de Tienda", "Detalle del error").

4.  **Consistencia de Diseño:**
    *   Seguir los patrones de diseño existentes (Shadcn/UI).
    *   Mantener la paleta de colores y tipografía definida en el sistema.
