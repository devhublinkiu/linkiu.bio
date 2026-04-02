import { usePage } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import type { PageProps } from '@/types';
import { cn } from '@/lib/utils';

/** "Cerrado" → variante roja (Figma Badge_home_close); resto → esmeralda (Badge_home_open). */
function variantFromMessage(message: string): 'open' | 'closed' {
    const lower = message.toLowerCase();
    if (lower.includes('cerrado')) {
        return 'closed';
    }
    return 'open';
}

export default function OpeningHours() {
    const { location_status_message, currentTenant } = usePage<PageProps>().props;
    const verticalSlug = currentTenant?.vertical?.slug;

    if (!location_status_message || verticalSlug !== 'gastronomia') {
        return null;
    }

    const variant = variantFromMessage(location_status_message);

    return (
        <div className="flex w-full justify-center mt-2" data-opening-hours-wrap>
            <div
                className={cn(
                    'inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-full px-2 py-1 font-sans',
                    variant === 'open' && 'bg-emerald-200 text-emerald-900',
                    variant === 'closed' && 'bg-red-200 text-red-600',
                )}
                data-layout="opening-hours"
                role="status"
                aria-live="polite"
            >
                <Clock className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                <p className="text-center text-xs font-normal leading-tight">{location_status_message}</p>
            </div>
        </div>
    );
}
