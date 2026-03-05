import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Radio, Calendar, Play, ExternalLink } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface SermonPublic {
    id: number;
    youtube_video_id: string;
    title: string;
    thumbnail_url: string | null;
    status: string;
    published_at: string | null;
    live_start_at: string | null;
    formatted_duration: string | null;
    embed_url: string;
    watch_url: string;
}

interface SermonsByDate {
    key: string;
    label: string;
    sermons: SermonPublic[];
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    sermons_live: SermonPublic[];
    sermons_upcoming: SermonPublic[];
    sermons_by_date: SermonsByDate[];
}

function SermonCard({ sermon, variant, tenantSlug }: { sermon: SermonPublic; variant: 'live' | 'upcoming' | 'completed'; tenantSlug: string }) {
    const badge =
        variant === 'live' ? (
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                EN VIVO
            </span>
        ) : variant === 'upcoming' && sermon.live_start_at ? (
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-white">
                {new Date(sermon.live_start_at).toLocaleDateString('es', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </span>
        ) : variant === 'completed' && sermon.published_at ? (
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-600 text-white">
                {new Date(sermon.published_at).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
        ) : null;

    return (
        <Link
            href={route('tenant.public.sermons.show', [tenantSlug, sermon.id])}
            className="flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
        >
            <div className="relative w-28 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                {sermon.thumbnail_url ? (
                    <img src={sermon.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="size-6 text-slate-400" />
                    </div>
                )}
                {badge}
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm">{sermon.title}</h3>
                {variant === 'completed' && sermon.formatted_duration && (
                    <p className="text-xs text-slate-500 mt-0.5">{sermon.formatted_duration}</p>
                )}
                {variant === 'live' && (
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Radio className="size-3.5" />
                        Transmisión en vivo
                    </p>
                )}
                {variant === 'upcoming' && (
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        Próxima transmisión
                    </p>
                )}
            </div>
            <ExternalLink className="size-4 text-slate-400 shrink-0 self-center" />
        </Link>
    );
}

export default function SermonsIndex({ tenant, sermons_live, sermons_upcoming, sermons_by_date }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';
    const hasAny = sermons_live.length > 0 || sermons_upcoming.length > 0 || sermons_by_date.length > 0;

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Predicas - ${tenant.name}`} />

            <div className="flex flex-col">
                <Header
                    tenantName={tenant.name}
                    description={tenant.store_description}
                    logoUrl={tenant.logo_url}
                    bgColor={bg_color}
                    textColor={brandColors.name_color ?? '#ffffff'}
                    descriptionColor={brandColors.description_color}
                />
            </div>

            <div className="max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8">
                <section aria-labelledby="predicas-heading">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <Radio className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 id="predicas-heading" className="text-xl font-black tracking-tight">
                                Predicas
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Transmisiones en vivo y archivo por fecha
                            </p>
                        </div>
                    </div>

                    {!hasAny ? (
                        <div className="text-center py-12">
                            <div className="bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                                <Radio className="size-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium">No hay predicas publicadas</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Las transmisiones en vivo y el archivo aparecerán aquí
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {sermons_live.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        En vivo
                                    </h2>
                                    <ul className="space-y-2 list-none p-0 m-0">
                                        {sermons_live.map((s) => (
                                            <li key={s.id}>
                                                <SermonCard sermon={s} variant="live" tenantSlug={tenant.slug} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {sermons_upcoming.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Calendar className="size-4" />
                                        Próximas transmisiones
                                    </h2>
                                    <ul className="space-y-2 list-none p-0 m-0">
                                        {sermons_upcoming.map((s) => (
                                            <li key={s.id}>
                                                <SermonCard sermon={s} variant="upcoming" tenantSlug={tenant.slug} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {sermons_by_date.map((group) => (
                                <div key={group.key}>
                                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                                        {group.label}
                                    </h2>
                                    <ul className="space-y-2 list-none p-0 m-0">
                                        {group.sermons.map((s) => (
                                            <li key={s.id}>
                                                <SermonCard sermon={s} variant="completed" tenantSlug={tenant.slug} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
