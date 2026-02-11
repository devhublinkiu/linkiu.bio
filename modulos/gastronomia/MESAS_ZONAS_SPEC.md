# Especificación de Módulo: Mesas y Zonas (Gastronomía)

## 🎯 Objetivos
- Permitir a los establecimientos organizar su espacio físico en zonas.
- Generar códigos QR únicos para cada mesa que faciliten el pedido digital.
- Implementar un sistema de seguridad basado en tokens para evitar suplantación de mesas.
- Optimizar el checkout omitiendo datos de envío cuando el pedido es desde una mesa.

## 🛠️ Estructura de Datos (Base de Datos)

### 1. Zonas (`zones`)
Representa las áreas físicas del establecimiento.
- `id` (Primary Key)
- `tenant_id` (Relación con Tenant)
- `name` (string): Ej. "Salón Principal", "Terraza", "VIP".
- `created_at` / `updated_at`

### 2. Mesas (`tables`)
- `id` (Primary Key)
- `zone_id` (Relación con Zona)
- `name` (string): Identificador visual, ej. "Mesa 1", "Mesa A5".
- `token` (string, unique): Token alfanumérico aleatorio (8-12 chars) para la URL.
- `capacity` (integer, optional): Capacidad de personas.
- `status` (enum): `active`, `maintenance`, `inactive`.
- `created_at` / `updated_at`

## 🔒 Seguridad y URLs
Para evitar que un usuario adivine la URL de otras mesas, se utilizarán tokens impredecibles:

- **Formato de URL:** `https://tutienda.linkiu.bio/m/{token}`
- **Regeneración:** El administrador podrá regenerar los tokens de una mesa o zona en caso de sospecha de mal uso. Esto invalidará los QRs antiguos inmediatamente.

## 🖥️ Funcionalidades Admin

### Gestión de Espacios
- **CRUD de Zonas:** Crear áreas con nombres descriptivos.
- **CRUD de Mesas:** Asignar mesas a zonas.
- **Generador Masivo:** Herramienta para crear múltiples mesas simultáneamente (ej. "Mesa 1" a "Mesa 20").

### Centro de QRs
- **Exportación:** Generar hoja de impresión (PDF/Imagen) con el QR de cada mesa.
- **Personalización:** El QR incluirá el logo del tenant y el número de mesa.

## 👤 Experiencia del Cliente (Frontend Público)

### Detección y Persistencia
- Al entrar por una URL de mesa, el sistema detecta el `token` y guarda la información de la mesa en el **CartContext** y **Session**.
- Se muestra un banner persistente: *"Pidiendo desde: Mesa 5 (Terraza)"*.

### Checkout Inteligente
- Si se detecta una mesa:
    - Se **ocultan** automáticamente los campos de "Dirección de Envío".
    - El pedido se marca como `tipo: mesa`.
    - En la confirmación del pedido para el admin, aparecerá resaltado el nombre de la mesa y zona.

## 🚀 Próximos Pasos (Fase 1)
1. Crear migraciones para `zones` y `tables`.
2. Implementar modelos y sus relaciones.
3. Desarrollar el Ticker de administración para gestión de Zonas y Mesas en el panel de Gastronomía.
