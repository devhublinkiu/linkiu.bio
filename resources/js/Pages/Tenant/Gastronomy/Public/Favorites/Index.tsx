import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import Header from '@/Components/Tenant/Gastronomy/Public/Header';
import ProductCard from '@/Components/Tenant/Gastronomy/Public/Menu/ProductCard';
import ProductDetailDrawer from '@/Components/Tenant/Gastronomy/Public/ProductDetailDrawer';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Product {
    id: number;
    name: string;
    short_description: string | null;
    price: string;
    original_price?: string | null;
    image_url: string | null;
    is_available: boolean;
    is_featured?: boolean;
}

interface Props {
    tenant: any;
}

export default function FavoritesIndex({ tenant }: Props) {
    const { favorites } = useFavorites();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { bg_color, name_color } = tenant.brand_colors;

    useEffect(() => {
        const fetchFavorites = async () => {
            if (favorites.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.post(route('tenant.menu.products.batch', [tenant.slug]), {
                    ids: favorites
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [favorites, tenant.slug]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
    };

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Favoritos - ${tenant.name}`} />

            <div className="flex flex-col min-h-screen bg-gray-50/50">
                <Header
                    tenantName={tenant.name}
                    logoUrl={tenant.logo_url}
                    description={tenant.store_description}
                    bgColor={bg_color}
                    textColor={name_color}
                />

                {/* Header Section */}
                <div className="bg-white px-4 pt-6 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                            <Heart className="size-6 fill-current" />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            Mis Favoritos
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Tus platos guardados listos para pedir.
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 pb-32 flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="size-8 text-rose-500 animate-spin mb-4" />
                            <p className="text-sm text-slate-400 font-medium">Cargando tus favoritos...</p>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => handleProductClick(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="bg-slate-100 p-6 rounded-full shadow-sm mb-4">
                                <Heart className="size-10 text-slate-300" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">Aún no tienes favoritos</h3>
                            <p className="text-sm text-slate-400 mt-2 max-w-[250px] leading-relaxed">
                                Explora el menú y dale corazón a los platos que más te gusten para guardarlos aquí.
                            </p>
                            <Link
                                href={route('tenant.menu', [tenant.slug])}
                                className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 active:scale-95 transition-transform"
                            >
                                Ir al Menú
                            </Link>
                        </div>
                    )}
                </div>

                {selectedProduct && (
                    <ProductDetailDrawer
                        product={selectedProduct}
                        isOpen={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                    />
                )}
            </div>
        </PublicLayout>
    );
}
