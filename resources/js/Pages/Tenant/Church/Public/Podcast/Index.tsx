import React, { useCallback, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import EpisodeCard from '@/Components/Tenant/Church/Public/EpisodeCard';
import FloatingAudioPlayer from '@/Components/Tenant/Church/Public/FloatingAudioPlayer';
import type { EpisodePublic } from '@/Components/Tenant/Church/Public/EpisodeCard';
import { Headphones } from 'lucide-react';
import SharedPagination from '@/Components/Shared/Pagination';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    pageTitle: string;
    episodeOfTheDay: EpisodePublic | null;
    episodes: {
        data: EpisodePublic[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function PodcastIndex({ tenant, pageTitle, episodeOfTheDay, episodes }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';
    const [playerIndex, setPlayerIndex] = useState<number | null>(null);

    const allEpisodes = episodeOfTheDay ? [episodeOfTheDay, ...episodes.data] : episodes.data;

    const openPlayer = useCallback((index: number) => {
        setPlayerIndex(index);
    }, []);

    return (
        <PublicLayout
            bgColor={bg_color}
            renderFloatingBottom={
                playerIndex !== null && allEpisodes.length > 0 ? (
                    <FloatingAudioPlayer
                        episodes={allEpisodes}
                        currentIndex={playerIndex}
                        onClose={() => setPlayerIndex(null)}
                        onIndexChange={setPlayerIndex}
                    />
                ) : null
            }
        >
            <Head title={`${pageTitle} - ${tenant.name}`} />

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
                <section aria-labelledby="podcast-heading">
                    <div className="flex items-center gap-3 mb-6">
                        <div>
                            <h1 id="podcast-heading" className="text-3xl font-black tracking-tight uppercase">
                                {pageTitle}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {!episodeOfTheDay && episodes.data.length === 0
                                    ? 'Mensajes y enseñanzas en audio'
                                    : `${(episodeOfTheDay ? 1 : 0) + episodes.total} ${(episodeOfTheDay ? 1 : 0) + episodes.total === 1 ? 'episodio' : 'episodios'}`
                                }
                            </p>
                        </div>
                    </div>

                    <section className="mt-8" aria-labelledby="del-dia-heading">
                        <h2 id="del-dia-heading" className="text-xl font-bold text-slate-900 mb-4">
                            {pageTitle} del día
                        </h2>
                        {episodeOfTheDay ? (
                            <EpisodeCard
                                ep={episodeOfTheDay}
                                logoUrl={tenant.logo_url}
                                bgColor={bg_color}
                                onPlay={() => openPlayer(0)}
                            />
                        ) : (
                            <div className="text-center py-8 rounded-2xl bg-slate-50 border border-slate-100">
                                <Headphones className="size-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm">No hay episodio del día aún</p>
                            </div>
                        )}
                    </section>

                    <section className="mt-10 pt-8 border-t border-slate-200" aria-labelledby="listado-heading">
                        <h2 id="listado-heading" className="text-xl font-bold text-slate-900 mb-4">
                            Listado de {pageTitle}
                        </h2>
                        {episodes.data.length === 0 ? (
                            <p className="text-slate-500 text-sm">No hay más episodios en el listado.</p>
                        ) : (
                            <>
                                <ul className="space-y-4 list-none p-0 m-0">
                                    {episodes.data.map((ep, i) => (
                                        <li key={ep.id}>
                                            <EpisodeCard
                                                ep={ep}
                                                logoUrl={tenant.logo_url}
                                                bgColor={bg_color}
                                                onPlay={() => openPlayer(episodeOfTheDay ? i + 1 : i)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                {episodes.last_page > 1 && (
                                    <div className="mt-6">
                                        <SharedPagination links={episodes.links} />
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </section>

                <p className="text-center mt-8">
                    <Link href={route('tenant.home', tenant.slug)} className="text-sm text-primary hover:underline">
                        ← Volver al inicio
                    </Link>
                </p>
            </div>
        </PublicLayout>
    );
}
