import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import Header from '@/Components/Tenant/Gastronomy/Public/Header';
import { Search, X } from 'lucide-react';

interface TenantProps {
    slug: string;
    name: string;
    logo_url?: string;
    store_description?: string;
    brand_colors?: { bg_color?: string; name_color?: string; description_color?: string };
}

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: {
        icon_url: string;
        name: string;
    } | null;
}

interface Props {
    tenant: TenantProps;
    categories: Category[];
}

export default function Index({ tenant, categories }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const brandColors = tenant.brand_colors ?? { bg_color: '#f8fafc', name_color: '#1e293b', description_color: '#64748b' };
    const { bg_color, name_color } = brandColors;

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Menú - ${tenant.name}`} />

            <div className="flex flex-col min-h-screen bg-gray-50/50">
                <Header
                    tenantName={tenant.name}
                    logoUrl={tenant.logo_url}
                    description={tenant.store_description}
                    bgColor={bg_color}
                    textColor={name_color}
                    descriptionColor={brandColors.description_color}
                />

                {/* 1. Category Grid (At the Top) */}
                <div className="p-4 bg-white mb-2">
                    <div className="grid grid-cols-4 gap-4">
                        {filteredCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={route('tenant.menu.category', [tenant.slug, category.slug])}
                                className="flex flex-col items-center gap-2.5 group"
                            >
                                {/* Squircle (Soft Rounded Square) Container - EXACTLY as CategoryGrid.tsx */}
                                <div className="w-[4.5rem] h-[4.5rem] rounded-[1.2rem] bg-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 border border-slate-100/80 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 opacity-50" />

                                    {category.icon ? (
                                        <img
                                            src={category.icon.icon_url}
                                            alt={category.name}
                                            className="w-9 h-9 object-contain relative z-10 opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs relative z-10">
                                            {category.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight line-clamp-2 px-0.5 group-hover:text-slate-900 transition-colors">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 2. Sticky Search Bar */}
                <div className="sticky top-0 z-[100] bg-white shadow-sm border-b border-slate-100">
                    <div className="px-4 pt-4 pb-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="size-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-12 pr-10 bg-slate-100 border-transparent focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 rounded-2xl text-sm font-medium transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute inset-y-0 right-3 flex items-center px-1"
                                >
                                    <X className="size-4 text-slate-400 bg-slate-200 rounded-full p-0.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Empty Area per user request "quitemos ese menu" */}
                <div className="flex-1 bg-gray-50/50 p-4 pb-32">
                    {/* Placeholder for future explore content or just empty */}
                    <div className="text-center py-10 opacity-50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Selecciona una categoría para ver productos
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </PublicLayout>
    );
}
