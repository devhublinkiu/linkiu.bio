export interface ShortsFeedItem {
    id: number;
    name: string;
    description?: string;
    short_embed_url: string;
    /** Portada (Bunny CDN, manual o YouTube); prioridad en la miniatura del feed. */
    poster_url?: string | null;
    link_type: string;
    action_url: string;
}
