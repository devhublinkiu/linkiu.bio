# Especificación Técnica - Módulo de Sedes (Locations)

## 📌 Descripción General
El módulo de Sedes permite a los Tenant administrar múltiples ubicaciones físicas de su negocio. Es un módulo transversal que sirve de base para la vertical de Gastronomía (asociación de mesas, pedidos y reservas) y otras verticales futuras.

## 🗂️ Estructura de Archivos
- **Controlador:** `app/Http/Controllers/Tenant/Admin/LocationController.php`
- **Modelo:** `app/Models/Location.php`
- **Vistas (Inertia/React):**
    - `resources/js/Pages/Tenant/Admin/Locations/Index.tsx` (Listado)
    - `resources/js/Pages/Tenant/Admin/Locations/Create.tsx` (Creación)
    - `resources/js/Pages/Tenant/Admin/Locations/Edit.tsx` (Edición)
    - `resources/js/Pages/Tenant/Admin/Locations/Show.tsx` (Detalle/Vista previa)
- **Componentes:**
    - `resources/js/Components/Tenant/Admin/Locations/LocationForm.tsx` (Formulario compartido)

## 🛡️ Seguridad y Permisos
El módulo utiliza **Laravel Gates** para la protección del backend y el componente `PermissionDeniedModal` para el frontend.

### Permisos Registrados:
- `locations.view`: Ver listado y detalle de sedes.
- `locations.create`: Crear nuevas sedes.
- `locations.update`: Editar sedes existentes y activar/desactivar.
- `locations.delete`: Eliminar sedes (protección especial para sede principal).

### Control de Acceso:
- Todas las rutas están bajo el middleware `tenant` y `auth`.
- El controlador implementa `Gate::authorize('permission.name')` en cada método.

## 🚀 Funcionalidades Clave
1. **Sede Principal:** Cada tenant debe tener una sede marcada como `is_main: true`. Esta sede no puede ser eliminada.
2. **Geolocalización:** Integración con **Nominatim (OpenStreetMap)** para búsqueda automática de coordenadas a partir de la dirección.
3. **Mapa Interactivo:** Uso de **Leaflet** para que el usuario ajuste manualmente el pin en el mapa.
4. **Horarios Flexibles:** Soporte para múltiples rangos de horarios por día y funcionalidad de "Replicar Lunes" para agilizar la carga.
5. **Aislamiento Multisede:** Preparado para la estrategia multisede mediante `location_id` en modelos operativos.

## 🧪 Validación
- **Frontend:** Uso de `useForm` de Inertia con feedback visual de errores por campo.
- **Backend:** Validación estricta en `store` y `update` para asegurar integridad de coordenadas, teléfonos y formatos de horarios.

## 🛠️ Notas de Implementación
- Se eliminaron logs innecesarios (`console.error` en geocoder).
- Los estilos siguen el sistema de diseño basado en **Shadcn/UI**.
- Se requiere la ejecución de `PermissionSeeder` para activar las capacidades del módulo en entornos nuevos.
