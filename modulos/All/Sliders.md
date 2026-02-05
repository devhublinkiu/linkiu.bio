# Modulo de Sliders

**Versión**: 1
**Fecha**: 04 de febrero del 2026
**Elaborado**: Darwin Martinez / Antigravity
**Alcance**: Módulo Transversal (`All`). Aplica a todas las verticales.

## Objetivo
Permitir al administrador del tenant gestionar banners promocionales en la página de inicio para destacar productos, categorías o enlaces externos, con capacidades de programación y analítica básica.

## Detalles Técnicos

### 1. Base de Datos (`sliders`)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | BigInteger | PK |
| `tenant_id` | BigInteger | FK -> tenants |
| `name` | String | Nombre interno / Alt Text |
| `image_path` | String | Ruta de la imagen (Móvil/Desktop unificada) |
| `image_path_desktop` | String (Nullable) | Opcional: Imagen específica para desktop si se requiere mayor calidad |
| `link_type` | Enum | `none`, `internal`, `external` |
| `external_url` | String (Nullable) | URL para link externo |
| `linkable_type` | String (Nullable) | Polimórfico (Product, Category) |
| `linkable_id` | BigInteger (Nullable) | Polimórfico ID |
| `start_at` | DateTime (Nullable) | Fecha inicio programación |
| `end_at` | DateTime (Nullable) | Fecha fin programación |
| `active_days` | Json (Nullable) | Días activos `[1,3,5]` (Lunes, Mie, Vie) |
| `clicks_count` | Integer | Contador de clicks (Analítica) |
| `sort_order` | Integer | Orden de visualización (0 default) |
| `is_active` | Boolean | Estado global (Active/Inactive) |
| `timestamps` | - | created_at, updated_at |

### 2. Estándares de Diseño
*   **Media**: Imagen unificada de **1200 x 600 px** (Relación 2:1).
    *   *Funcionalidad*: Se escala a 400x200px en móvil (Retina friendly) y se ve nítida en Desktop.
*   **Componentes UI**:
    *   Uso de `ShadCN/ui` (Card, Input, Button, DatePicker, Select/Combobox).
    *   **Drag & Drop**: Para ordenar los sliders.
    *   **Preview**: Previsualización de la imagen cargada.

### 3. Lógica de Negocio
*   **Enlaces Internos**: Usa relación polimórfica. El usuario busca un producto/categoría en un Combobox y se guarda la referencia ID, no la URL hardcoded.
*   **Cache Observer**: Al crear/editar/eliminar un Slider, se debe limpiar la caché de la `HomePage` del tenant automáticamente.
*   **Contador de Clicks**: Endpoint liviano (`/t/sliders/{id}/click`) que incrementa el contador y redirige al destino.

## Vistas (Tenant Admin)
1.  **Index**: Listado sorteable, con toggle de estado rápido y métrica de clicks.
2.  **Create/Edit**: Formulario con validación de fechas (`start < end`) y subida de imagen optimizada.

## Integración Frontend (Public)
*   Componente `SliderSection` en `Welcome.tsx`.
*   Renderizado condicional basado en fecha/hora actual y `active_days`.
