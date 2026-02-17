import React, { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/Components/ui/sheet";
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Card } from '@/Components/ui/card';
import { Search, ChefHat } from 'lucide-react';
import { Category, Product } from '@/types/pos';
import { formatCurrency } from '@/utils/currency';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    onProductSelect: (product: Product) => void;
}

export default function ProductCatalogDrawer({ open, onOpenChange, categories, onProductSelect }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>(categories.length > 0 ? String(categories[0].id) : 'all');

    // Filter Products
    const filteredProducts = useMemo(() => {
        let products: Product[] = [];

        if (activeCategory === 'all') {
            categories.forEach(cat => products.push(...cat.products));
        } else {
            const category = categories.find(c => String(c.id) === activeCategory);
            if (category) products = category.products;
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );
        }

        return products;
    }, [categories, activeCategory, searchQuery]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[100vw] sm:w-[600px] p-0 flex flex-col h-full bg-slate-50">
                <div className="p-4 border-b bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <SheetTitle>Catálogo de Productos</SheetTitle>
                        {/* Close button is automatic in SheetContent, but we can customize header if needed */}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar productos..."
                            className="pl-9 bg-slate-100 border-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="border-b bg-white px-4 pb-2">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex space-x-2 pb-2">
                            <Button
                                variant={activeCategory === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setActiveCategory('all')}
                                className={activeCategory === 'all' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                            >
                                Todo
                            </Button>
                            {categories.map(category => (
                                <Button
                                    key={category.id}
                                    variant={activeCategory === String(category.id) ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setActiveCategory(String(category.id))}
                                    className={activeCategory === String(category.id) ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-20">
                        {filteredProducts.map(product => (
                            <Card
                                key={product.id}
                                className="group cursor-pointer overflow-hidden hover:shadow-md transition-all border-slate-200"
                                onClick={() => {
                                    onProductSelect(product);
                                    // Optional: Don't close to allow multiple adds
                                    // onOpenChange(false); 
                                }}
                            >
                                <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ChefHat className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                                <div className="p-3">
                                    <div className="font-medium text-slate-800 line-clamp-2 text-sm h-10 leading-tight">
                                        {product.name}
                                    </div>
                                    <div className="font-bold text-indigo-600 mt-1">
                                        {formatCurrency(product.price)}
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center py-10 text-slate-500">
                                <p>No se encontraron productos</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
