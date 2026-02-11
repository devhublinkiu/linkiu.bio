# Especificación: CRUD de Productos (Gastronomía)

## Campos del Formulario de Creación/Edición

### **📝 Sección 1: Información Básica**

#### 1. Nombre del Producto
- **Tipo:** Input text
- **Descripción:** Nombre del plato/producto
- **Validación:** Requerido, máximo 255 caracteres
- **Ejemplo:** "Bandeja Paisa", "Pizza Margarita"

#### 2. Categoría
- **Tipo:** Select/Dropdown
- **Descripción:** Categoría del producto
- **Opciones:** Solo categorías activas del CRUD de categorías
- **Validación:** Requerido
- **Ejemplo:** "Platos Fuertes", "Entradas", "Bebidas"

#### 3. Descripción Corta
- **Tipo:** Textarea (2-3 líneas)
- **Descripción:** Resumen breve para mostrar en cards/listados
- **Validación:** Opcional, máximo 150 caracteres
- **Ejemplo:** "Deliciosa pizza con mozzarella fresca y albahaca"

---

### **💰 Sección 2: Precios y Costos**

#### 4. Precio de Venta
- **Tipo:** Input number con formato de moneda
- **Descripción:** Precio de venta al cliente
- **Validación:** Requerido, mayor a 0
- **Formato:** $25,000 COP
- **Ejemplo:** 25000

#### 5. Costo del Producto
- **Tipo:** Input number con formato de moneda
- **Descripción:** Costo de preparación/ingredientes
- **Validación:** Opcional, debe ser menor que precio de venta
- **Formato:** $12,000 COP
- **Ejemplo:** 12000
- **Funcionalidad:** Calcula y muestra margen automáticamente: `(precio - costo) / precio * 100`

#### 6. SKU / Código Interno
- **Tipo:** Input text
- **Descripción:** Código único interno
- **Validación:** Opcional, único por tenant
- **Ejemplo:** "PIZZA-MAR-001"

---

### **🖼️ Sección 3: Imágenes**

> [!IMPORTANT]
> **OBLIGATORIO:** El sistema debe redimensionar automáticamente todas las imágenes a formato cuadrado (1:1).
> Los usuarios subirán imágenes de cualquier tamaño y el backend las procesará.

#### 7. Imagen Principal
- **Tipo:** Upload de imagen (drag & drop)
- **Descripción:** Foto principal del producto
- **Validación:** 
  - **OBLIGATORIO** (campo requerido)
  - Máximo 2MB
  - Formatos: JPG, PNG, WebP
- **Procesamiento Backend:**
  - Redimensionar a 800x800px (cuadrada)
  - Optimizar calidad
  - Generar thumbnail 200x200px
- **Preview:** Muestra vista previa al subir

#### 8. Galería de Imágenes
- **Tipo:** Upload múltiple de imágenes
- **Descripción:** Fotos adicionales del producto
- **Validación:**
  - Opcional
  - **Máximo 5 imágenes**
  - 2MB cada una
  - Formatos: JPG, PNG, WebP
- **Procesamiento Backend:**
  - Redimensionar cada imagen a 800x800px (cuadrada)
  - Optimizar calidad
- **Funcionalidad:** Drag & drop para reordenar

---

### **⏱️ Sección 4: Detalles Gastronómicos**

#### 9. Tiempo de Preparación
- **Tipo:** Input number + Select (minutos)
- **Descripción:** Tiempo estimado de preparación
- **Validación:** Opcional, número entero positivo
- **Ejemplo:** 15, 30, 45
- **Uso:** Mostrar al cliente y gestionar tiempos en cocina

#### 10. Calorías
- **Tipo:** Input number
- **Descripción:** Calorías aproximadas del plato
- **Validación:** Opcional, número entero positivo
- **Ejemplo:** 450
- **Uso:** Información nutricional para clientes

#### 11. Alérgenos
- **Tipo:** Checkboxes múltiples
- **Descripción:** Ingredientes que pueden causar alergias
- **Opciones:**
  - ☐ Gluten
  - ☐ Lácteos
  - ☐ Huevo
  - ☐ Frutos secos
  - ☐ Mariscos
  - ☐ Soya
  - ☐ Pescado
- **Validación:** Opcional
- **Almacenamiento:** JSON en base de datos

#### 12. Etiquetas/Tags
- **Tipo:** Checkboxes múltiples
- **Descripción:** Características especiales del plato
- **Opciones:**
  - ☐ Vegano
  - ☐ Vegetariano
  - ☐ Sin gluten
  - ☐ Picante 🌶️
  - ☐ Recomendado del chef
  - ☐ Nuevo
  - ☐ Orgánico
- **Validación:** Opcional
- **Almacenamiento:** JSON en base de datos
- **Uso:** Filtros en menú digital

---

### **⚙️ Sección 5: Variantes y Modificadores**

> [!IMPORTANT]
> Esta sección permite personalizar el producto (Ej: Términos de carne, Adiciones, Sabores).

#### 16. Grupos de Variantes
- **Tipo:** Lista dinámica (CRUD anidado)
- **Campos por Grupo:**
  1. **Nombre:** (Ej: "Elige el término", "Salsas", "Tamaño") - *Requerido*
  2. **Tipo de Selección:**
     - 🔘 Selección Única (Radio) - Ej: Término de carne
     - ☑️ Selección Múltiple (Checkbox) - Ej: Toppings extra
  3. **Requerido:** Si/No (Switch)
  4. **Límites (Solo para múltiple):** Mínimo y Máximo de opciones.

#### 17. Opciones de Variantes (Items)
- **Tipo:** Lista dentro de cada Grupo
- **Campos por Opción:**
  1. **Nombre:** (Ej: "Bien asado", "Queso Extra") - *Requerido*
  2. **Precio Adicional:** (Ej: +$2.000) - *Default 0*
  3. **Estado:** Activo/Agotado

---

### **⚙️ Sección 6: Configuración y Estado**

#### 13. Disponibilidad
- **Tipo:** Toggle/Switch
- **Descripción:** Indica si el producto está disponible para venta
- **Opciones:**
  - ✅ Disponible
  - ❌ Agotado
- **Default:** Disponible
- **Uso:** Control rápido sin eliminar el producto

#### 14. Producto Destacado
- **Tipo:** Toggle/Switch
- **Descripción:** Marca el producto como destacado
- **Opciones:**
  - ⭐ Destacado
  - ○ Normal
- **Default:** No destacado
- **Uso:** Sección especial en menú digital

#### 15. Estado
- **Tipo:** Radio buttons o Select
- **Descripción:** Estado general del producto
- **Opciones:**
  - ● Activo (visible en el menú)
  - ● Inactivo (oculto, no eliminado)
- **Default:** Activo
- **Uso:** Productos temporales o de temporada

---

## Reglas de Implementación

### **1. Idioma**
- ✅ Todos los textos en español
- ✅ Mensajes de validación en español
- ✅ Placeholders en español

### **2. Componentes UI**
- ✅ Usar **SOLO** componentes del sistema existente
- ❌ **NO** crear componentes nuevos sin consultar
- ❌ **NO** agregar estilos personalizados a componentes
- ✅ Usar componentes en su forma nativa

### **3. Procesamiento de Imágenes**
> [!CAUTION]
> **CRÍTICO:** El backend DEBE redimensionar automáticamente todas las imágenes a formato cuadrado.
> No confiar en que el usuario suba imágenes del tamaño correcto.

**Especificaciones técnicas:**
- Imagen principal: 800x800px (cuadrada)
- Thumbnail: 200x200px (cuadrada)
- Galería: 800x800px cada imagen (cuadrada)
- Formato de salida: WebP (optimizado)
- Calidad: 85%

### **4. Validaciones**
- Imagen principal: **OBLIGATORIA**
- Nombre: **OBLIGATORIO**
- Categoría: **OBLIGATORIA**
- Precio: **OBLIGATORIO**
- Resto de campos: Opcionales

---

## Estructura de Base de Datos

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY,
    tenant_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    sku VARCHAR(100),
    image VARCHAR(255) NOT NULL, -- OBLIGATORIO
    gallery JSON, -- Máximo 5 imágenes
    preparation_time INT,
    calories INT,
    allergens JSON,
    tags JSON,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_tenant_category (tenant_id, category_id),
    INDEX idx_available (is_available),
    INDEX idx_featured (is_featured)
);

CREATE TABLE product_variant_groups (
    id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('radio', 'checkbox') DEFAULT 'radio',
    min_selection INT DEFAULT 0,
    max_selection INT DEFAULT 1,
    is_required BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE product_variant_options (
    id BIGINT PRIMARY KEY,
    group_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price_adjustment DECIMAL(10,2) DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES product_variant_groups(id) ON DELETE CASCADE
);
```

---

## Botones de Acción

- **[Cancelar]** - Vuelve a la lista sin guardar
- **[Guardar]** - Guarda el producto y vuelve a la lista
- **[Guardar y crear otro]** - Guarda y limpia el formulario

---

## Componentes UI Reutilizables

Basado en la investigación del código existente, usaremos los siguientes componentes:

1. **Upload de Imágenes:** `MediaInput` (usa el `MediaManagerModal` del proyecto).
2. **Selección de Categoría:** `Components/ui/select.tsx`.
3. **Checkboxes (Alérgenos/Tags):** `Components/ui/checkbox.tsx`.
4. **Toggle/Switch (Disponibilidad/Destacado):** `Components/ui/switch.tsx`.
5. **Navegación de Formulario:** `Components/ui/tabs.tsx` (para separar las 5 secciones).
6. **Contenedores:** `Components/ui/card.tsx` para agrupar campos.

## Infraestructura Técnica

- **Procesamiento de Imágenes:** Actualmente el sistema guarda las imágenes directamente en S3 sin redimensionar. Se recomienda instalar `Intervention Image` en el backend para cumplir con el requisito de redimensionamiento automático a cuadrado.
- **Formato de Moneda:** Seguiremos el patrón `Intl.NumberFormat` con moneda `COP` ya usado en otros componentes del Dashboard.
- **Validaciones:** Se usarán los `StoreProductRequest` y `UpdateProductRequest` de Laravel para asegurar la integridad de los datos.

---

*Última actualización: 2026-02-05*
