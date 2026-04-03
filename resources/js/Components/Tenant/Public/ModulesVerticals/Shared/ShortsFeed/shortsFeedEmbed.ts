/** Parámetros de embed para autoplay en el modal del short. */
export function buildEmbedUrl(embedUrl: string, autoplay: boolean): string {
    try {
        const url = new URL(embedUrl);
        if (autoplay) {
            url.searchParams.set('autoplay', 'true');
            url.searchParams.set('muted', 'false');
            url.searchParams.set('preload', 'true');
        }
        return url.toString();
    } catch {
        return autoplay ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=true&muted=false` : embedUrl;
    }
}
