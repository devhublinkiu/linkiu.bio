import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { VariantOption, VariantGroup, Product } from '@/types/pos';

interface VariantSelectorModalProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddToCart: (product: Product, quantity: number, variants: Record<number, number[]>, total: number, notes?: string) => void;
}

export default function VariantSelectorModal({ product, open, onOpenChange, onAddToCart }: VariantSelectorModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<Record<number, number[]>>({});
    const [notes, setNotes] = useState('');

    // Reset state when product changes
    useEffect(() => {
        if (open && product) {
            setQuantity(1);
            setSelectedVariants({});
            setNotes('');
        }
    }, [open, product]);

    const basePrice = product ? Number(product.price) : 0;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Calculate total price
    const unitPrice = useMemo(() => {
        if (!product) return 0;
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
        return total;
    }, [product, selectedVariants, basePrice]);

    const totalPrice = unitPrice * quantity;

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

    const handleConfirm = () => {
        if (!product) return;

        // Validation
        if (product.variant_groups) {
            for (const group of product.variant_groups) {
                if (group.is_required) {
                    const selected = selectedVariants[group.id] || [];
                    if (selected.length < group.min_selection) {
                        toast.error(`Selecciona al menos ${group.min_selection} opción en ${group.name}`);
                        return;
                    }
                }
            }
        }

        onAddToCart(product, quantity, selectedVariants, totalPrice, notes.trim() || undefined);
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl">
                <DialogHeader className="p-4 border-b border-slate-100 flex-shrink-0">
                    <DialogTitle className="flex items-center justify-between">
                        <span className="font-bold text-lg text-slate-900">{product.name}</span>
                        <span className="text-lg font-black text-indigo-600">{formatPrice(unitPrice)}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 intro-y">
                    {/* Variants */}
                    {product.variant_groups?.map(group => (
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
                                    const isSelected = (selectedVariants[group.id] || []).includes(option.id);
                                    const priceAdj = Number(option.price_adjustment);

                                    return (
                                        <label
                                            key={option.id}
                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${isSelected
                                                ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected
                                                    ? 'bg-indigo-600 border-indigo-600'
                                                    : 'border-slate-300'
                                                    }`}>
                                                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
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
                                                <span className="text-xs font-bold text-slate-600">
                                                    +{formatPrice(priceAdj)}
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {(!product.variant_groups || product.variant_groups.length === 0) && (
                        <div className="text-center py-4 text-slate-400 text-sm">
                            Este producto no tiene opciones adicionales.
                        </div>
                    )}

                    {/* Notas / Instrucciones especiales */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-slate-800 text-sm">Notas especiales</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ej: Sin cebolla, extra queso, término medio..."
                            maxLength={200}
                            rows={2}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                        <div className="text-[10px] text-slate-400 text-right">{notes.length}/200</div>
                    </div>
                </div>

                <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50 flex-col sm:flex-row gap-3">
                    {/* Quantity Control */}
                    <div className="flex items-center justify-center bg-white rounded-xl border border-slate-200 h-12 w-full sm:w-auto px-1 shadow-sm">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-red-600 active:scale-90 transition-transform"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-lg text-slate-900">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-indigo-600 active:scale-90 transition-transform"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    <Button
                        onClick={handleConfirm}
                        className="flex-1 h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                    >
                        <span>Agregar {quantity > 1 && `(${quantity})`}</span>
                        <span className="ml-auto bg-black/20 px-2 py-0.5 rounded text-sm">
                            {formatPrice(totalPrice)}
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
