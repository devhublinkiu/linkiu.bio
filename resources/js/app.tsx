import '../css/app.css';
import './bootstrap';

import * as Sentry from '@sentry/react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { Toaster } from '@/Components/ui/sonner';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
    Sentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE || 'production',
        integrations: [Sentry.browserTracingIntegration()],
        sendDefaultPii: true,
        tracesSampleRate: 1.0,
        tracePropagationTargets: ['localhost', /^https:\/\/[^/]*\.?linkiu\.bio/],
        // Errores conocidos que no son bugs nuestros
        ignoreErrors: [
            'Error invoking postMessage: Java object is gone',
            /postMessage.*Java object is gone/i,
            // Chunk no encontrado (caché antigua tras deploy); el resolve() abajo hace reload
            'Importing a module script failed',
            /Failed to fetch dynamically imported module/i,
            /Loading chunk \d+ failed/i,
        ],
    });
    // Verificar envío: en la consola del navegador ejecuta: window.__sentryTest()
    if (typeof window !== 'undefined') {
        (window as Window & { __sentryTest?: () => void }).__sentryTest = () => {
            Sentry.captureException(new Error('Test exception from linkiu.bio'));
        };
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ).catch((err: Error) => {
            const msg = err?.message ?? '';
            const isChunkLoadError = /importing a module script failed|failed to fetch dynamically imported module|loading chunk \d+ failed/i.test(msg);
            if (isChunkLoadError && typeof window !== 'undefined') {
                window.location.reload();
                return new Promise(() => {}); // No resolver: la página está recargando
            }
            throw err;
        }),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el,
                <>
                    <App {...props} />
                    <Toaster />
                </>
            );
            return;
        }

        createRoot(el).render(
            <>
                <App {...props} />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
