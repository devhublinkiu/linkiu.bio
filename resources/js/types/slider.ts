export interface Slider {
    id: number;
    tenant_id?: number;
    location_id?: number | null;
    name: string;
    image_path: string;
    image_path_desktop?: string | null;
    image_url?: string | null;
    desktop_image_url?: string | null;
    link_type: 'none' | 'internal' | 'external';
    external_url?: string | null;
    linkable_type?: string | null;
    linkable_id?: number | null;
    start_at?: string | null;
    end_at?: string | null;
    active_days?: number[] | null;
    clicks_count: number;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
}

export interface PaginatedSliders {
    data: Slider[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
