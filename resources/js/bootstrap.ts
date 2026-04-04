import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
if (csrf) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf;
}

// Echo/Ably se inicializan bajo demanda en echo.ts (getEcho()) para evitar
// Network Error en rutas públicas (ej. /sisu-art) en navegadores restrictivos.
