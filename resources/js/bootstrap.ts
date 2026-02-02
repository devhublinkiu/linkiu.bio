import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from '@ably/laravel-echo';
import * as Ably from 'ably';

// Explicitly initialize Ably client
const ablyClient = new Ably.Realtime({
    key: import.meta.env.VITE_ABLY_KEY,
});

window.Ably = Ably;
window.Echo = new Echo({
    broadcaster: 'ably',
    client: ablyClient,
});
