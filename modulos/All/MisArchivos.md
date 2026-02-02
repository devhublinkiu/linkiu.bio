# Módulo: Mis Archivos (Media Manager)

**Aplica a:** Todas las verticales y SuperAdmin.

## Descripción General
Este módulo centraliza la gestión de archivos multimedia (imágenes, documentos) del tenant o del superadmin.
Su componente principal es el **Media Manager**, un modal que permite:
1.  Ver la biblioteca de archivos existentes.
2.  Subir nuevos archivos (drag & drop o selección).
3.  Seleccionar un archivo para devolver su URL a un input o formulario.

## Componentes

### 1. Backend
-   **Modelo**: `MediaFile` (o similar).
-   **Tabla**: `media_files`
    -   `id`
    -   `tenant_id` (nullable, null = superadmin o compartido globalmente si aplica)
    -   `path` (ruta en storage)
    -   `url` (url publica)
    -   `disk` (s3, public, local)
    -   `mime_type`
    -   `size`
    -   `alt_text` (opcional)
-   **Controller**: `MediaController` (API para listar, subir, eliminar).

### 2. Frontend (Shared Component)
-   **Componente**: `MediaManagerModal.tsx`
    -   **Props**:
        -   `open`: boolean
        -   `onClose`: () => void
        -   `onSelect`: (file: MediaFile) => void
        -   `multiple`: boolean (futuro)
    -   **Tabs**:
        -   *Biblioteca*: Grid de imágenes con paginación/infinite scroll.
        -   *Subir*: Zona de carga.

### 3. Integración UI
-   **Input de Archivo**: Un componente `MediaInput` que reemplace los `input type="file"` tradicionales. Muestra la previsualización y un botón "Cambiar/Seleccionar" que abre el modal.

## Tareas Pendientes
- [ ] Crear migración y modelo `MediaFile`.
- [ ] Crear `MediaController` (Store, Index, Destroy).
- [ ] Crear componente `MediaManagerModal` (UI + Lógica).
- [ ] Crear componente `MediaInput` (Wrapper para usar en formularios).
- [ ] Integrar en módulo "Mis Archivos" (Vista principal).
- [ ] Integrar en formularios existentes (ej. Crear Plan - Cover).
