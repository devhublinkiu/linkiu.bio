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
