<?php

namespace Database\Seeders;

use App\Models\BusinessCategory;
use App\Models\Vertical;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VerticalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tablas para evitar duplicados si se corre varias veces (opcional, pero útil en dev)
        // Schema::disableForeignKeyConstraints();
        // Vertical::truncate();
        // BusinessCategory::truncate();
        // Schema::enableForeignKeyConstraints();

        // Pero mejor usamos firstOrCreate para ser menos destructivos si ya existen datos utiles.
        // O simplemente create si estamos seguros. Asumiré create como estaba antes pero voy a manejar los 4 casos.

        // 1. Dropshipping
        $dropshipping = Vertical::firstOrCreate(
            ['slug' => 'dropshipping'],
            [
                'name' => 'Dropshipping',
                'description' => 'Venta de productos sin stock físico.',
            ]
        );

        BusinessCategory::firstOrCreate(['slug' => 'general-dropshipping'], [
            'vertical_id' => $dropshipping->id,
            'name' => 'General',
            'require_verification' => false,
        ]);

        BusinessCategory::firstOrCreate(['slug' => 'nicho-especifico'], [
            'vertical_id' => $dropshipping->id,
            'name' => 'Nicho Específico',
            'require_verification' => false,
        ]);


        // 2. Ecommerce
        $ecommerce = Vertical::firstOrCreate(
            ['slug' => 'ecommerce'],
            [
                'name' => 'Ecommerce',
                'description' => 'Venta de productos físicos o digitales con inventario propio.',
            ]
        );

        BusinessCategory::firstOrCreate(['slug' => 'moda-y-accesorios'], [
            'vertical_id' => $ecommerce->id,
            'name' => 'Moda y Accesorios',
            'require_verification' => false,
        ]);

        BusinessCategory::firstOrCreate(['slug' => 'farmacia-y-salud'], [
            'vertical_id' => $ecommerce->id,
            'name' => 'Farmacia y Salud',
            'require_verification' => true,
        ]);

        BusinessCategory::firstOrCreate(['slug' => 'tecnologia'], [
            'vertical_id' => $ecommerce->id,
            'name' => 'Tecnología',
            'require_verification' => false,
        ]);


        // 3. Servicios
        $servicios = Vertical::firstOrCreate(
            ['slug' => 'servicios'],
            [
                'name' => 'Servicios',
                'description' => 'Oferta de servicios profesionales o técnicos.',
            ]
        );

        BusinessCategory::firstOrCreate(['slug' => 'consultoria'], [
            'vertical_id' => $servicios->id,
            'name' => 'Consultoría',
            'require_verification' => false,
        ]);

        BusinessCategory::firstOrCreate(['slug' => 'freelance'], [
            'vertical_id' => $servicios->id,
            'name' => 'Freelance / Creativo',
            'require_verification' => false,
        ]);

        BusinessCategory::firstOrCreate(['slug' => 'salud-y-belleza'], [
            'vertical_id' => $servicios->id,
            'name' => 'Salud y Belleza',
            'require_verification' => true, // Puede requerir licencias
        ]);


        // 4. Gastronomía
        $gastronomia = Vertical::firstOrCreate(
            ['slug' => 'gastronomia'],
            [
                'name' => 'Gastronomía',
                'description' => 'Restaurantes, bares y comida rápida.',
            ]
        );

        BusinessCategory::firstOrCreate(['slug' => 'restaurante'], [
            'vertical_id' => $gastronomia->id,
            'name' => 'Restaurante',
            'require_verification' => false,
        ]);

        BusinessCategory::firstOrCreate(['slug' => 'licores-y-bebidas'], [
            'vertical_id' => $gastronomia->id,
            'name' => 'Licores y Bebidas',
            'require_verification' => true,
        ]);

        BusinessCategory::firstOrCreate(['slug' => 'comida-rapida'], [
            'vertical_id' => $gastronomia->id,
            'name' => 'Comida Rápida',
            'require_verification' => false,
        ]);

    }
}
