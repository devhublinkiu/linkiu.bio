import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import VerifiedInsightIcon from './VerifiedInsightIcon';

export default function Hero() {
    const { currentTenant } = usePage<PageProps>().props;

    const name = currentTenant?.name?.trim() ?? '';
    const logoUrl = currentTenant?.logo_url;
    const description = currentTenant?.store_description?.trim() ?? '';

    if (!name) {
        return null;
    }

    const logoSrc =
        logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    return (
        <div
            className="w-full rounded-lg bg-slate-950 p-6 flex flex-row gap-6 items-center justify-center"
            data-layout="hero-frontend-linkiu"
            data-name="Hero_frontend_linkiu"
        >
            <div className="shrink-0 size-16 rounded-full border-2 border-blue-50 overflow-hidden bg-white">
                <img src={logoSrc} alt="" className="size-full object-cover" width={64} height={64} />
            </div>

            <div className="min-w-0 flex-1 flex flex-col gap-1 items-start">
                <div className="flex w-full min-w-0 items-center gap-2">
                    <h1 className="text-lg font-bold text-slate-50 leading-none truncate font-sans">{name}</h1>
                    <VerifiedInsightIcon />
                </div>
                {description ? (
                    <p className="w-full text-xs font-normal text-slate-50 leading-snug font-sans line-clamp-2">
                        {description}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
