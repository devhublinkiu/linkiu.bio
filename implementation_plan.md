# Plan de Implementación: Ruteo Multi-tenant Core

Este plan detalla cómo transformar la instalación base de Laravel Breeze en una arquitectura Multi-tenant funcional donde conviven el Sitio Público, SuperAdmin y Múltiples Tenants.

## Objetivo
Implementar la infraestructura base para que una sola instalación de Laravel sirva:
1.  `linkiu.bio` (Landing Page)
2.  `linkiu.bio/superlinkiu` (Tu Panel Admin)
3.  `linkiu.bio/{tenant}` (Tiendas de Clientes)

## 1. Migraciones y Modelos (Base de Datos)

El primer paso es crear las tablas físicas que diseñamos en la Fase 1.

### [NEW] `database/migrations/xxxx_create_tenants_table.php`
Crearemos la tabla `tenants` con:
*   `slug` (string, unique, index) -> Identificador en la URL.
*   `name` (string) -> Nombre del negocio.
*   `domain` (nullable) -> Para dominios custom futuros.

### [NEW] `database/migrations/xxxx_create_tenant_user_table.php`
Tabla pivote `tenant_user`:
*   `user_id`, `tenant_id`.
*   `role` (string) -> 'owner', 'manager', 'employee'.

### [MODIFY] `app/Models/User.php`
*   Agregar relación `tenants()` (BelongsToMany).
*   Agregar método `hasRole($tenantId, $role)`.

## 2. Middleware y Ruteo (Backend)

Laravel necesita saber "dónde está" el usuario basándose en la URL.

### [NEW] `app/Http/Middleware/HandleTenantRequests.php`
Este middleware interceptará las rutas que empiecen por `/{tenant}`.
1.  Extraerá el primer segmento de la URL.
2.  Buscará si existe un `Tenant` con ese slug.
3.  Si existe, lo inyectará en el Service Container de Laravel (`app()->instance('currentTenant', $tenant)`).
4.  Si no existe, lanzará 404.

### [MODIFY] `routes/web.php`
Reestructuración total del archivo de rutas:

```php
// 1. Landing Page (Global)
Route::get('/', [MarketingController::class, 'index']);

// 2. SuperAdmin (Protegido por auth + is_super_admin)
Route::prefix('superlinkiu')->middleware(['auth', 'super_admin'])->group(function() {
    Route::get('/dashboard', ...);
});

// 3. Tenant Zone (Protegido por middleware HandleTenant)
Route::prefix('{tenant}')->middleware(HandleTenantRequests::class)->group(function() {
    
    // 3.1 Tenant Public (Tienda visible)
    Route::get('/', [TenantStoreController::class, 'index']);

    // 3.2 Tenant Admin (Protegido por auth + pertenencia al tenant)
    Route::prefix('admin')->middleware(['auth', 'can:access-tenant'])->group(function() {
        Route::get('/dashboard', ...);
    });
});
```

## 3. Frontend (Inertia Shared Props)

El frontend necesita saber si está en modo "Tenant" o "Global".

### [MODIFY] `app/Http/Middleware/HandleInertiaRequests.php`
Inyectar props globales:
```php
'auth' => [
    'user' => $request->user(),
    'currentTenant' => $request->route('tenant'), // Si estamos en zona tenant
],
```

## 4. Verification Plan

### Automated Tests
*   **Test Unitario de Modelo**: Crear un usuario, un tenant y verificar la relación.
*   **Test de Middleware**:
    *   `GET /tienda-falsa` -> Debe dar 404.
    *   `GET /tienda-real` -> Debe dar 200 y cargar el tenant correcto.

### Manual Verification
1.  Ejecutar migraciones.
2.  Crear manualmente un tenant en DB (`tinker`).
3.  Visitar `/mi-tienda` y ver si carga una página básica.
