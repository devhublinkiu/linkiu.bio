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
        latest_subscription?: any;
        pending_invoice?: any;
    };
    currentUserRole?: {
        label: string;
        is_owner: boolean;
        permissions: string[];
    };
    ziggy: Config & { location: string };
};
