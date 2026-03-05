import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Quote, ChevronRight, User, Play } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface TestimonialPublic {
    id: number;
    title: string;
    short_quote: string | null;
    author: string | null;
    category: string | null;
    image_url: string | null;
    video_url: string | null;
    embed_url: string | null;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    testimonials: TestimonialPublic[];
}

export default function TestimonialsIndex({ tenant, testimonials }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Testimonios - ${tenant.name}`} />

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
                <section aria-labelledby="testimonios-heading">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <Quote className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 id="testimonios-heading" className="text-xl font-black tracking-tight">
                                Testimonios
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Lo que Dios está haciendo en la vida de las personas
                            </p>
                        </div>
                    </div>

                    {testimonials.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                                <Quote className="size-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium">No hay testimonios publicados</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Próximamente verás aquí historias de fe y transformación
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-3 list-none p-0 m-0">
                            {testimonials.map((t) => (
                                <li key={t.id}>
                                    <Link
                                        href={route('tenant.public.testimonials.show', [tenant.slug, t.id])}
                                        className="flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                                    >
                                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                            {t.image_url ? (
                                                <img src={t.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Quote className="size-8 text-slate-400" />
                                                </div>
                                            )}
                                            {t.video_url && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Play className="size-6 text-white drop-shadow" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                                            <h2 className="font-semibold text-slate-900 line-clamp-2 text-sm">{t.title}</h2>
                                            {(t.short_quote || t.author) && (
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                    {t.short_quote || (t.author ? `— ${t.author}` : '')}
                                                </p>
                                            )}
                                            {t.category && (
                                                <span className="text-[10px] font-medium text-primary mt-1">{t.category}</span>
                                            )}
                                        </div>
                                        <ChevronRight className="size-5 text-slate-400 shrink-0 self-center" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </PublicLayout>
    );
}
