import { cn } from '@/lib/utils';

export type SocialPlatformId = 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube';

const PLATFORMS: { id: SocialPlatformId; label: string; src: string }[] = [
    { id: 'instagram', label: 'Instagram', src: '/tenant/FooterShell/instagram.svg' },
    { id: 'facebook', label: 'Facebook', src: '/tenant/FooterShell/facebook.svg' },
    { id: 'tiktok', label: 'TikTok', src: '/tenant/FooterShell/tiktok.svg' },
    { id: 'twitter', label: 'X (Twitter)', src: '/tenant/FooterShell/twitter.svg' },
    { id: 'youtube', label: 'YouTube', src: '/tenant/FooterShell/youtube.svg' },
];

export type SocialMediaProps = {
    className?: string;
    /** URLs por red (admin). Sin URL el enlace no navega hasta que se configure. */
    links?: Partial<Record<SocialPlatformId, string>>;
};

/**
 * Redes del negocio — diseño Figma nodo 257:1380 (slate-200, rounded-lg, p-1, icono 24px).
 * Los cinco SVG viven en `public/tenant/FooterShell/`.
 */
export default function SocialMedia({ className, links }: SocialMediaProps) {
    return (
        <nav
            className={cn(
                'footer-shell-social flex flex-wrap items-center justify-center gap-3 px-4 py-2',
                className,
            )}
            aria-label="Redes sociales"
            data-part="social-media"
        >
            {PLATFORMS.map(({ id, label, src }) => {
                const href = links?.[id]?.trim();
                const active = Boolean(href);

                return (
                    <a
                        key={id}
                        href={href || '#'}
                        target={active ? '_blank' : undefined}
                        rel={active ? 'noopener noreferrer' : undefined}
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 p-1 transition-opacity hover:opacity-90"
                        aria-label={label}
                        aria-disabled={!active}
                        data-social={id}
                        data-active={active}
                        onClick={(e) => {
                            if (!active) e.preventDefault();
                        }}
                    >
                        <img src={src} alt="" className="size-6 object-contain" width={24} height={24} />
                    </a>
                );
            })}
        </nav>
    );
}
