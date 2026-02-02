# Linkiu.bio - Definición de Arquitectura y Stack Tecnológico

Este documento sirve como la fuente de verdad inicial para la infraestructura técnica de **Linkiu.bio**, un SaaS multi-vertical (Dropshipping, Gastronomía, Servicios, Ecommerce).

## 1. Stack Tecnológico Principal

### Backend (Core)
*   **Framework**: **Laravel 11** (PHP 8.2+).
    *   *Rol*: Manejo de lógica de negocio, autenticación, autorización, validaciones, Queues (colas de trabajo) y acceso a base de datos.
*   **Arquitectura de API**: **Inertia.js**.
    *   *Rol*: Conector monolítico moderno. Permite servir el Frontend de React desde los controladores de Laravel sin necesidad de construir una API REST separada manualmente.

### Frontend (UI/UX)
*   **Librería**: **React 18+**.
    *   *Lenguaje*: **TypeScript** (`.tsx`) para asegurar tipado estricto en estructuras de datos complejas (productos, órdenes, etc.).
*   **Estilos**: **TailwindCSS v3.4+**.
    *   *Configuración*: Modo JIT estricto, paleta de colores extendida para soporte de temas (Dark/Light/Custom Branding).
*   **Componentes UI**: **Shadcn/UI**.
    *   *Estrategia*: Librería de componentes "Copy-Paste" altamente personalizable, construida sobre Radix UI para accesibilidad.

### Base de Datos & Almacenamiento
*   **RDBMS**: **MySQL 8.0**.
    *   *Motor*: InnoDB.
*   **ORM**: **Eloquent** (Nativo de Laravel).

### Infraestructura & DevTools (Local)
*   **Entorno**: **Laravel Sail** (Docker).
    *   Contenedores para: App (PHP), MySQL, Redis (Cache/Queues), Mailpit (Pruebas de email).
*   **Compilador de Assets**: **Vite**.

---

## 2. Visión General de Arquitectura: "SuperLinkiu"

El sistema se diseñará bajo el concepto de **Multi-Tenancy** (Múltiples inquilinos/organizaciones) sobre una base de código unificada.

*   **Identidad Centralizada**: Un sistema de Login único gestionado por Laravel Breeze/Custom logic.
*   **Verticales Modulares**: Las verticales (Dropshipping, etc.) serán módulos lógicos que se activan según la suscripción de la organización.

---

## 3. Estructura de URLs (Definida)

El sistema utilizará un **Ruteo basado en Paths** (path-based routing) para simplificar la gestión de DNS.

| Área | Patrón de URL | Descripción |
| :--- | :--- | :--- |
| **Website Principal** | `https://linkiu.bio` | Landing page de ventas, precios y registro global. |
| **SuperAdmin** | `https://linkiu.bio/superlinkiu/login` | Acceso exclusivo para administradores de la plataforma. |
| **Tenant Public** | `https://linkiu.bio/{tenant}` | Vista pública del cliente (Ej: Tienda, Catálogo, Menú). |
| **Tenant Admin** | `https://linkiu.bio/{tenant}/admin` | Dashboard de gestión para el dueño del negocio y sus empleados. |

---

## 4. Estructura de Carpetas (Frontend / Inertia)

Para mantener el orden con estas 4 áreas distintas, organizaremos `resources/js` de la siguiente manera:

```
resources/js/
├── Components/         # Componentes UI reutilizables (Botones, Inputs, Modales)
│   ├── ui/             # Componentes base de Shadcn
│   └── Shared/         # Componentes propios compartidos
├── Layouts/            # Layouts principales
│   ├── WebsiteLayout.tsx
│   ├── SuperAdminLayout.tsx
│   ├── TenantPublicLayout.tsx
│   └── TenantAdminLayout.tsx
├── Pages/              # Vistas (Inertia Pages)
│   ├── Website/        # Landing page, Contacto...
│   ├── SuperAdmin/     # Dashboard global, gestión de planes...
│   ├── Tenant/
│   │   ├── Public/     # {tenant} (Frontend de la tienda)
│   │   └── Admin/      # {tenant}/admin (Dashboard del cliente)
│   └── Auth/           # Login, Register (Compartidos o específicos)
└── Types/              # Definiciones de TypeScript globales
```

---

> **Próximos Pasos:**
> 1.  Modelado de Datos inicial (Usuarios vs Tenants vs Roles).
> 2.  Instalación del proyecto.
