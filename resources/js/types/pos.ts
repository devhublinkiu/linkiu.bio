export interface Product {
    id: number;
    name: string;
    price: number;
    image_url?: string;
    description?: string;
    variant_groups?: any[];
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
    variant_options?: any;
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

export interface Table {
    id: number;
    name: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
    section_id?: number;
    active_order?: {
        id: number;
        table_id: number;
        customer_name: string;
        total: number;
        status: string;
        created_at: string;
    };
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
