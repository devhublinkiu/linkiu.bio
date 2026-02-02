# Linkiu.bio - Plan de Implementación

- [ ] **Fase 1: Definición y Arquitectura (Actual)**
    - [x] Definir Stack Tecnológico (Laravel + React/Inertia) <!-- id: 0 -->
    - [x] Definir Estructura de URLs y Carpetas <!-- id: 1 -->
    - [x] Diseñar Esquema de Base de Datos (ERD) <!-- id: 2 -->
        - [x] Definir Tablas Core: Users, Tenants, Roles <!-- id: 3 -->
        - [x] Definir Relaciones Multi-tenant <!-- id: 4 -->

- [ ] **Fase 2: Inicialización del Proyecto**
    - [x] Crear proyecto Laravel con Sail <!-- id: 5 -->
    - [x] Configurar Inertia + React + TypeScript <!-- id: 6 -->
    - [x] Instalar TailwindCSS + Shadcn/UI <!-- id: 7 -->
    - [x] Configurar Ruteo (Middleware para Tenants) <!-- id: 8 -->

- [ ] **Fase 3: Desarrollo "SuperLinkiu"**
    - [x] Implementar Modelos y Migraciones (Add SuperUser) <!-- id: 9 -->
    - [x] Login Centralizado (Auth) <!-- id: 10 -->
    - [x] Dashboard SuperAdmin <!-- id: 11 -->
    - [x] Layout SuperAdmin (Sidebar + Shadcn/UI) <!-- id: 12 -->
    - [x] Implementar Verticales y Categorías <!-- id: 13 -->
        - [x] Migraciones y Modelos (Vertical, BusinessCategory) <!-- id: 14 -->
        - [x] Relación Tenant -> Category <!-- id: 15 -->
        - [x] Seeder de Datos Iniciales <!-- id: 16 -->
        - [x] Gestión de Categorías en SuperAdmin (CRUD) <!-- id: 17 -->
    
    - [x] Gestión Global de Usuarios <!-- id: 18 -->
        - [x] Controlador de Usuarios (SuperAdmin) <!-- id: 19 -->
        - [x] Vista Listado de Usuarios (Tabla + Filtros) <!-- id: 20 -->
        - [x] Acciones (Ver detalles, Banear/Desactivar) <!-- id: 21 -->
    
    - [x] Módulo Configuración (Uploads S3/MinIO) <!-- id: 22 -->
        - [x] Migración y Modelo SiteSettings <!-- id: 23 -->
        - [x] Controlador Settings (Manejo de Archivos) <!-- id: 24 -->
        - [x] Vista Configuración (Formulario con Previsualización) <!-- id: 25 -->

- [ ] **Fase 4: Refinamiento & ACL (Actual)**
    - [x] Implementar Roles y Permisos (ACL) <!-- id: 26 -->
    - [x] Refinar UI de Creación de Roles <!-- id: 27 -->
    - [x] Verificar Etiquetas de Roles en Navbar <!-- id: 28 -->
    - [x] Asegurar Controladores con Gates <!-- id: 29 -->
    - [x] Implementar Modal de Permisos (UX) <!-- id: 31 -->
    - [x] Manejar 403 en Formularios (Validación Frontend) <!-- id: 32 -->
    - [x] Verificación Final y Build <!-- id: 30 -->

- [ ] **Fase 5: Permisos SuperAdmin (ACL Global)**
    - [x] Agregar Trait HasRoles a User (Custom Implementation) <!-- id: 33 -->
    - [x] Crear Seeder de Permisos Globales (`sa.*`) <!-- id: 34 -->
    - [x] Asignar Rol 'Super Admin' al usuario inicial <!-- id: 35 -->
    - [x] Refactorizar `SuperAdminPermissionsSeeder.php`
    - [x] Definir operaciones CRUD granulares
    - [x] Agrupar por módulos ('Tienda', 'Contenido', 'Usuarios')
    - [x] Actualizar Controladores SuperAdmin (Tenant, User, Role, Plan, Category, Media, Payment)
    - [x] Integrar `PermissionDeniedModal` en vistas Frontend (Index)
    - [x] Verificar consistencia con Sidebar y ejecutar Build
    - [x] Proteger Sidebar SuperAdmin <!-- id: 36 -->
    - [x] Proteger Rutas y Controladores SuperAdmin <!-- id: 37 -->
    
- [ ] **Fase 6: Gestión Completa SuperAdmin (Faltantes)**
    - [x] Gestión de Roles Globales (CRUD) <!-- id: 38 -->
        - [x] Controlador `RoleController` (SuperAdmin) <!-- id: 39 -->
        - [x] Vistas: Index, Create (Nueva Vista), Edit <!-- id: 40 -->
    - [x] Creación de Nuevos Miembros (Usuarios) <!-- id: 41 -->
        - [x] Implementar `create` y `store` en `UserController` <!-- id: 42 -->

