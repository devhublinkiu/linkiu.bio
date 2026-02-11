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

            // Kitchen (Cocina)
            ['kitchen.view', 'Ver Monitor de Cocina', 'Cocina'],
            ['kitchen.update', 'Gestionar Comandas', 'Cocina'],

            // Waiters (Meseros)
            ['waiters.view', 'Ver Panel de Meseros', 'Meseros'],
            ['waiters.order', 'Tomar Pedidos', 'Meseros'],

            // Reservations (Reservas)
            ['reservations.view', 'Ver Reservas', 'Reservas'],
            ['reservations.update', 'Gestionar Reservas', 'Reservas'],
        ];

        foreach ($permissions as $perm) {
            \App\Models\Permission::firstOrCreate(
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
