# PRODUCTS (Carta Digital Admin) — Auditoría Completa

**Fecha:** 2026-02-14
**Estado:** Cumple 100%

---

## Resumen de cambios

| # | Regla | Hallazgo | Estado |
|---|-------|----------|--------|
| 1 | IDOR — tenant scoping en CRUD | `edit()`, `update()`, `destroy()` no verificaban `tenant_id` del producto | Cumple |
| 2 | Authorization — Gate en controller | No usaba `Gate::authorize()` en ningún método | Cumple |
| 3 | Authorization — Gate en FormRequests | `authorize()` retornaba `true` siempre | Cumple |
| 4 | Validation — `category_id` scoped | `exists:categories,id` sin filtrar por tenant (podía usar categoría de otro negocio) | Cumple |
| 5 | Validation — variantes por `$request->validated()` | Variantes se leían con `$request->input()` sin pasar por validación | Cumple |
| 6 | Storage — 100% BunnyCDN | Imágenes se guardaban en S3. Migrado a `StoresImageAsWebp` + disco `bunny` | Cumple |
| 7 | Storage — URLs dinámicas por `storage_disk` | `image_url` y `gallery_urls` ahora usan `Storage::disk($disk)->url()` | Cumple |
| 8 | Plan limit — productos por plan | No existía límite. Implementado `getLimit('products')` en backend y UI | Cumple |
| 9 | Endpoint — toggle disponibilidad | Se hacía con `PATCH update` enviando todos los campos requeridos | Cumple |
| 10 | Type safety — eliminar `any` | 4 usos de `any` en `Index.tsx` y `ProductForm.tsx` | Cumple |
| 11 | UX — loading state en toggle | Sin feedback visual al cambiar disponibilidad | Cumple |
| 12 | UX — confirmación antes de toggle | Toggle inmediato sin confirmar (afecta menú público) | Cumple |
| 13 | DB transaction — operaciones compuestas | `store()`, `update()`, `destroy()` sin transacción | Cumple |
| 14 | Media register — registro en MediaFile | Imágenes nuevas se registran en la librería unificada | Cumple |
| 15 | Multi-sede — tabla pivote `product_location` | No existía forma de asignar productos a sedes específicas | Cumple |
| 16 | Multi-sede — UI selector de sedes | No existía selector. Implementado con checkboxes en tab Ajustes | Cumple |
| 17 | Multi-sede — validación `location_ids` scoped | `location_ids.*` valida que pertenezcan al tenant actual | Cumple |
| 18 | Cleanup — eliminación limpia de producto | `destroy()` ahora: borra imágenes BunnyCDN, detach locations, elimina variantes | Cumple |
| 19 | BunnyCDN — carpetas organizadas | `uploads/{tenant-slug}/products/` y `uploads/{tenant-slug}/products/gallery/` | Cumple |
| 20 | Migración limpia — `down()` reversible | La migración incluye `down()` que dropea `product_location` y quita `storage_disk` | Cumple |

---

## Archivos modificados

### Backend
- `app/Models/Product.php` — BunnyCDN URLs, relación `locations()`, `storage_disk`
- `app/Http/Controllers/Tenant/Admin/Gastronomy/ProductController.php` — Reescritura completa
- `app/Http/Requests/Tenant/Admin/StoreProductRequest.php` — Gate, scoped validation, location_ids
- `app/Http/Requests/Tenant/Admin/UpdateProductRequest.php` — Gate, scoped validation, location_ids
- `routes/web.php` — Ruta `toggle-availability`
- `database/migrations/2026_02_14_*` — Tabla `product_location` + campo `storage_disk`

### Frontend
- `resources/js/Pages/Tenant/Admin/Gastronomy/Products/Index.tsx` — Límite plan, toggle dedicado, loading, confirmación, locations badges, types
- `resources/js/Pages/Tenant/Admin/Gastronomy/Products/Create.tsx` — Locations prop, limit_reached UI
- `resources/js/Pages/Tenant/Admin/Gastronomy/Products/Edit.tsx` — Locations prop, image_url/gallery_urls
- `resources/js/Components/Tenant/Admin/Gastronomy/Products/ProductForm.tsx` — Location selector, eliminar `any`, BunnyCDN preview
- `resources/js/Components/Tenant/Admin/Gastronomy/Products/ProductViewDrawer.tsx` — BunnyCDN URLs, locations display

---

## Notas importantes

1. **Compatibilidad S3 → BunnyCDN**: Los productos existentes con `storage_disk` en `s3` (o null) siguen funcionando. El accessor `getImageUrlAttribute()` lee el disco del atributo y usa el correcto. Los nuevos productos se guardan siempre en `bunny`.

2. **Tabla pivote `product_location`**: Si un producto NO tiene ninguna location asignada, se interpreta como "disponible en todas las sedes". Esto evita que productos existentes desaparezcan al crear la tabla pivote.

3. **Variantes delete-and-recreate**: Se mantiene la estrategia porque `gastronomy_order_items.variant_options` es un snapshot JSON. Los order items existentes no se ven afectados.

4. **Plan limit key**: `products` — debe configurarse en `plans.limits` JSON, ej: `{"sliders": 5, "products": 50}`.
