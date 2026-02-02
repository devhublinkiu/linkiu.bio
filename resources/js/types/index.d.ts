import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    profile_photo_url?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
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
    ziggy: Config & { location: string };
};
