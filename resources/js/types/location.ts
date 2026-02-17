/**
 * Location (sede) para vistas públicas del tenant
 */
export interface PublicLocation {
    id: number;
    name: string;
    description: string | null;
    is_main: boolean;
    phone: string | null;
    whatsapp: string | null;
    whatsapp_message: string | null;
    state: string | null;
    city: string | null;
    address: string | null;
    latitude: number;
    longitude: number;
    opening_hours: {
        [key: string]: Array<{ open: string; close: string }>;
    };
    social_networks?: {
        facebook?: string;
        instagram?: string;
        tiktok?: string;
    };
    is_active: boolean;
}
