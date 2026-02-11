import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    icon?: {
        name: string;
        path: string;
    } | null;
}

interface CategoryNavProps {
    categories: Category[];
    activeCategoryId: number | null;
    onCategoryClick: (id: number) => void;
}

export default function CategoryNav({ categories, activeCategoryId, onCategoryClick }: CategoryNavProps) {
    const navRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLButtonElement>(null);

    // Auto-scroll the active pill into view
    useEffect(() => {
        if (activeRef.current && navRef.current) {
            const container = navRef.current;
            const pill = activeRef.current;

            const containerWidth = container.offsetWidth;
            const pillOffset = pill.offsetLeft;
            const pillWidth = pill.offsetWidth;

            const scrollTo = pillOffset - (containerWidth / 2) + (pillWidth / 2);

            container.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    }, [activeCategoryId]);

    return (
        <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
            <div
                ref={navRef}
                className="flex items-center gap-2 p-4 overflow-x-auto scrollbar-hide no-scrollbar select-none"
            >
                {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;

                    return (
                        <button
                            key={category.id}
                            ref={isActive ? activeRef : null}
                            onClick={() => onCategoryClick(category.id)}
                            className={`
                                shrink-0 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                                ${isActive
                                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }
                            `}
                        >
                            {category.name}
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-slate-900 rounded-2xl z-[-1]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}
