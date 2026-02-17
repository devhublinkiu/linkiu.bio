# Módulo: SLIDERS (Banners)

## Descripción
Banners/carrusel promocional en el sitio público del tenant. Administrable desde el panel admin: imágenes (móvil y desktop), enlace (ninguno, externo, interno), programación por fechas y estado. Clicks trackeados vía ruta pública. Las imágenes se almacenan **solo en Bunny.net** (no S3).

## Clasificación
- **Tipo**: Transversal (compartido entre verticales)
- **Verticales**: Ecommerce, Gastronomía, Servicios
- **Scope**: Por sede (`location_id` obligatorio)
- **Límite por plan**: Sí (implementado en Planes y validado en admin)
- **Soft delete**: No

## Stack Técnico
- **Modelo**: `App\Models\Tenant\All\Slider` (trait `BelongsToTenant`), con `location_id`
- **Controlador**: `Tenant/Admin/SliderController.php` (type hints; trait `StoresImageAsWebp`)
- **FormRequests**: `StoreSliderRequest.php`, `UpdateSliderRequest.php` (mensajes en español)
- **Frontend Admin**: `Pages/Tenant/Admin/Sliders/Index.tsx` (Inertia + React)
- **Frontend Público**: `BannerSlider.tsx` (carrusel) + ruta `GET /sliders/{slider}/click`
- **Almacenamiento**: **100% Bunny.net** (sin S3); subida WebP con trait `StoresImageAsWebp`
- **Estilos**: TailwindCSS + Shadcn UI

## Esquema de Base de Datos (objetivo)

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id` | bigint | No | auto | PK |
| `tenant_id` | foreignId | No | — | FK → tenants (cascade) |
| `location_id` | foreignId | Sí | null | FK → locations (cascade) |
| `storage_disk` | string(10) | No | bunny | Siempre `bunny` (sliders 100% Bunny, sin S3) |
| `name` | string(255) | No | — | Nombre administrativo / alt text |
| `image_path` | string | No | — | Ruta en Bunny (móvil) |
| `image_path_desktop` | string | Sí | null | Ruta en Bunny (desktop) |
| `link_type` | enum | No | none | none, internal, external |
| `external_url` | string | Sí | null | URL si link_type=external |
| `linkable_type` / `linkable_id` | morphs | Sí | null | Polimórfico si link_type=internal |
| `start_at` | timestamp | Sí | null | Inicio programación |
| `end_at` | timestamp | Sí | null | Fin programación |
| `active_days` | json | Sí | null | Días activos [0–6] |
| `clicks_count` | integer | No | 0 | Contador de clicks |
| `sort_order` | integer | No | 0 | Orden de aparición |
| `is_active` | boolean | No | true | Activo/Inactivo |
| `created_at` / `updated_at` | timestamp | — | — | — |

## Flujo de Trabajo

```mermaid
graph TD
    subgraph "Panel Admin — /{tenant}/admin/sliders"
        A[Usuario abre Sliders] -->|GET index| B[SliderController::index]
        B -->|Filtro location_id + paginate 15 + appends query| C[Retorna sliders + locations + límite]
        C --> D["Index.tsx — Filtro sede<br/>Tabla desktop / Cards móvil<br/>EmptyState si vacío — Skeleton al filtrar"]

        D -->|Click Nuevo Slider| E[Sheet: formulario + sede]
        E -->|Submit| F[StoreSliderRequest]
        F -->|Válido| G[trait storeImageAsWebp → Bunny WebP]
        G --> H[Slider::create + registerMedia + Sonner]
        F -->|Inválido| I[Errores en español]

        D -->|Click Editar| J[Sheet con datos]
        J -->|Submit| K[UpdateSliderRequest]
        K --> L[WebP a Bunny si hay nueva imagen + slider->update]

        D -->|Click Eliminar| M[AlertDialog destructive]
        M -->|Confirmar| N[delete en disco + slider->delete + Sonner]

        D -->|Toggle Switch| O[router.put update is_active]
    end

    subgraph "Público — Home"
        P[PublicController::index] -->|selected_table?.location_id| Q[Slider::visible + filtro sede]
        Q --> R[BannerSlider.tsx — carrusel]
        T[Click banner] --> U[GET /sliders/{id}/click]
        U --> V[increment clicks_count + redirect]
    end
```

## Reglas de Negocio (afinadas)
1. **Por sede**: Cada slider pertenece a una `location_id`. En admin se filtra por sede (y por tenant). En público se muestran solo sliders de la sede actual (si aplica).
2. **Orden**: `sort_order` ascendente; reordenable en admin (drag o inputs).
3. **Solo visibles**: Público usa scope `visible()` (activo + fechas start/end + active_days).
4. **Imágenes**: Solo Bunny; subida en WebP. Eliminar archivo en Bunny al borrar slider o al reemplazar imagen.
5. **Try-catch**: En store/update al subir o borrar archivos en Bunny (operación crítica).
6. **Límite por plan**: Validar en `store()` y en UI (contador y botón deshabilitado al tope), como en Tickers.

## Estándares de implementación (checklist)
- [x] Multi-tenant + location: `BelongsToTenant` y filtro por `location_id` (admin y público). **IDOR:** si el usuario tiene sede asignada (`tenant_user.location_id`), solo ve/gestiona sliders de esa sede (index, update, destroy).
- [x] FormRequests: StoreSliderRequest y UpdateSliderRequest (sin validación en controlador); mensajes en español.
- [x] Try-catch en subida/borrado de archivos (Bunny).
- [x] Paginación: `paginate(15)` + `appends($request->query())` y SharedPagination en frontend.
- [x] Select de columnas: select explícito en index; appends image_url/desktop_image_url.
- [x] EmptyState: componente con iconografía y CTA cuando no hay sliders.
- [x] AlertDialog: variante `destructive` en la acción de eliminar.
- [x] Responsividad: tabla en desktop; Cards en móvil.
- [x] TypeScript: sin `any` (tipado en Select, etc.).
- [x] Sonner bottom-center; mensajes específicos.
- [x] Feedback: Loader2 en submit cuando processing; Skeleton al cambiar filtro de sede.
- [x] Almacenamiento: solo disco `bunny` (sin S3); WebP vía trait `StoresImageAsWebp` (scaleDown 1920px).
- [x] Límite por plan: en Planes (MODULE_HAS_LIMIT) y en admin (contador + validación en store).

## Permisos
| Permiso | Descripción | Seeded |
|---------|-------------|--------|
| `sliders.view` | Ver listado de sliders | Sí |
| `sliders.create` | Crear sliders | Sí |
| `sliders.update` | Editar sliders | Sí |
| `sliders.delete` | Eliminar sliders | Sí |

## Archivos afectados
- Migración: `location_id` y `storage_disk` en `sliders`.
- Modelo: `App\Models\Tenant\All\Slider` — `location_id`, relación `location`, URLs solo Bunny; appends `image_url`/`desktop_image_url`.
- Controlador: `Tenant/Admin/SliderController` — FormRequests, try-catch en subida/borrado, paginate(15)+appends, select explícito, límite por plan, trait `StoresImageAsWebp`, type hints.
- FormRequests: `StoreSliderRequest`, `UpdateSliderRequest` (mensajes español).
- Frontend: EmptyState, SharedPagination, Cards móvil, AlertDialog destructive, Sonner, Skeleton, Loader2, tipos TS.
- Proxy `/media`: rutas con `/sliders/` se sirven solo desde Bunny (sin S3).
- Planes: `sliders` en límites por plan. Público: sliders filtrados por sede.

## QA / Paso QA

Checklist del protocolo de QA (`linkiu_qa_and_testing_protocol`). El módulo se considera **Paso QA** cuando se cumple todo lo siguiente:

| Criterio | Estado |
|----------|--------|
| Aislamiento tenant/sede verificado (no acceso a datos de otros tenants por URL) | Pendiente (ejecutar QA manual) |
| Relaciones y eliminaciones sin huérfanos / comportamiento esperado | N/A (sliders sin hijos) |
| Formularios: vacíos, tipos incorrectos; errores en español desde FormRequest | Cumplido |
| Filtro por sede y EmptyState cuando no hay resultados | Cumplido |
| Paginación y preserveState del filtro (appends query) | Cumplido |
| Feedback (Spinner/Sonner) en Guardar/Eliminar | Cumplido |
| AlertDialog en acciones destructivas | Cumplido |
| Estados de carga (Skeleton al filtrar, Loader2 en submit) | Cumplido |
| Responsividad móvil (Cards, touch targets) | Cumplido |
| Select específico; imágenes 100% Bunny WebP (trait StoresImageAsWebp) | Cumplido |
| Cero 422/500 no controlados en flujo normal | Pendiente (ejecutar QA manual) |

*Módulo alineado con `linkiu_admin_implementation_rules`. Marcar "Cumplido" en aislamiento y 422/500 tras QA manual.*
