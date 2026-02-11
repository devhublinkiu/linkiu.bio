# Módulo: Mis Archivos (Media Manager)

**Aplica a:** Todas las verticales y SuperAdmin.

## Descripción General
Este módulo centraliza la gestión de archivos multimedia del tenant. Es una biblioteca compartida donde todo el equipo puede ver y gestionar los activos del negocio (productos, banners, logos, fotos de perfil).

## Características Implementadas

### 1. Visibilidad Unificada (Team View)
A diferencia de un gestor de archivos tradicional, este módulo indexa automáticamente las subidas de otros módulos:
- **Gastronomía**: Fotos de productos.
- **Sliders**: Banners (Escritorio y Móvil).
- **Configuración**: Logos y Favicons del sitio.
- **Perfil**: Fotos de perfil de todos los miembros del equipo.

### 2. Vista Plana (Flat View)
Para facilitar la búsqueda y evitar que archivos queden ocultos en carpetas "del sistema", la vista raíz muestra **todos los archivos del tenant** en una lista única y cronológica (lo más reciente primero).

### 3. Almacenamiento y Rendimiento
- **Cloud Storage**: Todos los archivos se almacenan en **Amazon S3** para garantizar disponibilidad y escalabilidad.
- **Optimización**: Las imágenes se procesan (webp) antes de subir para reducir peso sin perder calidad (vía `ProductController`).

### 4. Seguridad y Persistencia
- **Borrado Seguro**: El borrado lógico (SoftDelete) elimina el registro de la base de datos pero **mantiene el archivo físico en S3**. Solo un borrado permanente (Force Delete) elimina el activo de la nube.
- **Trazabilidad**: Cada archivo registra quién lo subió (`uploaded_by`).

## Arquitectura Técnica

### Backend
- **Modelo**: `MediaFile`
- **Tabla**: `media_files`
- **Controlador**: `Shared\MediaController` (Index, List, Store, Destroy).
- **Consola**: `media:import` (Comando para sincronizar S3 con la DB y recuperar archivos huérfanos).

### Frontend
- **Componente**: `MediaManagerModal.tsx`
- **Uso**: Se utiliza tanto como página independiente (`/admin/media`) como en modales de selección en otros formularios.

## Permisos
- `media.view`: Ver la biblioteca.
- `media.upload`: Subir nuevos archivos.
- `media.delete`: Eliminar archivos (restringido a archivos del propio tenant).
