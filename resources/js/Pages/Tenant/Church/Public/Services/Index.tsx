import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Card, CardContent } from '@/Components/ui/card';
import { Church, Calendar, Clock, MapPin, Users, User, Phone, ExternalLink, LayoutGrid, Share2, Radio, ChevronRight, Mail, MessageCircle, Quote, Heart, HandHeart } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface ChurchServicePublic {
    id: number;
    name: string;
    description: string | null;
    audience: string | null;
    service_type: string | null;
    schedule: string | null;
    frequency: string | null;
    duration: string | null;
    location: string | null;
    modality: string | null;
    image_url: string | null;
    leader: string | null;
    contact_info: string | null;
    external_url: string | null;
}

interface SermonPublic {
    id: number;
    title: string;
    thumbnail_url: string | null;
    status: string;
    live_start_at: string | null;
    embed_url: string;
    watch_url: string;
}

interface CollaboratorPublic {
    id: number;
    name: string;
    role: string | null;
    photo: string | null;
    bio: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
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
    blessing_count: number;
    prayer_count: number;
    amen_count: number;
    share_count: number;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    services: ChurchServicePublic[];
    sermons_live?: SermonPublic[];
    sermons_upcoming?: SermonPublic[];
    collaborators?: CollaboratorPublic[];
    testimonials?: TestimonialPublic[];
}

function ServiceCard({ service }: { service: ChurchServicePublic }) {
    const hasMeta =
        service.schedule ||
        service.frequency ||
        service.duration ||
        service.location ||
        service.modality;

    return (
        <Card className="overflow-hidden border border-slate-200 shadow-sm rounded-xl bg-white relative">
            <div className="flex flex-col gap-3 p-0">
                {/* Miniatura compacta */}
                <div className="w-200 h-120 shrink-0 rounded-lg bg-slate-100 overflow-hidden relative">
                    {service.image_url ? (
                        <img
                            src={service.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Church className="size-8 text-slate-300" />
                        </div>
                    )}
                    {service.service_type && (
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                            {service.service_type}
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5 px-3 pb-3">
                    <h3 className="font-bold text-base text-slate-900 leading-tight line-clamp-2">{service.name}</h3>
                    {service.description && (
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{service.description}</p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-1">
                    {service.schedule && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="size-3.5 shrink-0" />
                            <span className="truncate">{service.schedule}</span>
                        </p>
                    )}
                    {service.modality && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <LayoutGrid className="size-3.5 shrink-0" />
                            <span className="truncate">{service.modality}</span>
                        </p>
                    )}
                    {service.frequency && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Share2 className="size-3.5 shrink-0" />
                            <span className="truncate">{service.frequency}</span>
                        </p>
                    )}
                    {service.duration && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="size-3.5 shrink-0" />
                            <span className="truncate">{service.duration}</span>
                        </p>
                    )}
                    </div>
                </div>
            </div>

            {(hasMeta || service.audience || service.leader || service.contact_info || service.external_url) && (
                <CardContent className="flex flex-col-wrap gap-2 px-3 py-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
                    {service.audience && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Users className="size-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{service.audience}</span>
                        </div>
                    )}
                    {service.location && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="size-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{service.location}</span>
                        </div>
                    )}
                    {service.leader && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <User className="size-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{service.leader}</span>
                        </div>
                    )}
                    {service.contact_info && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone className="size-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{service.contact_info}</span>
                        </div>
                    )}
                    {service.external_url && (
                        <a
                            href={service.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            <ExternalLink className="size-3.5" />
                            Ver más
                        </a>
                    )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

export default function ServicesIndex({ tenant, services, sermons_live = [], sermons_upcoming = [], collaborators = [], testimonials = [] }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Servicios - ${tenant.name}`} />

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
                <section aria-labelledby="servicios-heading">
                    <div className="flex items-center gap-3 mb-6">
                        <div>
                            <h1 id="servicios-heading" className="text-xl font-black tracking-tight">
                                Nuestros servicios
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {services.length === 0
                                    ? 'Cultos, reuniones y actividades'
                                    : `${services.length} ${services.length === 1 ? 'servicio' : 'servicios'}`
                                }
                            </p>
                        </div>
                    </div>

                    <div className="py-4">
                    {services.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="bg-slate-100 rounded-full size-12 mx-auto mb-3 flex items-center justify-center">
                                <Church className="size-6 text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium text-sm">No hay servicios publicados</p>
                            <p className="text-xs text-muted-foreground mt-1">Próximamente verás aquí nuestros cultos y reuniones</p>
                        </div>
                    ) : (
                        <ul className="space-y-2 list-none p-0 m-0">
                            {services.map((service) => (
                                <li key={service.id}>
                                    <ServiceCard service={service} />
                                </li>
                            ))}
                        </ul>
                    )}
                    </div>
                </section>

                <section className="w-full mt-8" aria-labelledby="predicas-heading">
                    <div className="flex items-center justify-between mb-3">
                        <h2 id="predicas-heading" className="text-lg font-bold text-slate-900">
                            {sermons_live.length > 0 ? 'Predica en vivo' : sermons_upcoming.length > 0 ? 'Próximas transmisiones' : 'Predicas en vivo'}
                        </h2>
                        <Link
                            href={route('tenant.public.sermons', tenant.slug)}
                            className="text-sm font-semibold text-primary flex items-center gap-0.5"
                        >
                            Ver todas
                            <ChevronRight className="size-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {sermons_live.length > 0 ? (
                            sermons_live.slice(0, 2).map((sermon) => (
                                <Link
                                    key={sermon.id}
                                    href={route('tenant.public.sermons.show', [tenant.slug, sermon.id])}
                                    className="flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                                >
                                    <div className="relative w-24 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                        {sermon.thumbnail_url ? (
                                            <img src={sermon.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Radio className="size-6 text-slate-400" />
                                            </div>
                                        )}
                                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                                            EN VIVO
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                        <h3 className="font-semibold text-slate-900 line-clamp-2">{sermon.title}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                            <Radio className="size-3.5" />
                                            Transmisión en vivo
                                        </p>
                                    </div>
                                    <ChevronRight className="size-5 text-slate-400 shrink-0 self-center" />
                                </Link>
                            ))
                        ) : sermons_upcoming.length > 0 ? (
                            sermons_upcoming.slice(0, 2).map((sermon) => (
                                <Link
                                    key={sermon.id}
                                    href={route('tenant.public.sermons.show', [tenant.slug, sermon.id])}
                                    className="flex gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                                >
                                    <div className="relative w-24 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                        {sermon.thumbnail_url ? (
                                            <img src={sermon.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Calendar className="size-6 text-slate-400" />
                                            </div>
                                        )}
                                        {sermon.live_start_at && (
                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-700 text-white">
                                                {new Date(sermon.live_start_at).toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                        <h3 className="font-semibold text-slate-900 line-clamp-2">{sermon.title}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                            <Calendar className="size-3.5" />
                                            Próxima transmisión
                                        </p>
                                    </div>
                                    <ChevronRight className="size-5 text-slate-400 shrink-0 self-center" />
                                </Link>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                                    <Radio className="size-7 text-slate-400" />
                                </div>
                                <p className="text-slate-500 text-sm">No hay transmisiones en vivo ni programadas por ahora</p>
                            </div>
                        )}
                    </div>
                </section>

                {collaborators.length > 0 && (
                    <section className="w-full mt-8 -mx-4" aria-labelledby="colaboradores-heading">
                        <div className="flex items-center justify-between px-4 mb-3">
                            <h2 id="colaboradores-heading" className="text-lg font-bold text-slate-900">
                                Nuestro equipo
                            </h2>
                            <Link
                                href={route('tenant.public.team', tenant.slug)}
                                className="text-sm font-semibold text-primary flex items-center gap-0.5"
                            >
                                Ver todos
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 px-4 pb-2 scrollbar-none">
                            {collaborators.map((c) => {
                                const hasEmail = !!c.email?.trim();
                                const hasPhone = !!c.phone?.trim();
                                const hasWhatsApp = !!c.whatsapp?.trim();
                                const hasContact = hasEmail || hasPhone || hasWhatsApp;
                                return (
                                    <Link
                                        key={c.id}
                                        href={route('tenant.public.team.show', [tenant.slug, c.id])}
                                        className="snap-center shrink-0 w-[172px] rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-200 transition-all flex flex-col items-center text-center p-4"
                                    >
                                        <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow mb-2">
                                            {c.photo ? (
                                                <img src={c.photo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Users className="size-8 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2">{c.name}</h3>
                                        {c.role && (
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.role}</p>
                                        )}
                                        {hasContact && (
                                            <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                                                {hasEmail && (
                                                    <span className="inline-flex p-1.5 rounded-lg bg-slate-100 text-slate-500" title="Correo">
                                                        <Mail className="size-3.5" />
                                                    </span>
                                                )}
                                                {hasPhone && (
                                                    <span className="inline-flex p-1.5 rounded-lg bg-slate-100 text-slate-500" title="Teléfono">
                                                        <Phone className="size-3.5" />
                                                    </span>
                                                )}
                                                {hasWhatsApp && (
                                                    <span className="inline-flex p-1.5 rounded-lg bg-[#25D366]/15 text-[#25D366]" title="WhatsApp">
                                                        <MessageCircle className="size-3.5" />
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {testimonials.length > 0 && (
                    <section className="w-full mt-8 -mx-4" aria-labelledby="testimonios-heading">
                        <div className="flex items-center justify-between px-4 mb-3">
                            <h2 id="testimonios-heading" className="text-lg font-bold text-slate-900">
                                Testimonios
                            </h2>
                            <Link
                                href={route('tenant.public.testimonials', tenant.slug)}
                                className="text-sm font-semibold text-primary flex items-center gap-0.5"
                            >
                                Ver todos
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 px-4 pb-2 scrollbar-none">
                            {testimonials.map((t) => (
                                <Link
                                    key={t.id}
                                    href={route('tenant.public.testimonials.show', [tenant.slug, t.id])}
                                    className="snap-center shrink-0 w-[280px] rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-200 transition-all flex flex-col"
                                >
                                    <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                                        {t.image_url ? (
                                            <img src={t.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Quote className="size-10 text-slate-300" />
                                            </div>
                                        )}
                                        {t.category && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium bg-white/90 text-slate-700">
                                                {t.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-slate-900 line-clamp-2">{t.title}</h3>
                                        {(t.short_quote || t.author) && (
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                {t.short_quote || (t.author ? `— ${t.author}` : '')}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                            <span className="inline-flex items-center gap-0.5" title="Bendición">
                                                <Heart className="size-3.5" />
                                                {Number(t.blessing_count) || 0}
                                            </span>
                                            <span className="inline-flex items-center gap-0.5" title="Oración">
                                                <HandHeart className="size-3.5" />
                                                {Number(t.prayer_count) || 0}
                                            </span>
                                            <span className="inline-flex items-center gap-0.5" title="Amén">
                                                <Quote className="size-3.5" />
                                                {Number(t.amen_count) || 0}
                                            </span>
                                            <span className="inline-flex items-center gap-0.5" title="Compartidos">
                                                <Share2 className="size-3.5" />
                                                {Number(t.share_count) || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}
