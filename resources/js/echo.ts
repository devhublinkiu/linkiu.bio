/**
 * Echo/Ably se inicializan solo cuando se necesita (admin, etc.).
 * En rutas públicas (ej. /sisu-art) no se conecta, evitando Network Error
 * en navegadores restrictivos (Instagram in-app, etc.).
 */
import Echo from '@ably/laravel-echo';
import * as Ably from 'ably';

let echoInstance: InstanceType<typeof Echo> | null = null;

export function getEcho(): InstanceType<typeof Echo> | null {
    if (echoInstance) {
        return echoInstance;
    }
    const key = import.meta.env.VITE_ABLY_KEY;
    if (!key) {
        return null;
    }
    try {
        const ablyClient = new Ably.Realtime({ key });
        if (typeof window !== 'undefined') {
            (window as Window & { Ably: typeof Ably }).Ably = Ably;
        }
        const EchoClass = Echo as unknown as new (config: object) => InstanceType<typeof Echo>;
        echoInstance = new EchoClass({
            broadcaster: 'ably',
            client: ablyClient,
        });
        if (typeof window !== 'undefined') {
            (window as Window & { Echo: InstanceType<typeof Echo> }).Echo = echoInstance;
        }
        return echoInstance;
    } catch {
        return null;
    }
}
