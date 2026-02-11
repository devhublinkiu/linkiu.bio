# Especificación Técnica: Módulo de Sedes (Locations)

Este módulo permite gestionar múltiples puntos de atención física para un negocio. Es un módulo transversal que aplica a todas las verticales (Gastronomía, Ecommerce, Servicios, etc.).

## 1. Información General
- **Estado**: Propuesta Aprobada
- **Alcance**: Universal (Aplica a todas las verticales)
- **Propósito**: Centralizar la información física del negocio para visualización pública y lógica operativa (horarios y ubicación).

## 2. Estructura de Datos (`locations`)

| Campo | Tipo |Descripción |
| :--- | :--- | :--- |
| `name` | string | Nombre de la sede. |
| `manager` | string | Nombre del encargado de la sede. |
| `description` | string | Descripción corta de la sede. |
| `is_main` | boolean | Indica si es la sede principal. |
| `phone` | string | Teléfono de contacto. |
| `whatsapp` | string | Número de WhatsApp operativo. |
| `whatsapp_message` | text | Mensaje predeterminado para el enlace de WhatsApp. |
| `state` | string | Departamento. |
| `city` | string | Ciudad. |
| `address` | text | Dirección física completa. |
| `latitude` | decimal(10,8) | Coordenada de latitud para mapas. |
| `longitude` | decimal(11,8) | Coordenada de longitud para mapas. |
| `opening_hours` | json | Horarios de atención por día (JSON). |
| `social_networks` | json | Enlaces a redes sociales específicas de la sede (JSON). |
| `is_active` | boolean | Para activar/desactivar la sede sin borrarla. |

## 3. Lógica de Componentes

### 3.1 Captura de Ubicación (Admin)
- Se implementará un selector de mapa (basado en Leaflet) para que el administrador pueda marcar el punto exacto.
- El sistema guardará la `latitude` y `longitude` al confirmar el punto en el mapa.

### 3.2 Botones de Navegación (Público)
- El sistema generará enlaces profundos (Deep Links) para facilitar la llegada del cliente:
    - **Google Maps**: `https://www.google.com/maps/search/?api=1&query={lat},{lng}`
    - **Waze**: `https://waze.com/ul?ll={lat},{lng}&navigate=yes`

### 3.3 Gestión de Horarios
- Se utilizará una estructura JSON para permitir turnos complejos. 
- Ejemplo de estructura: `{ "monday": [{ "open": "08:00", "close": "12:00" }, { "open": "14:00", "close": "18:00" }] }`.

## 4. Diseño y UX
- Se utilizarán los componentes UI existentes (Card, Input, Button, Switch).
- El formulario de edición estará organizado por secciones (Información Básica, Ubicación, Horarios y Redes).
- Se respetará el idioma español en toda la interfaz.
