# Módulo: Categorías

**Versión:** 1.0  
**Fecha:** 02 de Febrero 2026  
**Responsable:** Darwin Martinez / Antigravity  
**Alcance:** Módulo Transversal (`All`). Aplica a todas las verticales (Dropshipping, Ecommerce, Gastronomía, Servicios).

## 1. Descripción General
Este módulo centraliza la gestión de categorías para organizar los elementos principales de cada negocio. 
*   **SuperAdmin:** Crea una "Biblioteca de Iconos y Categorías Sugeridas" organizada por Vertical.
*   **Tenant:** Crea sus propias categorías seleccionando iconos de esa biblioteca oficial.
*   **Innovación:** Flujo de "Solicitud de Icono" para que los tenants pidan nuevos recursos gráficos.

---

## 2. Actores y Permisos
Es crucial registrar este módulo en el sistema de permisos (`PermissionsSeeder`).

| Actor | Permisos Necesarios | Acciones Principales |
| :--- | :--- | :--- |
| **SuperAdmin** | `sa.categories.manage` | Crear/Editar `CategoryIcons`, Gestionar `IconRequests`. |
| **Tenant** | `tenant.categories.manage` | CRUD de sus Categorías, Solicitar nuevos iconos. |

---

## 3. Modelo de Datos

### A. `CategoryIcon` (SuperAdmin)
Recurso global. Es la biblioteca de iconos aprobados.
*   `id`: PK
*   `name`: string (Ej: "Hamburguesa", "Camiseta")
*   `path`: string (Ruta al SVG/PNG optimizado)
*   `vertical_id`: FK `business_categories` (Nulo = Global/Aplica a todas)
*   `is_active`: boolean

### B. `Category` (Tenant)
La categoría real que usa la tienda.
*   `id`: PK
*   `tenant_id`: FK `tenants`
*   `parent_id`: FK (Self, nullable)
*   `category_icon_id`: FK `category_icons`
*   `name`: string (Ej: "Hamburguesas Premium")
*   `slug`: string (Unique per tenant)
*   `is_active`: boolean

### C. `IconRequest` (Solicitudes)
*   `id`: PK
*   `tenant_id`: FK `tenants`
*   `requested_name`: string
*   `reference_image_path`: string (Imagen subida por el cliente)
*   `status`: enum (`pending`, `approved`, `rejected`)
*   `admin_feedback`: text (Motivo de rechazo)
*   `timestamps`: created_at, updated_at

---

## 4. Flujos de Usuario (UX/UI)

### 4.1 SuperAdmin: Gestión de Biblioteca
*   **Vista:** `Sidebar > Iconos Categorías`
*   **Acciones:**
    *   **Crear Icono:** Formulario con:
        *   Nombre.
        *   **Checkbox:** "Aplica para todas" (Global).
        *   **Select Vertical:** (Si no es global) Dropshipping, Gastro, etc.
        *   **Upload:** Solo SVG/WEBP/PNG.
    *   **Listar:** Tabla con filtros por Vertical.

### 4.2 Tenant: Crear Categoría
*   **Vista:** `Sidebar > Categorías > Crear`
*   **Lógica de Selección:**
    1.  El sistema detecta la Vertical del Tenant (Ej: Restaurante).
    2.  **Muestra Grid de Iconos:** Cargando solo iconos `Globales` + `Vertical = Restaurante`.
*   **Formulario:**
    *   Seleccionar Icono (Visual Grid).
    *   Nombre de Categoría.
    *   Slug (Auto-generado editable).
    *   Categoría Padre (Opcional).

### 4.3 Tenant: Solicitar Nuevo Icono
*   **Trigger:** Botón "¿No encuentras tu icono? **Solicítalo aquí**" en el Grid.
*   **Modal:**
    *   Input: Nombre sugerido.
    *   Upload: Imagen de referencia.
    *   Botón: "Enviar Solicitud".
*   **Notificación:** Al enviar, se notifica al SuperAdmin.

### 4.4 SuperAdmin: Procesar Solicitud
*   **Vista:** `Solicitudes Generales > Iconos`
*   **Acciones:**
    *   **Aprobar:**
        1.  SuperAdmin sube el icono final optimizado.
        2.  Sistema crea `CategoryIcon` oficial.
        3.  Sistema marca solicitud como `approved`.
        4.  **Notificación Toast/DB:** "Tu icono ya está disponible".
    *   **Rechazar:**
        1.  Ingresa motivo.
        2.  **Notificación Toast/DB:** "Solicitud rechazada: [Motivo]".

---

## 5. Implementación Técnica
### Rutas (Web.php)
#### SuperAdmin
```php
Route::resource('category-icons', CategoryIconController::class);
Route::get('icon-requests', [IconRequestController::class, 'index']);
Route::post('icon-requests/{id}/approve', [IconRequestController::class, 'approve']);
Route::post('icon-requests/{id}/reject', [IconRequestController::class, 'reject']);
```

#### Tenant
```php
Route::resource('categories', CategoryController::class);
Route::post('request-icon', [CategoryController::class, 'requestIcon']);
```

---

## 6. Lista de Verificación de Desarrollo
- [ ] Crear Migraciones (`category_icons`, `categories`, `icon_requests`).
- [ ] Crear Modelos y Relaciones.
- [ ] Implementar `CategoryIconController` (SuperAdmin).
- [ ] Implementar `CategoryController` (Tenant) con filtrado de iconos por vertical.
- [ ] Implementar Modal y Lógica de `IconRequest`.
- [ ] **IMPORTANTE:** Agregar módulos a `PermissionsSeeder`.