import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import type { PageProps } from '@/types';
import { cn } from '@/lib/utils';

type PublicShellProps = PageProps & {
    selectedLocationName?: string | null;
    locationsCount?: number;
};

export default function SelectSede() {
    const { currentTenant, selectedLocationName, locationsCount = 0 } = usePage<PublicShellProps>().props;

    const shortsUrl = currentTenant?.slug ? route('tenant.public.shorts', currentTenant.slug) : null;
    const hasMultipleLocations = locationsCount > 1;

    if (!selectedLocationName || !shortsUrl) {
        return null;
    }

    return (
        <Link
            href={shortsUrl}
            className={cn(
                'group flex w-full max-w-[480px] mx-auto items-center justify-center gap-[5px] rounded-lg',
                'border border-gray-400 bg-slate-100 px-2 md:px-6 py-2 mb-2',
                'text-slate-800 transition-colors hover:bg-slate-200/90',
            )}
            data-layout="select-sede"
        >
            <p className="min-w-0 flex-1 text-center text-xs md:text-sm leading-normal font-sans">
                {hasMultipleLocations ? (
                    <>
                        <span className="font-normal">Sede actual: </span>
                        <span className="font-semibold">
                            {selectedLocationName}
                            {' | Toca para cambiar'}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="font-normal">Sede: </span>
                        <span className="font-semibold">
                            {selectedLocationName}
                            {' | Ver promociones'}
                        </span>
                    </>
                )}
            </p>
            <ArrowUpRight
                className="size-4 shrink-0 text-[#1d293d] transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
                strokeWidth={2}
                aria-hidden
            />
        </Link>
    );
}
