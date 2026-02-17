export interface VariantOption {
    id: number;
    name: string;
    price_adjustment: string | number;
    is_available?: boolean;
    price?: number;
    group_name?: string;
    option_name?: string;
    [key: string]: string | number | boolean | undefined | null;
}

export interface VariantGroup {
    id: number;
    name: string;
    type: 'radio' | 'checkbox';
    min_selection: number;
    max_selection: number;
    is_required: boolean;
    options: VariantOption[];
}

export interface Tenant {
    id: number;
    name: string;
    slug: string;
    settings: Record<string, string | number | boolean | null | undefined>;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    description?: string;
    variant_groups?: VariantGroup[];
    tax_name?: string;
    tax_rate?: number;
    price_includes_tax?: boolean;
}

export interface Category {
    id: number;
    name: string;
    products: Product[];
}

export interface CartItem {
    id: string;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    total: number;
    variant_options?: VariantOption[];
    notes?: string;
    is_sent?: boolean;
}

export interface Customer {
    id: number;
    name: string;
    phone?: string;
    identification_number?: string;
    email?: string;
    address?: string;
    notes?: string;
}

export interface PaymentMethod {
    id: number;
    name: string;
    type: string;
}

export interface Reservation {
    id: number;
    customer_id?: number;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    party_size: number;
    reservation_time: string;
    reservation_date?: string;
    status: string;
    table_id?: number;
    table?: Table;
    notes?: string;
}

export interface OrderItemData {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: string | number;
    total: string | number;
    variant_options?: VariantOption[] | string;
    notes?: string;
    tax_amount?: number;
}

export interface ActiveOrder {
    id: number;
    table_id: number;
    customer_name: string;
    customer_id?: number;
    customer_phone?: string;
    total: number;
    status: string;
    created_at: string;
    items?: OrderItemData[];
    waiter_collected?: boolean;
    payment_method?: string;
    payment_proof_url?: string | null;
    payment_reference?: string | null;
}

export interface Table {
    id: number;
    name: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
    section_id?: number;
    active_order?: ActiveOrder;
}

export interface Zone {
    id: number;
    name: string;
    tables: Table[];
}

export interface TaxSettings {
    tax_name: string;
    tax_rate: number;
    price_includes_tax: boolean;
}

export interface Location {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    is_main: boolean;
    is_active: boolean;
}

export interface UserRole {
    label: string;
    is_owner: boolean;
    permissions: string[];
}

// --- Kitchen / KDS ---

export interface KitchenOrderItem {
    id: number;
    product_name: string;
    quantity: number;
    status?: 'active' | 'cancelled' | 'served';
    variant_options?: { name: string; value?: string }[];
    notes?: string;
}

export interface KitchenOrder {
    id: number;
    ticket_number: string;
    status: string;
    priority: 'high' | 'normal' | 'low';
    service_type: string;
    customer_name: string;
    table?: { name: string };
    creator?: { name: string };
    created_at: string;
    items: KitchenOrderItem[];
}

// --- Echo real-time ---

export interface EchoChannel {
    listen: (event: string, cb: (e: Record<string, unknown>) => void) => EchoChannel;
    stopListening: (event: string) => void;
}

export interface EchoInstance {
    connector?: unknown;
    channel: (ch: string) => EchoChannel;
    private: (ch: string) => EchoChannel;
    leave: (ch: string) => void;
}
