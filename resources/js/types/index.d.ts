import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    profile_photo_url?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    created_at: string;
    is_super_admin?: boolean;
    global_role?: {
        name: string;
    };
    tenant_id?: number | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        permissions?: string[];
        notifications?: {
            unread_count: number;
            recent: any[];
        };
    };
    currentTenant?: {
        id: number;
        slug: string;
        name: string;
        logo_url?: string;
        /** Descripción corta tienda (settings), p. ej. hero público */
        store_description?: string | null;
        contact_phone?: string | null;
        contact_email?: string | null;
        /** JSON settings; p. ej. `whatsapp_admin_phone` del módulo WhatsApp (admin) */
        settings?: {
            whatsapp_admin_phone?: string | null;
        } & Record<string, unknown>;
        vertical?: {
            id: number;
            slug: string;
            name?: string;
        };
        latest_subscription?: any;
        pending_invoice?: any;
    };
    currentUserRole?: {
        label: string;
        is_owner: boolean;
        permissions: string[];
    };
    ziggy: Config & { location: string };
    /** Mensaje de horario de sede (gastronomía), p. ej. desde HandleInertiaRequests */
    location_status_message?: string | null;
    /** Nombres de sedes activas para UI pública (p. ej. chips en footer) */
    public_location_names?: string[];
    /** Cantidad de sedes activas del tenant (HandleInertiaRequests) */
    locationsCount?: number;
};
