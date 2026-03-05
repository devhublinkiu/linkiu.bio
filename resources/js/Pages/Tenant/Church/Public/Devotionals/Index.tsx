import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { BookOpen, Calendar, Heart, HandHeart, Share2 } from 'lucide-react';
import SharedPagination from '@/Components/Shared/Pagination';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface DevotionalPublic {
    id: number;
    title: string;
    scripture_reference: string | null;
    date: string;
    cover_image: string | null;
    excerpt: string | null;
    author: string | null;
    blessing_count?: number;
    prayer_count?: number;
    share_count?: number;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    devotionals: {
        data: DevotionalPublic[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DevotionalCard({
    tenantSlug,
    devotional,
}: {
    tenantSlug: string;
    devotional: DevotionalPublic;
}) {
    return (
        <Link
            href={route('tenant.public.devotionals.show', [tenantSlug, devotional.id])}
            className="block rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
        >
            <div className="w-full h-44 bg-slate-100 relative overflow-hidden">
                {devotional.cover_image ? (
                    <img
                        src={devotional.cover_image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="size-12 text-slate-300" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-slate-900 line-clamp-2 text-lg">{devotional.title}</h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatDate(devotional.date)}
                </p>
                {devotional.scripture_reference && (
                    <p className="text-sm text-primary font-medium mt-1 line-clamp-1">
                        {devotional.scripture_reference}
                    </p>
                )}
                {(devotional.excerpt || devotional.author) && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {devotional.excerpt || (devotional.author ? `Por ${devotional.author}` : null)}
                    </p>
                )}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1" title="Fue de bendición">
                        <Heart className="size-3.5" />
                        {Number(devotional.blessing_count) || 0}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Orando">
                        <HandHeart className="size-3.5" />
                        {Number(devotional.prayer_count) || 0}
                    </span>
                    <span className="inline-flex items-center gap-1" title="Compartidos">
                        <Share2 className="size-3.5" />
                        {Number(devotional.share_count) || 0}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function DevotionalsIndex({ tenant, devotionals }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Devocionales - ${tenant.name}`} />

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
                <section aria-labelledby="devocionales-heading">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <BookOpen className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 id="devocionales-heading" className="text-xl font-black tracking-tight">
                                Devocionales
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {devotionals.total === 0
                                    ? 'Reflexiones y palabra del día'
                                    : `${devotionals.total} ${devotionals.total === 1 ? 'devocional' : 'devocionales'}`
                                }
                            </p>
                        </div>
                    </div>

                    {devotionals.data.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                                <BookOpen className="size-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium">No hay devocionales publicados</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Próximamente verás aquí reflexiones y palabra del día
                            </p>
                        </div>
                    ) : (
                        <>
                            <ul className="space-y-4 list-none p-0 m-0">
                                {devotionals.data.map((d) => (
                                    <li key={d.id}>
                                        <DevotionalCard tenantSlug={tenant.slug} devotional={d} />
                                    </li>
                                ))}
                            </ul>
                            {devotionals.last_page > 1 && (
                                <div className="mt-6">
                                    <SharedPagination links={devotionals.links} />
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
