# Auditoría: Módulo de Categorías (Tenant Admin)

**Alcance:** Categorías de productos (tenant), central para Carta digital, POS, Pedidos, Menú público.  
**Referencias:** `linkiu_admin_implementation_rules` (skill), `modular/reglas.md`, ACL (reglas §3).

---

## 1. Cumplimiento por estándar

### 1.1 Arquitectura y estructura (Skill §1)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Admin Backend en `.../Tenant/Admin/[Modulo]/` | ✅ | `App\Http\Controllers\Tenant\Admin\CategoryController` |
| Admin Frontend en `.../Pages/Tenant/Admin/[Modulo]/` | ✅ | `resources/js/Pages/Tenant/Admin/Categories/Index.tsx` |
| Modelos tenant en `app/Models/Tenant/...` | ❌ | `Category` está en `app/Models\Category.php`. La skill exige modelos con scope tenant en `app/Models/Tenant/` (PascalCase singular). |
| Namespaces = ubicación en disco | ✅ | Coinciden |

**Acción:** Valorar migrar `Category` a `app/Models/Tenant\Gastronomy\Category.php` (o `Tenant\Category.php`) y usar trait `BelongsToTenant` para alinear con el resto de modelos tenant.

---

### 1.2 Seguridad y aislamiento (Skill §2, Reglas §1)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Multi-tenant: filtrado por `tenant_id` | ✅ | Todas las consultas usan `Category::where('tenant_id', $tenant->id)` o equivalente. |
| Modelo con BelongsToTenant o equivalente | ⚠️ | No usa trait `BelongsToTenant`; el scope se aplica manualmente en el controlador. Riesgo: que en futuras consultas se olvide el `tenant_id`. |
| Rutas con `auth` y `tenant` | ✅ | Rutas dentro del grupo tenant (asumido; conviene verificar en `web.php`). |
| Protección IDOR (edit/update/destroy) | ✅ | `findOrFail` tras `where('tenant_id', $tenant->id)` en `update`, `destroy`, `toggleActive`. |
| Validación de `parent_id` por tenant | ✅ | Se comprueba que el padre exista y pertenezca al tenant. |
| Location-awareness | N/A | Categorías no son por sede en la implementación actual. |

**Detalle crítico – Ciclo en jerarquía:**  
En `update` se evita que una categoría sea su propio padre (`parent_id != id`), pero **no** se evita que el padre sea un **descendiente** (ej.: A → B → C y asignar a C padre = A). Eso permite ciclos en el árbol.  
**Recomendación:** Validar que `parent_id` no sea un descendiente de la categoría actual (recorriendo `parent` hacia arriba o con una regla en FormRequest).

---

### 1.3 Lógica de negocio y código (Skill §3)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| FormRequests dedicados (no validación en controlador) | ❌ | `store` y `update` validan con `$request->validate()` en el controlador. La skill prohíbe validación manual en controladores. |
| Try-catch en operaciones críticas | ⚠️ | `requestIcon` hace `store(..., 's3')` y notificaciones sin try-catch. Si S3 o notificación fallan, se devuelve 500 sin mensaje controlado. |
| Tipado PHP | ✅ | Type hinting en métodos del controlador. |
| Tipado TypeScript | ⚠️ | Interfaces definidas; `categories.links` y `myRequests` como `any[]` en Props. Conviene tipar `PaginationLink[]` y evitar `any`. |

**Acciones:**  
- Crear `StoreCategoryRequest` y `UpdateCategoryRequest` y usarlos en `store`/`update`.  
- En `requestIcon`: try-catch alrededor de `store` y notificaciones; en caso de error, `back()->with('error', ...)` o respuesta 422/500 coherente.

---

### 1.4 UX (Skill §4)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Feedback >300ms (Skeleton/Spinner) | ⚠️ | Toggle activo y eliminar no muestran loading en el botón/fila. Crear/editar no muestra spinner en submit. |
| Notificaciones Sonner, bottom-center | ⚠️ | Solo se usa `toast.success` en delete. Crear/actualizar/toggle usan flash (`back()->with('success')`); hay que asegurar que el layout muestre ese flash con Sonner en la posición definida. |
| Acciones destructivas con AlertDialog | ✅ | Eliminar categoría usa `AlertDialog` con variante destructiva. |
| Estados vacíos con EmptyState + CTA | ❌ | Listado vacío es una fila de tabla con texto "No tienes categorías creadas." La skill exige componente `EmptyState` con iconografía y CTA (ej. "Nueva Categoría"). |
| Responsividad / Drawer en móvil | ✅ | Create/Edit en `Sheet` (drawer); Request Icon en `Dialog`. Adecuado. |

**Acciones:**  
- Estado vacío: usar `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription` y botón "Nueva Categoría".  
- Añadir estado de carga (spinner/disabled) en submit del Sheet y en toggle/delete.

---

### 1.5 Rendimiento (Skill §5)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Evitar N+1 | ✅ | `with(['icon', 'parent'])` y `withCount(['products', 'children'])` en el listado. |
| Paginación en listados dinámicos | ✅ | Backend: `paginate(20)`. |
| Paginación en frontend | ❌ | El listado principal de categorías **no** renderiza `Pagination` con `categories.links`. Si hay más de 20 categorías, no se puede navegar. |
| Selección de columnas | ✅ | `parents` con `select('id', 'name')`. |

**Acción:** En `Index.tsx`, mostrar el componente de paginación usando `categories.links` cuando `categories.data.length > 0` o cuando `last_page > 1`.

---

### 1.6 UI y componentes (Skill §6)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Solo componentes Shadcn/ui | ✅ | Table, Card, Button, Sheet, Dialog, AlertDialog, Select, Input, etc. |
| Idioma 100% español | ✅ | Textos en español. |

---

### 1.7 Infraestructura y lenguaje (Skill §7)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Almacenamiento 100% remoto (Bunny/S3) | ✅ | `requestIcon` usa `store(..., 's3')`. |
| Imágenes WebP / traits | N/A | Iconos de categoría vienen de `CategoryIcon` (gestión SuperAdmin). La imagen de solicitud de icono se sube tal cual; se puede valorar conversión a WebP si se exige para todo. |

---

### 1.8 ACL – Permisos (Reglas §3)

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Permisos por módulo (view/create/update/delete) | ❌ | El sidebar usa `categories.view` pero **no existen** permisos `categories.*` en `PermissionSeeder`. El módulo no está protegido por Gates. |
| Backend: Gates en index/store/update/destroy | ❌ | No hay `Gate::authorize('categories.view')` (ni create/update/delete) en el controlador. |
| Frontend: comprobar permiso + PermissionDeniedModal | ❌ | No se usa `currentUserRole`, `checkPermission` ni `PermissionDeniedModal`. Cualquier usuario con acceso al tenant puede crear/editar/eliminar categorías. |
| Permisos en Seeder | ❌ | No hay entradas para Categorías en `PermissionSeeder`. |

**Acciones (obligatorias para ser “central” y seguro):**  
- Añadir en `PermissionSeeder`: `categories.view`, `categories.create`, `categories.update`, `categories.delete` (módulo "Categorías").  
- En `CategoryController`: `Gate::authorize('categories.view')` en `index`; `categories.create` en `store`; `categories.update` en `update` y `toggleActive`; `categories.delete` en `destroy`; y definir política para `requestIcon` (p. ej. `categories.create` o un permiso específico).  
- En `Index.tsx`: leer `currentUserRole`, implementar `checkPermission` / `handleActionWithPermission`, usar `PermissionDeniedModal` y deshabilitar o interceptar Nueva Categoría, Editar, Eliminar, Toggle y Solicitar icono según permisos.

---

## 2. Riesgos específicos del módulo “central”

- **Productos:** `Product` tiene `category_id` y `StoreProductRequest`/`UpdateProductRequest` validan que la categoría exista y sea del tenant. Si se borra una categoría, los productos que la referencian quedarían con `category_id` huérfano si no se valida o se reasigna. Hoy el controlador impide borrar si `products_count > 0`, pero ese conteo usa la relación `products()` del modelo.
- **Conteo de productos para eliminar:** En `Category`, la relación `products()` filtra por `is_available` y `status = 'active'`. El `withCount('products')` y la comprobación en `destroy` usan ese conteo, por lo que **solo se cuentan productos activos/disponibles**. Una categoría con solo productos inactivos mostraría 0 y permitiría borrar, dejando `category_id` huérfano en esos productos.  
**Recomendación:** Tener una relación sin filtro (p. ej. `allProducts()`) o usar `withCount` con una relación que cuente todos los productos de la categoría, y usar ese conteo en `destroy`.
- **Slug:** La unicidad de slug es por tenant (`slug like $slug%` y sufijo numérico). Correcto.
- **Solicitud de icono (request-icon):** El formulario envía un archivo. Con Inertia, si el envío no es multipart, el archivo puede no llegar. Verificar que la petición se hace como `multipart/form-data` (p. ej. que Inertia/useForm envíe FormData cuando hay `reference_image` File).

---

## 3. Resumen de incumplimientos y mejoras

| Prioridad | Tema | Acción |
|-----------|------|--------|
| Alta | ACL | Añadir permisos en PermissionSeeder; Gates en controlador; PermissionDeniedModal y comprobación de permisos en Index. |
| Alta | Conteo para eliminar | Contar todos los productos (no solo activos) antes de permitir borrar categoría. |
| Alta | FormRequests | Crear StoreCategoryRequest y UpdateCategoryRequest; usarlos en store/update. |
| Alta | Paginación frontend | Mostrar paginación del listado principal con `categories.links`. |
| Media | Estado vacío | Sustituir la fila vacía por componente EmptyState con CTA "Nueva Categoría". |
| Media | Ciclo en árbol | Validar en update (backend) que `parent_id` no sea un descendiente de la categoría. |
| Media | Request icon | Try-catch en store S3 y notificaciones; verificar envío multipart del formulario. |
| Media | Feedback de carga | Spinner/disabled en submit (Sheet) y en toggle/eliminar. |
| Baja | Modelo en Tenant | Valorar mover `Category` a `app/Models/Tenant/...` y usar `BelongsToTenant`. |
| Baja | TypeScript | Tipar `links` como `PaginationLink[]` y evitar `any`. |

---

## 4. Experiencia de usuario (UX) y flujo – Valoración y mejoras

### 4.1 Lo que está bien

- **Estructura de pantalla:** Listado principal + sidebar de solicitudes de iconos es clara y aprovecha bien el espacio.
- **Create/Edit en Sheet:** Crear y editar en un drawer lateral es cómodo y coherente con “Drawers en móvil/tablet”.
- **Selector de iconos:** Buscar y elegir icono en una rejilla con búsqueda mejora mucho la usabilidad frente a un desplegable largo.
- **Evitar borrados peligrosos:** El AlertDialog de eliminar explica bien cuando no se puede (productos o subcategorías) y oculta el botón Eliminar en ese caso.
- **Padre opcional:** "Ninguna (Categoría Principal)" y filtro de la categoría actual en edición evitan errores tontos.

### 4.2 Lo que se puede mejorar

1. **Feedback inmediato:** Al guardar (crear/editar) o al hacer toggle no hay spinner ni deshabilitado del botón; el usuario no sabe si la acción se está procesando. Añadir estado `processing`/loading en botón y, si se quiere, un toast al terminar (además del flash).
2. **Estado vacío:** La tabla vacía con un solo mensaje no invita a la acción. Un EmptyState con icono y botón "Nueva Categoría" haría el flujo más claro y alineado con el resto del admin.
3. **Paginación:** Sin enlaces de paginación, con muchas categorías la experiencia se corta. Añadir paginación bajo la tabla.
4. **Orden y jerarquía en lista:** El listado es plano (tabla); no se ve la jerarquía padre/hijo. Si se quiere que “Categorías” sea central y comprensible, valorar:
   - agrupar por categoría principal y mostrar subcategorías indentadas, o  
   - una columna “Padre” más visible (ya existe pero se puede resaltar).
5. **Solicitud de icono:** El flujo “¿No encuentras el icono? Solicita uno nuevo” está bien; asegurar que al enviar la solicitud se muestre un mensaje de éxito (toast o flash) y que el envío del archivo sea correcto (multipart).
6. **Toggle activo:** El switch de estado está bien; podría mostrarse un toast breve “Estado actualizado” para consistencia con otras pantallas.

En conjunto, la experiencia es buena y el flujo es lógico; las mejoras anteriores la hacen más robusta, predecible y alineada con el resto de módulos y con la skill.

---

## 5. Checklist mínimo pre-despliegue (módulo central)

- [x] Permisos `categories.view|create|update|delete` en PermissionSeeder y asignados a roles.
- [x] Gates en CategoryController (index, store, update, destroy, toggleActive, requestIcon).
- [x] Frontend: comprobación de permisos y PermissionDeniedModal en acciones críticas.
- [ ] Conteo de productos para eliminar basado en “todos los productos”, no solo activos.
- [x] FormRequests para store y update; validación de que `parent_id` no cree ciclos.
- [x] Paginación del listado de categorías en el frontend.
- [x] Estado vacío con EmptyState y CTA.
- [x] Try-catch y mensajes de error controlados en requestIcon (S3 y notificaciones).
- [x] Tipado TypeScript sin `any` (PaginationLink en Props).
- [ ] Multipart solicitud de icono: Inertia envía FormData si hay File; probar en runtime.
- [ ] (Opcional) Migrar Category a app/Models/Tenant/ y BelongsToTenant.
