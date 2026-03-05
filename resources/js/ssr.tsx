import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { RouteName } from 'ziggy-js';
import { route } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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
            const ziggy = page.props?.ziggy;
            const ziggyConfig =
                ziggy && typeof ziggy.routes === 'object' && ziggy.location
                    ? { ...ziggy, location: new URL(ziggy.location) }
                    : { routes: {} as Record<string, unknown>, location: new URL('http://localhost') };

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
