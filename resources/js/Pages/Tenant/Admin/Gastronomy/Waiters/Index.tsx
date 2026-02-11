import React, { useState, useMemo } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import {
    Plus,
    Minus,
    Trash2,
    Utensils,
    Table as TableIcon,
    Send,
    Search,
    UtensilsCrossed,
    ArrowLeft,
    ConciergeBell,
    AlertCircle,
    StickyNote
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { cn } from '@/lib/utils';

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
    price: number;
    image_url?: string;
    variant_groups: VariantGroup[];
}

interface Category {
    id: number;
    name: string;
    products: Product[];
}

interface Table {
    id: number;
    name: string;
    status: 'available' | 'occupied' | 'reserved';
}

interface Zone {
    id: number;
    name: string;
    tables: Table[];
}

interface CartItem {
    id: string;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    variant_options: any[];
    notes: string;
}

interface Props extends PageProps {
    categories: Category[];
    zones: Zone[];
    tenant: any;
}

export default function WaiterIndex({ categories, zones, tenant }: Props) {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Variant Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [modalQuantity, setModalQuantity] = useState(1);
    const [modalSelectedVariants, setModalSelectedVariants] = useState<Record<number, number[]>>({});
    const [modalNotes, setModalNotes] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return null;
        const results: Product[] = [];
        categories.forEach(cat => {
            cat.products.forEach(prod => {
                if (prod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    results.push(prod);
                }
            });
        });
        return results;
    }, [categories, searchQuery]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

    // When clicking a product: always open modal (for variants + notes)
    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setModalQuantity(1);
        setModalSelectedVariants({});
        setModalNotes('');
        setShowVariantModal(true);
    };

    // Calculate unit price inside modal
    const modalUnitPrice = useMemo(() => {
        if (!selectedProduct) return 0;
        let total = Number(selectedProduct.price);
        if (selectedProduct.variant_groups) {
            selectedProduct.variant_groups.forEach(group => {
                const selectedOptionIds = modalSelectedVariants[group.id] || [];
                selectedOptionIds.forEach(optionId => {
                    const option = group.options.find(o => o.id === optionId);
                    if (option) total += Number(option.price_adjustment);
                });
            });
        }
        return total;
    }, [selectedProduct, modalSelectedVariants]);

    const handleVariantChange = (groupId: number, optionId: number, type: 'radio' | 'checkbox') => {
        setModalSelectedVariants(prev => {
            const currentSelected = prev[groupId] || [];
            if (type === 'radio') return { ...prev, [groupId]: [optionId] };
            if (currentSelected.includes(optionId)) return { ...prev, [groupId]: currentSelected.filter(id => id !== optionId) };
            return { ...prev, [groupId]: [...currentSelected, optionId] };
        });
    };

    const handleModalConfirm = () => {
        if (!selectedProduct) return;

        // Validate required variants
        if (selectedProduct.variant_groups) {
            for (const group of selectedProduct.variant_groups) {
                if (group.is_required) {
                    const selected = modalSelectedVariants[group.id] || [];
                    if (selected.length < group.min_selection) {
                        toast.error(`Selecciona al menos ${group.min_selection} opción en ${group.name}`);
                        return;
                    }
                }
            }
        }

        // Build variant_options array
        const variantOptions: any[] = [];
        if (selectedProduct.variant_groups) {
            selectedProduct.variant_groups.forEach(group => {
                const selectedList = modalSelectedVariants[group.id] || [];
                selectedList.forEach(optId => {
                    const opt = group.options.find(o => o.id === optId);
                    if (opt) {
                        variantOptions.push({
                            name: `${group.name}: ${opt.name}`,
                            value: opt.name,
                            price: Number(opt.price_adjustment)
                        });
                    }
                });
            });
        }

        const itemId = `item-${Date.now()}-${Math.random()}`;
        const newItem: CartItem = {
            id: itemId,
            product_id: selectedProduct.id,
            product_name: selectedProduct.name,
            price: modalUnitPrice,
            quantity: modalQuantity,
            variant_options: variantOptions,
            notes: modalNotes.trim(),
        };

        setCart(prev => [...prev, newItem]);
        toast.success(`Añadido: ${selectedProduct.name}`);
        setShowVariantModal(false);
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmit = async () => {
        if (!selectedTable) {
            toast.error('Selecciona una mesa primero');
            return;
        }
        if (cart.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post(route('tenant.admin.waiters.store', { tenant: tenant.slug }), {
                service_type: 'dine_in',
                table_id: selectedTable.id,
                customer_name: `Mesa ${selectedTable.name}`,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    variant_options: item.variant_options,
                    notes: item.notes || undefined,
                }))
            });

            if (response.data.success) {
                toast.success('Pedido enviado a cocina');
                setCart([]);
                setSelectedTable(null);
            }
        } catch (error) {
            toast.error('Error al enviar pedido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout
            hideSidebar
            hideNavbar
            hideFooter
            maxwidth="w-full h-screen"
        >
            <Head title="Panel de Meseros" />

            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
                {/* Header Panel Meseros */}
                <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                            asChild
                        >
                            <Link href={route('tenant.dashboard', { tenant: tenant.slug })}>
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ConciergeBell className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">PANEL DE MESEROS</h1>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión de Mesas y Comandas</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {selectedTable && (
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Atendiendo</span>
                                <span className="text-sm font-black text-blue-600">Mesa {selectedTable.name}</span>
                            </div>
                        )}
                        <div className="h-8 w-px bg-slate-200 mx-1" />
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Sesión</span>
                            <span className="text-sm font-bold text-slate-700">{(usePage().props.auth?.user as any)?.name || 'Mesero'}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                    {/* Left: Product Selection */}
                    <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar productos..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <ScrollArea className="flex-1 bg-white rounded-xl border border-slate-200 p-4">
                            {searchQuery ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {filteredProducts && filteredProducts.length > 0 ? (
                                        filteredProducts.map(product => (
                                            <ProductCard key={product.id} product={product} onAdd={handleProductSelect} />
                                        ))
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                                            <Search className="w-10 h-10 mb-3 opacity-40" />
                                            <p className="text-sm font-medium">No se encontraron productos</p>
                                            <p className="text-xs">Intenta con otro término de búsqueda</p>
                                        </div>
                                    )}
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                    <AlertCircle className="w-12 h-12 mb-3 opacity-30" />
                                    <p className="text-sm font-bold">No hay categorías registradas</p>
                                    <p className="text-xs">Agrega categorías y productos desde el panel de administración</p>
                                </div>
                            ) : (
                                <Tabs defaultValue={categories[0]?.id.toString()} className="w-full">
                                    <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-slate-100/50 mb-4">
                                        {categories.map(cat => (
                                            <TabsTrigger key={cat.id} value={cat.id.toString()} className="py-2 px-4">
                                                {cat.name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {categories.map(cat => (
                                        <TabsContent key={cat.id} value={cat.id.toString()}>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {cat.products.length > 0 ? (
                                                    cat.products.map(product => (
                                                        <ProductCard key={product.id} product={product} onAdd={handleProductSelect} />
                                                    ))
                                                ) : (
                                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                                                        <Utensils className="w-8 h-8 mb-2 opacity-30" />
                                                        <p className="text-sm font-medium">Sin productos en esta categoría</p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Right: Table Selection & Cart */}
                    <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                        {/* Table Selection */}
                        <Card className="shrink-0 border-slate-200">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-500">
                                    <TableIcon className="w-4 h-4 text-blue-500" />
                                    Selección de Mesa
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                {zones.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                        <TableIcon className="w-8 h-8 mb-2 opacity-30" />
                                        <p className="text-xs font-medium">No hay zonas ni mesas registradas</p>
                                    </div>
                                ) : (
                                    <Tabs defaultValue={zones[0]?.id.toString()} className="w-full">
                                        <TabsList className="w-full overflow-x-auto justify-start h-auto p-0.5 bg-slate-50 mb-3">
                                            {zones.map(zone => (
                                                <TabsTrigger key={zone.id} value={zone.id.toString()} className="text-[10px] uppercase py-1 px-2">
                                                    {zone.name}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                        {zones.map(zone => (
                                            <TabsContent key={zone.id} value={zone.id.toString()} className="mt-0">
                                                <div className="grid grid-cols-4 gap-2">
                                                    {zone.tables.map(table => (
                                                        <button
                                                            key={table.id}
                                                            onClick={() => setSelectedTable(table)}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center p-2 rounded-lg border text-sm transition-all",
                                                                selectedTable?.id === table.id
                                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-100"
                                                                    : (table.status === 'occupied'
                                                                        ? "bg-amber-50 border-amber-200 text-amber-700"
                                                                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300")
                                                            )}
                                                        >
                                                            <span className="font-bold">{table.name}</span>
                                                            {table.status === 'occupied' && (
                                                                <div className="w-1 h-1 rounded-full bg-amber-500 mt-1" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                )}
                            </CardContent>
                        </Card>

                        {/* Cart Section */}
                        <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm">
                            <CardHeader className="p-4 pb-2 bg-slate-50/50 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-500">
                                    <UtensilsCrossed className="w-4 h-4 text-green-500" />
                                    Pedido Actual
                                </CardTitle>
                                {selectedTable && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                        Mesa {selectedTable.name}
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                                <ScrollArea className="flex-1 px-4 py-2">
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-40 text-slate-400 opacity-60">
                                            <Plus className="w-8 h-8 mb-2 border-2 border-dashed rounded-full p-1" />
                                            <p className="text-sm font-medium">Carrito vacío</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex flex-col gap-1 pb-3 border-b border-slate-100 last:border-0">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-semibold text-sm text-slate-800 leading-tight">
                                                            {item.product_name}
                                                        </span>
                                                        <span className="font-bold text-sm text-slate-900">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                    {item.variant_options && item.variant_options.length > 0 && (
                                                        <p className="text-[10px] text-blue-600 font-medium leading-tight">
                                                            {item.variant_options.map((v: any) => v.name || v.value).join(' · ')}
                                                        </p>
                                                    )}
                                                    {item.notes && (
                                                        <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                                                            <StickyNote className="w-3 h-3 inline" />
                                                            {item.notes}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 rounded-md hover:bg-white"
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </Button>
                                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 rounded-md hover:bg-white"
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* Footer Cart */}
                                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Total Estimado</span>
                                        <span className="text-xl font-black text-slate-900">{formatPrice(total)}</span>
                                    </div>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-200"
                                        disabled={cart.length === 0 || !selectedTable || isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        {isSubmitting ? 'Enviando...' : 'ENVIAR A COCINA'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            {/* Variant & Notes Modal */}
            <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl">
                    <DialogHeader className="p-4 border-b border-slate-100 flex-shrink-0">
                        <DialogTitle className="flex items-center justify-between">
                            <span className="font-bold text-lg text-slate-900">{selectedProduct?.name}</span>
                            <span className="text-lg font-black text-blue-600">{formatPrice(modalUnitPrice)}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Variant Groups */}
                        {selectedProduct?.variant_groups?.map(group => (
                            <div key={group.id} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 text-sm">{group.name}</h3>
                                    {group.is_required && (
                                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                            Requerido
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {group.options.map(option => {
                                        const isSelected = (modalSelectedVariants[group.id] || []).includes(option.id);
                                        const priceAdj = Number(option.price_adjustment);
                                        return (
                                            <label
                                                key={option.id}
                                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${isSelected
                                                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                                                        }`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
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
                                                    <span className="text-xs font-bold text-slate-600">+{formatPrice(priceAdj)}</span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Notes field */}
                        <div className="space-y-2">
                            <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-amber-500" />
                                Nota para cocina
                            </label>
                            <Textarea
                                placeholder="Ej: Sin cebolla, extra salsa, poco picante..."
                                value={modalNotes}
                                onChange={(e) => setModalNotes(e.target.value)}
                                className="resize-none h-20 text-sm"
                                maxLength={200}
                            />
                            <p className="text-[10px] text-slate-400 text-right">{modalNotes.length}/200</p>
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50 flex-col sm:flex-row gap-3">
                        <div className="flex items-center justify-center bg-white rounded-xl border border-slate-200 h-12 w-full sm:w-auto px-1 shadow-sm">
                            <button
                                onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                                className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-red-600 active:scale-90 transition-transform"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-lg text-slate-900">{modalQuantity}</span>
                            <button
                                onClick={() => setModalQuantity(modalQuantity + 1)}
                                className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-blue-600 active:scale-90 transition-transform"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <Button
                            onClick={handleModalConfirm}
                            className="flex-1 h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                        >
                            <span>Agregar {modalQuantity > 1 && `(${modalQuantity})`}</span>
                            <span className="ml-auto bg-black/20 px-2 py-0.5 rounded text-sm">
                                {formatPrice(modalUnitPrice * modalQuantity)}
                            </span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
    const hasVariants = product.variant_groups && product.variant_groups.length > 0;
    return (
        <button
            onClick={() => onAdd(product)}
            className="flex flex-col text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all group relative"
        >
            <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <Utensils className="w-8 h-8 text-slate-300" />
                )}
            </div>
            {hasVariants && (
                <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    Opciones
                </span>
            )}
            <div className="p-2 space-y-1">
                <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-blue-600 font-black text-sm">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price)}
                </p>
            </div>
        </button>
    );
}
