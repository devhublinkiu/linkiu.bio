import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from '@ably/laravel-echo';
import * as Ably from 'ably';

// Explicitly initialize Ably client
const ablyClient = new Ably.Realtime({
    key: import.meta.env.VITE_ABLY_KEY,
});

ablyClient.connection.on('connected', () => {
    console.log('[Ably] Connected to Ably');
});

ablyClient.connection.on('failed', (error) => {
    console.error('[Ably] Connection failed:', error);
});

window.Ably = Ably;
window.Echo = new Echo({
    broadcaster: 'ably',
    client: ablyClient,
});

console.log('[Echo] Echo initialized with Ably broadcaster');
