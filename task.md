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

