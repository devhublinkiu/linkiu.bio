/** Producto mínimo para lista vertical (carrusel + drawer). */
export interface ProductListVerticalProduct {
    id: number;
    name: string;
    price: number;
    original_price?: number;
    image_url?: string;
    is_featured: boolean;
    variant_groups?: unknown[];
}
