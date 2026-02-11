import { useState, useMemo, useRef } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { useCart } from '@/Contexts/CartContext';
import { Minus, Plus, ShoppingBag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface VariantOption {
    id: number;
    name: string;
    price_adjustment: string;
    is_available: boolean;
}

interface VariantGroup {
    id: number;
    name: string;
    type: 'radio' | 'checkbox';
    min_selection: number;
    max_selection: number;
    is_required: boolean;
    options: VariantOption[];
}

interface Product {
    id: number;
    name: string;
    short_description?: string;
    price: number;
    original_price?: number;
    image_url?: string;
    is_featured: boolean;
    preparation_time?: string;
    calories?: string;
    variant_groups?: VariantGroup[];
    gallery?: string[];
    gallery_urls?: string[];
    tags?: string[];
    allergens?: string[];
}

interface ProductDetailDrawerProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductDetailDrawer({ product, isOpen, onClose }: ProductDetailDrawerProps) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<Record<number, number[]>>({});
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.clientWidth;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Reset state when product changes or drawer opens
    // (In a real implementation we might want to use useEffect for this)

    const basePrice = Number(product.price);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Calculate total price including variants
    const totalPrice = useMemo(() => {
        let total = basePrice;

        if (product.variant_groups) {
            product.variant_groups.forEach(group => {
                const selectedOptionIds = selectedVariants[group.id] || [];
                selectedOptionIds.forEach(optionId => {
                    const option = group.options.find(o => o.id === optionId);
                    if (option) {
                        total += Number(option.price_adjustment);
                    }
                });
            });
        }

        return total * quantity;
    }, [product, selectedVariants, quantity, basePrice]);

    const handleVariantChange = (groupId: number, optionId: number, type: 'radio' | 'checkbox') => {
        setSelectedVariants(prev => {
            const currentSelected = prev[groupId] || [];

            if (type === 'radio') {
                return { ...prev, [groupId]: [optionId] };
            } else {
                // Checkbox toggle
                if (currentSelected.includes(optionId)) {
                    return { ...prev, [groupId]: currentSelected.filter(id => id !== optionId) };
                } else {
                    return { ...prev, [groupId]: [...currentSelected, optionId] };
                }
            }
        });
    };

    const handleAddToCart = () => {
        // Validation: Check required groups
        if (product.variant_groups) {
            for (const group of product.variant_groups) {
                if (group.is_required) {
                    const selected = selectedVariants[group.id] || [];
                    if (selected.length < group.min_selection) {
                        toast.error(`Debes seleccionar al menos ${group.min_selection} opción(es) en ${group.name}`);
                        return;
                    }
                }
            }
        }

        // Construct variant options for display and storage
        const variantOptionsFormatted: { name: string; value: string; price?: number }[] = [];

        if (product.variant_groups) {
            product.variant_groups.forEach(group => {
                const selectedList = selectedVariants[group.id] || [];
                selectedList.forEach(optId => {
                    const opt = group.options.find(o => o.id === optId);
                    if (opt) {
                        variantOptionsFormatted.push({
                            name: group.name,
                            value: opt.name,
                            price: Number(opt.price_adjustment)
                        });
                    }
                });
            });
        }

        // Add to cart with simplified object (flattened variants for now, or full object if supported)
        addToCart({
            ...product,
            price: totalPrice / quantity, // Store unit price with modifiers
            quantity: quantity,
            variant_selections: selectedVariants, // Store raw selections
            variant_options: variantOptionsFormatted // Store formatted options for display/order
        });

        onClose();
        setQuantity(1);
        setSelectedVariants({});
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="bottom"
                className="h-[80vh] w-full max-w-[480px] mx-auto left-0 right-0 p-0 rounded-t-[2rem] bg-slate-50 flex flex-col overflow-hidden border-none focus-visible:outline-none shadow-2xl"
            >
                {/* Visual Drag Handle */}
                <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 pb-1 z-50 pointer-events-none">
                    <div className="w-12 h-1.5 bg-slate-200/50 backdrop-blur-sm rounded-full" />
                </div>

                {/* Close Button Absolute */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-black/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/30 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 max-h-[75vh] overflow-y-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Header Image / Gallery Carousel */}
                    <div className="h-64 sm:h-72 w-full relative group">
                        {/* Images Container */}
                        <div
                            ref={scrollContainerRef}
                            className="w-full h-full overflow-x-auto flex flex-nowrap snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {/* Main Image */}
                            {product.image_url && (
                                <div className="w-full h-full shrink-0 snap-center relative">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                                </div>
                            )}

                            {/* Gallery Images (Prefer URLs, fallback to raw paths if needed) */}
                            {(product.gallery_urls || product.gallery)?.map((img, index) => {
                                const src = img.startsWith('http') || img.startsWith('/') ? img : `/storage/${img}`;
                                return (
                                    <div key={index} className="w-full h-full shrink-0 snap-center relative">
                                        <img
                                            src={src}
                                            alt={`${product.name} - ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                                    </div>
                                );
                            })}

                            {/* Fallback if no images */}
                            {!product.image_url && (!product.gallery_urls || product.gallery_urls.length === 0) && (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center snap-center">
                                    <ShoppingBag className="w-12 h-12 text-slate-300" />
                                </div>
                            )}
                        </div>

                        {/* Navigation Arrows */}
                        {(product.gallery_urls && product.gallery_urls.length > 0) && (
                            <>
                                <button
                                    onClick={() => scroll('left')}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors active:scale-95 shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors active:scale-95 shadow-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {/* Indicators (Dots) */}
                        {(product.gallery_urls && product.gallery_urls.length > 0) && (
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                                {/* Dot for Main Image */}
                                <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
                                {/* Dots for Gallery */}
                                {product.gallery_urls.map((_, idx) => (
                                    <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                ))}
                            </div>
                        )}

                        {/* Hint Text */}
                        {(product.gallery_urls && product.gallery_urls.length > 0) && (
                            <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white z-20 pointer-events-none">
                                {1 + (product.gallery_urls?.length || 0)} Fotos
                            </div>
                        )}
                    </div>

                    <div className="p-6 pb-8 -mt-12 relative z-10 flex flex-col gap-6">
                        {/* Title & Info */}
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{product.name}</h2>
                            {product.short_description && (
                                <p className="text-slate-500 text-sm leading-relaxed">{product.short_description}</p>
                            )}
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900">{formatPrice(basePrice)}</span>
                                {product.original_price && Number(product.original_price) > basePrice && (
                                    <span className="text-slate-400 line-through text-sm">
                                        {formatPrice(Number(product.original_price))}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        {(product.preparation_time || product.calories) && (
                            <div className="grid grid-cols-2 gap-4">
                                {product.preparation_time && (
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tiempo</div>
                                            <div className="text-sm font-bold text-slate-900">{product.preparation_time}</div>
                                        </div>
                                    </div>
                                )}

                                {product.calories && (
                                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                                        <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Calorías</div>
                                            <div className="text-sm font-bold text-slate-900">{product.calories}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tags & Allergens */}
                        {(product.tags?.length || 0) > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {product.tags?.map((tag, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Variants */}
                        {product.variant_groups?.map(group => (
                            <div key={group.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-900 text-lg">{group.name}</h3>
                                    {group.is_required && (
                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">
                                            Obligatorio
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {group.options.map(option => {
                                        const isSelected = (selectedVariants[group.id] || []).includes(option.id);
                                        const priceAdj = Number(option.price_adjustment);

                                        return (
                                            <label
                                                key={option.id}
                                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected
                                                    ? 'border-slate-900 bg-slate-50'
                                                    : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-slate-900 border-slate-900' : 'border-slate-300'
                                                        }`}>
                                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </div>
                                                    <span className={`font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                                        {option.name}
                                                    </span>
                                                </div>
                                                <input
                                                    type={group.type === 'radio' ? 'radio' : 'checkbox'}
                                                    name={`group-${group.id}`}
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => handleVariantChange(group.id, option.id, group.type)}
                                                />
                                                {priceAdj > 0 && (
                                                    <span className="text-sm font-bold text-slate-900">
                                                        +{formatPrice(priceAdj)}
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Sticky */}
                <div className="bg-white p-4 border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <span className="font-bold text-slate-900">Cantidad</span>
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 h-10">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-95 transition-transform"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-900 active:scale-95 transition-transform"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        className="w-full h-14 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all flex justify-between items-center px-6"
                    >
                        <span>Agregar</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
