import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/Components/ui/sheet";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
    Clock,
    Flame,
    Star,
    UtensilsCrossed,
    AlertCircle,
    ChevronRight,
    Calendar,
    Tag,
    Info,
    Layers,
    MapPin
} from "lucide-react";
import { formatPrice } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
}

interface LocationPivot {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category?: Category;
    price: string | number;
    cost?: string | number;
    sku?: string;
    image: string;
    image_url?: string | null;
    gallery?: string[];
    gallery_urls?: string[];
    is_available: boolean;
    is_featured: boolean;
    status: 'active' | 'inactive';
    short_description?: string;
    preparation_time?: number | string;
    calories?: number | string;
    allergens?: string[];
    tags?: string[];
    variant_groups?: VariantGroup[];
    variantGroups?: VariantGroup[];
    locations?: LocationPivot[];
}

interface VariantOption {
    id: number;
    name: string;
    price_adjustment: number | string;
    is_available: boolean;
}

interface VariantGroup {
    id: number;
    name: string;
    type: 'radio' | 'checkbox';
    is_required: boolean;
    options: VariantOption[];
}

interface Props {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProductViewDrawer({ product, open, onOpenChange }: Props) {
    if (!product) return null;

    const getImageUrl = (img: string) => {
        if (!img) return '';
        return img.startsWith('http') || img.startsWith('/') ? img : `/media/${img}`;
    };

    const heroImageUrl = product.image_url || getImageUrl(product.image);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md p-0 gap-0 flex flex-col">
                <ScrollArea className="flex-1 overflow-y-auto">
                    {/* Hero Image Section */}
                    <div className="relative aspect-video w-full bg-muted overflow-hidden">
                        <img
                            src={heroImageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        <div className="absolute top-4 left-4 flex gap-2">
                            {product.is_featured && (
                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-lg scale-110">
                                    <Star className="w-3.5 h-3.5 fill-white" /> Destacado
                                </Badge>
                            )}
                            <Badge variant={product.is_available ? 'default' : 'secondary'} className="shadow-lg">
                                {product.is_available ? 'Disponible' : 'Agotado'}
                            </Badge>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                    {product.category?.name || 'Gastronomía'}
                                </p>
                                <SheetTitle className="text-3xl font-black leading-tight tracking-tight">
                                    {product.name}
                                </SheetTitle>
                                <div className="text-2xl font-black text-primary mt-2">
                                    {formatPrice(product.price)}
                                </div>
                            </div>

                            {product.short_description && (
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {product.short_description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 pt-2">
                                {product.preparation_time && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border text-xs font-bold text-muted-foreground">
                                        <Clock className="w-3.5 h-3.5" />
                                        {product.preparation_time} min
                                    </div>
                                )}
                                {product.calories && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border text-xs font-bold text-muted-foreground">
                                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                                        {product.calories} Kcal
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Gallery */}
                        {product.gallery && product.gallery.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <ChevronRight className="w-3 h-3 text-primary" /> Galería Adicional
                                </h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {product.gallery.map((img, i) => {
                                        const galleryUrl = product.gallery_urls?.[i] || getImageUrl(img);
                                        return (
                                            <div key={i} className="aspect-square rounded-lg overflow-hidden border bg-muted group cursor-zoom-in">
                                                <img
                                                    src={galleryUrl}
                                                    alt={`Gallery ${i}`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Variants Section - Handle both snake_case (standard API) and camelCase (Eloquent relation default) */}
                        {(product.variant_groups || product.variantGroups) && (product.variant_groups || product.variantGroups)?.length! > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Layers className="w-3 h-3 text-purple-500" /> Personalización
                                </h4>
                                <div className="grid gap-3">
                                    {(product.variant_groups || product.variantGroups)?.map((group, i) => (
                                        <div key={i} className="rounded-lg border bg-muted/30 p-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold">{group.name}</span>
                                                <div className="flex gap-1">
                                                    {group.is_required && <Badge variant="destructive" className="text-[10px] h-5 px-1.5">Req</Badge>}
                                                    <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-white">{group.type === 'radio' ? '1' : 'Multi'}</Badge>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                {group.options.map((opt, j) => (
                                                    <div key={j} className="flex justify-between text-xs text-muted-foreground">
                                                        <span>{opt.name}</span>
                                                        {Number(opt.price_adjustment) > 0 && (
                                                            <span className="font-medium text-primary">+{formatPrice(opt.price_adjustment)}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="bg-muted/30" />
                            </div>
                        )}
                        <Separator className="bg-muted/30" />

                        {/* Culinary Details */}
                        <div className="flex flex-col gap-8">
                            {/* Allergens */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 text-orange-500" /> Alérgenos
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {product.allergens && product.allergens.length > 0 ? (
                                        product.allergens.map((allergen) => (
                                            <Badge key={allergen} variant="outline" className="text-[10px] font-bold bg-orange-50/50 border-orange-100 text-orange-700">
                                                {allergen}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">Ninguno especificado</span>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Tag className="w-3 h-3 text-blue-500" /> Etiquetas
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {product.tags && product.tags.length > 0 ? (
                                        product.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-[10px] font-bold bg-blue-50/50 border-blue-100 text-blue-700 capitalize">
                                                {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-[10px] text-muted-foreground italic">Sin etiquetas</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Locations */}
                        {product.locations && product.locations.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-primary" /> Sedes
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {product.locations.map((loc) => (
                                        <Badge key={loc.id} variant="outline" className="text-[10px] font-bold gap-1">
                                            <MapPin className="w-2.5 h-2.5" /> {loc.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Info */}
                        <div className="rounded-xl border bg-muted/20 p-4 space-y-3 mt-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-medium">SKU / Código</span>
                                <span className="font-bold">{product.sku || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground font-medium">Estado General</span>
                                <Badge variant={product.status === 'active' ? 'outline' : 'secondary'} className={product.status === 'active' ? 'text-green-600 border-green-200 bg-green-50/50' : ''}>
                                    {product.status === 'active' ? '● Activo' : '● Inactivo'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer Tips */}
                <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-[11px] text-primary/80 leading-snug italic">
                            Esta es una vista previa de cómo aparece el producto en tu menú digital. Los clientes verán un diseño similar optimizado para móviles.
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
