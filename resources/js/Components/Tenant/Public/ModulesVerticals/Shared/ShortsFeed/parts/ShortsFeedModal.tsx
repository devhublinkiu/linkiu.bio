import { Dialog, DialogContent, DialogTitle } from '@/Components/ui/dialog';
import { usePublicLayoutPortal } from '@/Components/Tenant/Public/contexts/PublicLayoutPortalContext';
import { buildEmbedUrl } from '../shortsFeedEmbed';
import type { ShortsFeedItem } from '../shortsFeedTypes';

interface ShortsFeedModalProps {
    active: ShortsFeedItem | null;
    onOpenChange: (open: boolean) => void;
}

export default function ShortsFeedModal({ active, onOpenChange }: ShortsFeedModalProps) {
    const portalContainer = usePublicLayoutPortal();

    return (
        <Dialog open={active !== null} onOpenChange={onOpenChange}>
            <DialogContent
                portalContainer={portalContainer ?? undefined}
                showCloseButton
                className="max-h-[90vh] max-w-[min(22rem,calc(100vw-2rem))] gap-0 overflow-hidden border-0 bg-black p-0 text-white sm:max-w-[min(22rem,calc(100vw-2rem))] [&_button]:text-white [&_button]:hover:bg-white/15"
            >
                {active && (
                    <>
                        <DialogTitle className="sr-only">{active.name}</DialogTitle>
                        <div className="relative aspect-[9/16] w-full bg-black">
                            <iframe
                                title={active.name}
                                src={buildEmbedUrl(active.short_embed_url, true)}
                                className="absolute inset-0 size-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="space-y-2 border-t border-white/10 bg-slate-950 p-3 text-white">
                            <p className="text-sm font-semibold leading-snug">{active.name}</p>
                            {active.description ? (
                                <p className="text-xs leading-relaxed text-white/80">{active.description}</p>
                            ) : null}
                            {active.action_url && active.action_url !== '#' ? (
                                <a
                                    href={active.action_url}
                                    className="inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors hover:bg-white/90"
                                >
                                    Ver promoción
                                </a>
                            ) : null}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
