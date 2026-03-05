import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import type { Config } from 'ziggy-js';
import { RouteName } from 'ziggy-js';
import { route } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function buildZiggyConfig(ziggy: unknown): Config {
    const base =
        ziggy &&
        typeof ziggy === 'object' &&
        'routes' in ziggy &&
        typeof (ziggy as Config).routes === 'object' &&
        'location' in ziggy
            ? (ziggy as Config & { location: string })
            : null;

    if (base) {
        const url = new URL(base.location);
        return {
            ...base,
            location: {
                host: url.hostname,
                pathname: url.pathname,
                search: url.search,
            },
        };
    }

    return {
        url: 'http://localhost',
        port: null,
        defaults: {},
        routes: {},
        location: { host: 'localhost', pathname: '/', search: '' },
    };
}

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            const ziggyConfig = buildZiggyConfig(page.props?.ziggy);

            (globalThis as any).Ziggy = ziggyConfig;

            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) => {
                try {
                    return route(name, params as any, absolute, ziggyConfig);
                } catch {
                    return '#';
                }
            };
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
