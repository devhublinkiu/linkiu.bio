import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: {
        icon_url: string;
        name: string;
    };
    icon_url?: string;
}

interface CategoryGridProps {
    categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const { currentTenant } = usePage<PageProps>().props;

    if (!categories || categories.length === 0 || !currentTenant) return null;

    return (
        <div className="w-full px-4 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Categorías</h2>
                <Link
                    href={route('tenant.menu', [currentTenant.slug])}
                    className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                >
                    Ver todo
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={route('tenant.menu.category', [currentTenant.slug, category.slug])}
                        className="flex flex-col items-center gap-2.5 group"
                    >
                        {/* Squircle (Soft Rounded Square) Container - Modern & Premium */}
                        <div className="w-[4.5rem] h-[4.5rem] rounded-[1.2rem] bg-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95 border border-slate-100/80 overflow-hidden relative">
                            {/* Subtle internal gradient */}
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

                        {/* Label */}
                        <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight line-clamp-2 px-0.5 group-hover:text-slate-900 transition-colors">
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
