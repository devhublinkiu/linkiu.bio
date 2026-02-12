<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestBunnyConnection extends Command
{
    protected $signature = 'app:test-bunny';
    protected $description = 'Prueba la conexión con el almacenamiento de Bunny.net';

    public function handle()
    {
        $this->info('🚀 Iniciando prueba de conexión con Bunny.net...');
        $disk = 'bunny';
        $filename = 'test-bunny-connection.txt';
        $content = 'Hola Bunny! Prueba realizada el ' . now()->toDateTimeString();

        try {
            $this->comment('1. Verificando si el disco "' . $disk . '" está registrado...');
            $storage = Storage::disk($disk);
            $this->info('✅ Disco encontrado.');

            $this->comment('2. Intentando subir un archivo de prueba (' . $filename . ')...');
            $storage->put($filename, $content);
            $this->info('✅ Archivo subido correctamente.');

            $this->comment('3. Verificando existencia del archivo en el Storage...');
            if ($storage->exists($filename)) {
                $this->info('✅ El archivo existe en el Storage.');
            }
            else {
                throw new \Exception('El archivo no se encuentra en el Storage después de la subida.');
            }

            $this->comment('5. Generando URL pública (CDN)...');
            $url = $storage->url($filename);
            $this->info('🔗 URL generada: ' . $url);

            $this->info('🎊 ¡Felicidades! La conexión con Bunny.net es un éxito total.');

        }
        catch (\Throwable $e) {
            $this->error('❌ Error fatal en la conexión:');
            $this->error('Mensaje: ' . $e->getMessage());
            $this->line('Clase: ' . get_class($e));
            $this->line('Archivo: ' . $e->getFile() . ':' . $e->getLine());
            $this->line('Trace:');
            $this->line($e->getTraceAsString());
        }
    }
}
