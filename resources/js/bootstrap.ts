import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Echo/Ably se inicializan bajo demanda en echo.ts (getEcho()) para evitar
// Network Error en rutas públicas (ej. /sisu-art) en navegadores restrictivos.
