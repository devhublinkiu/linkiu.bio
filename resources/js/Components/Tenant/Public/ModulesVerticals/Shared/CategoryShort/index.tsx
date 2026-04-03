import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ExploreCategoriesButton from './parts/ExploreCategoriesButton';
import HeroCategoryShort from './parts/HeroCategoryShort';
import ItemsCategoryShort from './parts/ItemsCategoryShort';
import { cn } from '@/lib/utils';
import type { CategoryShortCategory } from './types';

export type { CategoryShortCategory } from './types';

/** Mobile: 4×2 = 8 · Desktop (md+): 5×2 = 10 */
const ITEMS_PER_PAGE_MOBILE = 8;
const ITEMS_PER_PAGE_DESKTOP = 10;
const MD_UP = '(min-width: 768px)';

function chunkCategories<T>(items: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        out.push(items.slice(i, i + size));
    }
    return out;
}

interface Props {
    categories: CategoryShortCategory[];
    tenantSlug: string;
    className?: string;
}

export default function CategoryShort({ categories, tenantSlug, className }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_MOBILE);

    useEffect(() => {
        const mq = window.matchMedia(MD_UP);
        const apply = () => setItemsPerPage(mq.matches ? ITEMS_PER_PAGE_DESKTOP : ITEMS_PER_PAGE_MOBILE);
        apply();
        mq.addEventListener('change', apply);
        return () => mq.removeEventListener('change', apply);
    }, []);

    const pages = useMemo(() => chunkCategories(categories, itemsPerPage), [categories, itemsPerPage]);
    const pageCount = pages.length;
    const multiPage = pageCount > 1;

    const syncPageFromScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || pageCount === 0) return;
        const w = el.offsetWidth;
        if (w <= 0) return;
        const idx = Math.round(el.scrollLeft / w);
        setPageIndex(Math.min(Math.max(0, idx), pageCount - 1));
    }, [pageCount]);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.scrollLeft = 0;
        }
        setPageIndex(0);
    }, [categories, itemsPerPage]);

    const goToPage = useCallback(
        (index: number) => {
            const el = scrollRef.current;
            if (!el || pageCount <= 0) return;
            const clamped = Math.min(Math.max(0, index), pageCount - 1);
            const w = el.offsetWidth;
            el.scrollTo({ left: clamped * w, behavior: 'smooth' });
            setPageIndex(clamped);
        },
        [pageCount],
    );

    const goPrev = useCallback(() => goToPage(pageIndex - 1), [goToPage, pageIndex]);
    const goNext = useCallback(() => goToPage(pageIndex + 1), [goToPage, pageIndex]);

    if (!categories?.length) {
        return null;
    }

    return (
        <section className={cn('w-full', className)} aria-labelledby="category-short-heading">
            <HeroCategoryShort
                headingId="category-short-heading"
                availableCount={categories.length}
                onPrev={multiPage ? goPrev : undefined}
                onNext={multiPage ? goNext : undefined}
                prevDisabled={pageIndex <= 0}
                nextDisabled={pageIndex >= pageCount - 1}
            />

            <div
                ref={scrollRef}
                onScroll={syncPageFromScroll}
                className={cn(
                    'flex w-full snap-x snap-mandatory overflow-x-auto pb-1',
                    '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                )}
                role="region"
                aria-roledescription="carrusel"
                aria-label="Categorías por página"
            >
                {pages.map((pageCategories, pageIdx) => (
                    <div
                        key={pageIdx}
                        className="w-full min-w-full shrink-0 snap-start"
                        aria-label={`Página ${pageIdx + 1} de ${pageCount}`}
                    >
                        <div className="grid grid-cols-4 gap-x-1.5 gap-y-2 md:grid-cols-5 md:gap-x-1.5 md:gap-y-2.5">
                            {pageCategories.map((category) => (
                                <div key={category.id} className="flex justify-center">
                                    <ItemsCategoryShort category={category} tenantSlug={tenantSlug} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex w-full justify-center">
                <ExploreCategoriesButton tenantSlug={tenantSlug} />
            </div>
        </section>
    );
}

export { default as ExploreCategoriesButton } from './parts/ExploreCategoriesButton';
export { default as HeroCategoryShort } from './parts/HeroCategoryShort';
export { default as ItemsCategoryShort } from './parts/ItemsCategoryShort';
