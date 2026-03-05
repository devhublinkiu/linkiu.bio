import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    // Base absoluta para que los chunks se carguen desde /build/ y no se resuelvan contra la URL del documento (evita "Importing a module script failed" en WebViews como Instagram)
    base: '/build/',
    build: {
        sourcemap: false,
        rollupOptions: {
            maxParallelFileOps: 2,
        },
    },
    ssr: {
        noExternal: ['react-use'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
    ],
});
