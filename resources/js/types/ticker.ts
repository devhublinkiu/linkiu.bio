export interface Ticker {
    id: number;
    content: string;
    link?: string | null;
    background_color: string;
    text_color: string;
    order: number;
    is_active: boolean;
    created_at: string;
}

export interface PaginatedTickers {
    data: Ticker[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
