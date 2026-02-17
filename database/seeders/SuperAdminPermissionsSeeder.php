<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

class SuperAdminPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define SuperAdmin Permissions (Global Context)
        // Guard 'web' is fine.
        $permissions = [
            // Tiendas
            ['name' => 'sa.tenants.view', 'label' => 'Ver Tiendas', 'module' => 'Tiendas'],
            ['name' => 'sa.tenants.create', 'label' => 'Crear Tienda', 'module' => 'Tiendas'],

            // Categorías de negocios
            ['name' => 'sa.categories.view', 'label' => 'Ver Categorías', 'module' => 'Categorías de negocios'],
            ['name' => 'sa.categories.create', 'label' => 'Crear Categoría', 'module' => 'Categorías de negocios'],
            ['name' => 'sa.categories.update', 'label' => 'Editar Categoría', 'module' => 'Categorías de negocios'],
            ['name' => 'sa.categories.delete', 'label' => 'Eliminar Categoría', 'module' => 'Categorías de negocios'],
            ['name' => 'sa.categories.manage', 'label' => 'Gestionar (Iconos y Solicitudes)', 'module' => 'Categorías de negocios'],

            // Planes
            ['name' => 'sa.plans.view', 'label' => 'Ver Planes', 'module' => 'Planes'],
            ['name' => 'sa.plans.create', 'label' => 'Crear Plan', 'module' => 'Planes'],
            ['name' => 'sa.plans.update', 'label' => 'Editar Plan', 'module' => 'Planes'],
            ['name' => 'sa.plans.delete', 'label' => 'Eliminar Plan', 'module' => 'Planes'],

            // Suscripciones
            ['name' => 'sa.subscriptions.view', 'label' => 'Ver Suscripciones', 'module' => 'Suscripciones'],

            // Auditorías de pagos
            ['name' => 'sa.payments.view', 'label' => 'Ver Auditoría de Pagos', 'module' => 'Auditorías de pagos'],
            ['name' => 'sa.payments.update', 'label' => 'Aprobar o rechazar pagos', 'module' => 'Auditorías de pagos'],
            ['name' => 'sa.payments.proof.view', 'label' => 'Ver comprobantes', 'module' => 'Auditorías de pagos'],

            // Gestión de archivos
            ['name' => 'sa.media.view', 'label' => 'Ver Archivos', 'module' => 'Gestión de archivos'],
            ['name' => 'sa.media.upload', 'label' => 'Subir Archivos', 'module' => 'Gestión de archivos'],
            ['name' => 'sa.media.folders.create', 'label' => 'Crear Carpetas', 'module' => 'Gestión de archivos'],
            ['name' => 'sa.media.delete', 'label' => 'Eliminar Archivos', 'module' => 'Gestión de archivos'],
            ['name' => 'sa.media.details.view', 'label' => 'Ver Detalles de Archivo', 'module' => 'Gestión de archivos'],

            // Lista de usuarios
            ['name' => 'sa.users.view', 'label' => 'Ver Usuarios', 'module' => 'Lista de usuarios'],
            ['name' => 'sa.users.create', 'label' => 'Crear Usuario', 'module' => 'Lista de usuarios'],
            ['name' => 'sa.users.update', 'label' => 'Editar Usuario', 'module' => 'Lista de usuarios'],
            ['name' => 'sa.users.delete', 'label' => 'Eliminar Usuario', 'module' => 'Lista de usuarios'],

            // Roles y permisos
            ['name' => 'sa.roles.view', 'label' => 'Ver Roles', 'module' => 'Roles y permisos'],
            ['name' => 'sa.roles.create', 'label' => 'Crear Roles', 'module' => 'Roles y permisos'],
            ['name' => 'sa.roles.update', 'label' => 'Editar Roles', 'module' => 'Roles y permisos'],
            ['name' => 'sa.roles.delete', 'label' => 'Eliminar Roles', 'module' => 'Roles y permisos'],

            // Mi cuenta
            ['name' => 'sa.account.view', 'label' => 'Ver Mi Cuenta', 'module' => 'Mi cuenta'],
            ['name' => 'sa.account.update', 'label' => 'Cambiar Info', 'module' => 'Mi cuenta'],
            ['name' => 'sa.account.password.update', 'label' => 'Cambiar Contraseña', 'module' => 'Mi cuenta'],
            ['name' => 'sa.account.delete', 'label' => 'Eliminar Cuenta', 'module' => 'Mi cuenta'],

            // Settings
            ['name' => 'sa.settings.view', 'label' => 'Ver Settings', 'module' => 'Setting'],
            ['name' => 'sa.settings.update', 'label' => 'Editar Settings', 'module' => 'Setting'],
            ['name' => 'sa.settings.delete', 'label' => 'Eliminar Settings', 'module' => 'Setting'],
            ['name' => 'sa.settings.create', 'label' => 'Crear Settings', 'module' => 'Setting'],
            ['name' => 'sa.settings.upload', 'label' => 'Subir Archivos de Configuración', 'module' => 'Setting'],

            // Permisos de Tenant (Categorías)
            // Removed: tenant.categories.manage (conflicto con categories.* del PermissionSeeder)
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                ['name' => $perm['name'], 'guard_name' => 'web'],
                ['label' => $perm['label'], 'module' => $perm['module']]
            );
        }

        // 2. Create Super Admin Role (Global - tenant_id is NULL)
        $role = Role::firstOrCreate(
            ['name' => 'Super Admin', 'tenant_id' => null],
            ['guard_name' => 'web', 'is_system' => true]
        );

        // 3. Assign ALL permissions to Super Admin
        // We need to fetch the permission IDs.
        // Assuming custom Permission model works with belongsToMany
        $allPermissions = Permission::where('name', 'like', 'sa.%')->get();
        $role->permissions()->syncWithoutDetaching($allPermissions->pluck('id'));

        // 4. Assign Role to User
        $user = User::where('email', 'admin@linkiu.bio')->first();
        if ($user) {
            $user->role_id = $role->id;
            $user->save();
        }
    }
}
