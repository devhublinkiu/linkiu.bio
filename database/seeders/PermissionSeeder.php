<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define system permissions
        // Format: [name, label, module]
        $permissions = [
            // Settings
            ['settings.view', 'Ver Configuración', 'Ajustes'],
            ['settings.update', 'Editar Configuración', 'Ajustes'],

            // Team / Users
            ['users.view', 'Ver Miembros', 'Equipo'],
            ['users.invite', 'Invitar Miembros', 'Equipo'],
            ['users.update', 'Editar Miembros', 'Equipo'],
            ['users.delete', 'Eliminar Miembros', 'Equipo'],

            // Roles
            ['roles.view', 'Ver Roles', 'Roles'],
            ['roles.create', 'Crear Roles', 'Roles'],
            ['roles.update', 'Editar Roles', 'Roles'],
            ['roles.delete', 'Eliminar Roles', 'Roles'],

            // Media
            ['media.view', 'Ver Archivos', 'Media'],
            ['media.upload', 'Subir Archivos', 'Media'],
            ['media.delete', 'Eliminar Archivos', 'Media'],

            // Billing
            ['billing.view', 'Ver Facturación', 'Facturación'],
            ['billing.update', 'Gestionar Suscripción', 'Facturación'],

            // Profile
            ['profile.view', 'Ver Perfil', 'Mi Perfil'],
            ['profile.edit', 'Editar Perfil', 'Mi Perfil'],

            // Tickers
            ['tickers.view', 'Ver Tickers', 'Tickers'],
            ['tickers.create', 'Crear Tickers', 'Tickers'],
            ['tickers.update', 'Editar Tickers', 'Tickers'],
            ['tickers.delete', 'Eliminar Tickers', 'Tickers'],

            // Sliders
            ['sliders.view', 'Ver Sliders', 'Sliders'],
            ['sliders.create', 'Crear Sliders', 'Sliders'],
            ['sliders.update', 'Editar Sliders', 'Sliders'],
            ['sliders.delete', 'Eliminar Sliders', 'Sliders'],

            // WhatsApp Settings
            ['whatsapp.view', 'Ver Configuración WhatsApp', 'WhatsApp'],
            ['whatsapp.update', 'Editar Configuración WhatsApp', 'WhatsApp'],

            // Locations (Sedes)
            ['locations.view', 'Ver Sedes', 'Sedes'],
            ['locations.create', 'Crear Sedes', 'Sedes'],
            ['locations.update', 'Editar Sedes', 'Sedes'],
            ['locations.delete', 'Eliminar Sedes', 'Sedes'],

            // Shorts
            ['shorts.view', 'Ver Shorts', 'Shorts'],
            ['shorts.create', 'Crear Shorts', 'Shorts'],
            ['shorts.update', 'Editar Shorts', 'Shorts'],
            ['shorts.delete', 'Eliminar Shorts', 'Shorts'],

            // Payment Methods (Métodos de Pago)
            ['payment_methods.view', 'Ver Métodos de Pago', 'Pagos'],
            ['payment_methods.create', 'Crear Métodos de Pago', 'Pagos'],
            ['payment_methods.update', 'Editar Métodos de Pago', 'Pagos'],
            ['payment_methods.delete', 'Eliminar Métodos de Pago', 'Pagos'],

            // Shipping Zones (Zonas de Envío)
            ['shipping_zones.view', 'Ver Zonas de Envío', 'Domicilios'],
            ['shipping_zones.create', 'Crear Zonas de Envío', 'Domicilios'],
            ['shipping_zones.update', 'Editar Zonas de Envío', 'Domicilios'],
            ['shipping_zones.delete', 'Eliminar Zonas de Envío', 'Domicilios'],

            // Integrations (Integraciones)
            ['integrations.view', 'Ver Integraciones', 'Integraciones'],
            ['integrations.update', 'Editar Integraciones', 'Integraciones'],

            // Products / Carta Digital (Gastronomía)
            ['products.view', 'Ver Productos', 'Carta digital'],
            ['products.create', 'Crear Productos', 'Carta digital'],
            ['products.update', 'Editar Productos', 'Carta digital'],
            ['products.delete', 'Eliminar Productos', 'Carta digital'],

            // linkiuPOS (Caja / Punto de venta)
            ['pos.view', 'Ver POS', 'linkiuPOS'],
            ['pos.create', 'Crear pedidos (POS)', 'linkiuPOS'],
            ['pos.manage', 'Gestionar cobros y pedidos (POS)', 'linkiuPOS'],

            // Pedidos (Centro de pedidos / Gastronomía)
            ['orders.view', 'Ver Pedidos', 'Pedidos'],
            ['orders.update', 'Actualizar estado de pedidos', 'Pedidos'],

            // Kitchen (Cocina)
            ['kitchen.view', 'Ver Monitor de Cocina', 'Cocina'],
            ['kitchen.update', 'Gestionar Comandas', 'Cocina'],

            // Waiters (Meseros)
            ['waiters.view', 'Ver Panel de Meseros', 'Meseros'],
            ['waiters.order', 'Tomar Pedidos', 'Meseros'],

            // Reservations (Reservas)
            ['reservations.view', 'Ver Reservas', 'Reservas'],
            ['reservations.update', 'Gestionar Reservas', 'Reservas'],

            // Categories (Categorías de productos – módulo central)
            ['categories.view', 'Ver Categorías', 'Categorías'],
            ['categories.create', 'Crear Categorías', 'Categorías'],
            ['categories.update', 'Editar Categorías', 'Categorías'],
            ['categories.delete', 'Eliminar Categorías', 'Categorías'],

            // Tables & Zones (Mesas y Zonas)
            ['tables.view', 'Ver Mesas y Zonas', 'Mesas y Zonas'],
            ['tables.create', 'Crear Mesas y Zonas', 'Mesas y Zonas'],
            ['tables.update', 'Editar Mesas y Zonas', 'Mesas y Zonas'],
            ['tables.delete', 'Eliminar Mesas y Zonas', 'Mesas y Zonas'],

            // Inventory (Inventario)
            ['inventory.view', 'Ver Inventario', 'Inventario'],
            ['inventory.create', 'Crear Items de Inventario', 'Inventario'],
            ['inventory.update', 'Actualizar Items de Inventario', 'Inventario'],
            ['inventory.delete', 'Eliminar Items de Inventario', 'Inventario'],
            ['inventory.movements.view', 'Ver Movimientos de Inventario', 'Inventario'],
            ['inventory.movements.create', 'Registrar Movimientos', 'Inventario'],
            ['inventory.stocks.view', 'Ver Stocks', 'Inventario'],
            ['inventory.stocks.update', 'Configurar Stocks', 'Inventario'],
        ];

        foreach ($permissions as $perm) {
            \App\Models\Permission::updateOrCreate(
            ['name' => $perm[0]],
            [
                'label' => $perm[1],
                'module' => $perm[2],
                'guard_name' => 'web'
            ]
            );
        }
    }
}
