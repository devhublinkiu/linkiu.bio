# MÃ³dulo: INVENTARIO (GastronomÃ­a)

## DescripciÃ³n
GestiÃ³n de inventario de ingredientes e insumos para gastronomÃ­a. Control de stock por sede, registro de movimientos (entradas/salidas), alertas de stock mÃ­nimo, y cÃ¡lculo automÃ¡tico de costo promedio ponderado.

## ClasificaciÃ³n
- **Tipo**: Operativo (vertical GastronomÃ­a)
- **Scope**: Por tenant y por sede (location_id en stocks y movimientos)
- **LÃ­mite por plan**: No (puede configurarse en futuro)

## Stack TÃ©cnico
- **Modelos**: App\Models\Tenant\Gastronomy\InventoryItem, InventoryStock, InventoryMovement
- **Controladores**: Tenant/Admin/Inventory/InventoryItemController.php, InventoryStockController.php, InventoryMovementController.php
- **FormRequests**: StoreInventoryItemRequest, UpdateInventoryItemRequest, StoreInventoryMovementRequest, UpdateInventoryStockRequest
- **Frontend**: Inventory/Items/Index.tsx (Fase 1), Stocks/Index.tsx y Movements/Index.tsx (Fase 2)

## Esquema BD

### Tabla: inventory_items
CatÃ¡logo de ingredientes/insumos.

- id: bigint (PK)
- tenant_id: bigint (FK tenants cascade)
- name: varchar(255) - Nombre del item
- slug: varchar(255) - Slug Ãºnico por tenant
- sku: varchar(100) - CÃ³digo interno (opcional, Ãºnico por tenant)
- description: text - DescripciÃ³n del item
- unit: enum (kg, g, l, ml, units, pieces)
- cost_per_unit: decimal(15,4) - Costo promedio ponderado
- image: varchar(255) - Ruta en Bunny
- storage_disk: varchar(50) - s3 (Bunny)
- category: varchar(100) - CategorÃ­a libre
- status: enum (active, inactive)
- timestamps

**Ãndices:**
- (tenant_id, status)
- (tenant_id, category)
- UNIQUE (tenant_id, slug)
- UNIQUE (tenant_id, sku)

### Tabla: inventory_stocks
Stock actual por item y sede.

- id: bigint (PK)
- tenant_id: bigint (FK tenants cascade)
- inventory_item_id: bigint (FK inventory_items cascade)
- location_id: bigint (FK locations cascade)
- quantity: decimal(15,4) - Stock actual
- min_stock: decimal(15,4) - Umbral para alertas
- max_stock: decimal(15,4) - Stock mÃ¡ximo recomendado
- last_movement_at: timestamp
- timestamps

**Ãndices:**
- UNIQUE (inventory_item_id, location_id)
- (tenant_id, location_id)
- (tenant_id, location_id, min_stock)

**Accessors:**
- is_low_stock: boolean (quantity <= min_stock && quantity > 0)
- is_out_of_stock: boolean (quantity <= 0)

### Tabla: inventory_movements
Registro inmutable de movimientos (auditorÃ­a).

- id: bigint (PK)
- tenant_id: bigint (FK tenants cascade)
- inventory_item_id: bigint (FK inventory_items cascade)
- location_id: bigint (FK locations cascade)
- type: enum (entry, exit)
- reason: enum (purchase, adjustment, consumption, waste, transfer, return, initial)
- quantity: decimal(15,4) - Siempre positivo, type define +/-
- unit_cost: decimal(15,4) - Costo unitario (en compras)
- total_cost: decimal(15,4) - Costo total del movimiento
- previous_stock: decimal(15,4) - Stock antes
- new_stock: decimal(15,4) - Stock despuÃ©s
- reference: varchar(255) - Ej: Factura #123
- notes: text
- user_id: bigint (FK users set null)
- timestamps

**Ãndices:**
- (tenant_id, inventory_item_id, location_id) â†’ idx_mov_tenant_item_loc
- (tenant_id, location_id, created_at) â†’ idx_mov_tenant_loc_date
- (type, reason) â†’ idx_mov_type_reason

## Reglas de Negocio

### 1. Items
- Cada item tiene una **unidad base** que NO puede cambiarse despuÃ©s de crear movimientos
- slug se genera automÃ¡ticamente desde name al crear
- sku es opcional pero Ãºnico por tenant si se especifica
- cost_per_unit se calcula automÃ¡ticamente con promedio ponderado

### 2. Stocks
- Un item solo puede tener UN stock por sede (unique constraint)
- Stock inicial = 0 si no se registra movimiento "initial"
- min_stock y max_stock configurables por sede
- Accessors is_low_stock e is_out_of_stock para alertas

### 3. Movimientos
- Tabla inmutable: Solo INSERT (no UPDATE/DELETE para auditorÃ­a)
- Cada movimiento registra previous_stock y new_stock
- quantity siempre positivo, type define si suma o resta
- ValidaciÃ³n: No permitir salidas que dejen stock < 0
- user_id se registra automÃ¡ticamente
- TransacciÃ³n obligatoria: Crear movimiento + actualizar stock es atÃ³mico

### 4. Tipos de Movimientos

**Entradas (entry):**
- purchase: Compra de proveedor (requiere unit_cost)
- adjustment: Ajuste manual positivo
- return: DevoluciÃ³n
- initial: Carga de inventario inicial
- transfer: Transferencia desde otra sede

**Salidas (exit):**
- consumption: Consumo en producciÃ³n/recetas
- waste: Merma, pÃ©rdida, vencimiento
- adjustment: Ajuste manual negativo
- transfer: Transferencia a otra sede

### 5. Costo Promedio Ponderado
Cuando se registra una compra:
```
nuevo_costo_promedio = ((costo_actual * stock_actual) + (costo_compra * cantidad_compra)) / stock_total
```

## Permisos

- inventory.view: Ver listado de items
- inventory.create: Crear items
- inventory.update: Actualizar items
- inventory.delete: Eliminar items
- inventory.movements.view: Ver historial de movimientos
- inventory.movements.create: Registrar movimientos
- inventory.stocks.view: Ver stocks por sede
- inventory.stocks.update: Configurar min/max stock

## Rutas (prefix: {tenant}/admin/inventory)

### Items
- GET / â†’ index (listar items con filtros)
- POST / â†’ store (crear item)
- PUT /{inventoryItem} â†’ update (actualizar item)
- DELETE /{inventoryItem} â†’ destroy (eliminar item)

### Stocks
- GET /stocks â†’ index (listar stocks por sede)
- PUT /stocks/{inventoryStock} â†’ update (actualizar configuraciÃ³n)

### Movements
- GET /movements â†’ index (historial de movimientos)
- POST /movements â†’ store (registrar movimiento)

## Fase Actual: MVP (Fase 1)

### Implementado âœ…
- Migraciones de BD (items, stocks, movements)
- Modelos con BelongsToTenant y relaciones
- FormRequests con validaciÃ³n completa
- Controladores con Gate y transacciones
- Permisos en PermissionSeeder
- Rutas en web.php
- Frontend bÃ¡sico: Items/Index.tsx
- Build exitoso sin errores TypeScript

### Pendiente Fase 2
- Stocks/Index.tsx (vista de stocks por sede)
- Movements/Index.tsx (registro y historial)
- Dashboard con mÃ©tricas
- Transferencias entre sedes
- Command para alertas de stock bajo
- Reportes (valor de inventario, movimientos por periodo)
- IntegraciÃ³n con POS (descuento automÃ¡tico al vender)
- IntegraciÃ³n con productos (recetas)

## AuditorÃ­a
VÃ©ase **INVENTORY_AUDIT.md**.

## Archivos Principales

### Backend
- app/Models/Tenant/Gastronomy/InventoryItem.php
- app/Models/Tenant/Gastronomy/InventoryStock.php
- app/Models/Tenant/Gastronomy/InventoryMovement.php
- app/Http/Controllers/Tenant/Admin/Inventory/InventoryItemController.php
- app/Http/Controllers/Tenant/Admin/Inventory/InventoryStockController.php
- app/Http/Controllers/Tenant/Admin/Inventory/InventoryMovementController.php
- app/Http/Requests/Tenant/Admin/Gastronomy/StoreInventoryItemRequest.php
- app/Http/Requests/Tenant/Admin/Gastronomy/UpdateInventoryItemRequest.php
- app/Http/Requests/Tenant/Admin/Gastronomy/StoreInventoryMovementRequest.php
- app/Http/Requests/Tenant/Admin/Gastronomy/UpdateInventoryStockRequest.php

### Frontend
- resources/js/Pages/Tenant/Admin/Inventory/Items/Index.tsx

### Migraciones
- 2026_02_15_035132_create_inventory_items_table.php
- 2026_02_15_035137_create_inventory_stocks_table.php
- 2026_02_15_035139_create_inventory_movements_table.php

### Seeders
- database/seeders/PermissionSeeder.php (8 permisos inventory.*)

### ConfiguraciÃ³n
- routes/web.php (rutas inventory)
- resources/js/Config/menuConfig.ts (menÃº gastronomÃ­a)
