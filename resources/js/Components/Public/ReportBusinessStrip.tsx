import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedShinyText } from '@/Components/ui/animated-shiny-text';
import ReportModal from '@/Components/Public/ReportModal';

export default function ReportBusinessStrip() {
    const [open, setOpen] = useState(false);
    const page = usePage();
    const tenant = (page.props as { currentTenant?: { slug: string } }).currentTenant;
    const tenantSlug = tenant?.slug ?? '';

    if (!tenantSlug) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    'group flex w-full items-center justify-center border-y border-black/5 bg-neutral-100 py-2 px-4 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                )}
            >
                <AnimatedShinyText className="inline-flex items-center justify-center gap-1.5 px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>¿Problemas con este negocio? <span className="text-red-600 font-bold">Reporta aquí</span></span>
                    <ArrowRight className="ml-1 size-3 shrink-0 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" aria-hidden />
                </AnimatedShinyText>
            </button>
            <ReportModal open={open} onOpenChange={setOpen} tenantSlug={tenantSlug} />
        </>
    );
}
