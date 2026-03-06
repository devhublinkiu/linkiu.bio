import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import type { Ticker } from '@/types/ticker';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import EpisodeCard from '@/Components/Tenant/Church/Public/EpisodeCard';
import FloatingAudioPlayer from '@/Components/Tenant/Church/Public/FloatingAudioPlayer';
import BannerSlider from '@/Components/Tenant/Gastronomy/Public/BannerSlider';
import PromotionalTicker from '@/Components/Tenant/Public/PromotionalTicker';
import { Carousel, PromoCard } from '@/Components/ui/promo-carousel';
import { Briefcase, Headphones, Banknote, Church, ChevronRight, HandHeart, BookOpen, Heart, Share2, Users, Mail, Phone, MessageCircle, Radio, Calendar, Quote } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface HomeSlider {
    id: number;
    name: string;
    image_url: string;
    desktop_image_url?: string;
    link_type: string;
    external_url?: string;
}

interface HomeService {
    id: number;
    name: string;
    description: string | null;
    schedule: string | null;
    service_type: string | null;
    image_url: string | null;
}

interface HomeDevotional {
    id: number;
    title: string;
    scripture_reference: string | null;
    date: string;
    cover_image: string | null;
    excerpt: string | null;
    blessing_count?: number;
    prayer_count?: number;
    share_count?: number;
}

interface PromoShort {
    id: number;
    name: string;
    description: string;
    short_embed_url: string;
    link_type: string;
    action_url: string;
}

interface HomeCollaborator {
    id: number;
    name: string;
    role: string | null;
    photo: string | null;
    bio: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
}

interface HomePodcastEpisode {
    id: number;
    title: string;
    audio_url: string | null;
    formatted_duration: string;
    created_at: string;
}

interface HomeSermon {
    id: number;
    youtube_video_id: string;
    title: string;
    thumbnail_url: string | null;
    status: string;
    live_start_at: string | null;
    embed_url: string;
    watch_url: string;
}

interface HomeTestimonial {
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
    tenant: { name: string; slug: string; logo_url?: string; store_description?: string; brand_colors?: TenantBrandColors };
    sliders: HomeSlider[];
    tickers: Ticker[];
    services?: HomeService[];
    devotionals?: HomeDevotional[];
    promo_shorts?: PromoShort[];
    collaborators?: HomeCollaborator[];
    podcast_page_title?: string;
    podcast_episode_of_the_day?: HomePodcastEpisode | null;
    sermons_live?: HomeSermon[];
    sermons_upcoming?: HomeSermon[];
    testimonials?: HomeTestimonial[];
}

export default function Home({ tenant, sliders, tickers, services = [], devotionals = [], promo_shorts = [], collaborators = [], podcast_page_title = 'Podcast', podcast_episode_of_the_day = null, sermons_live = [], sermons_upcoming = [], testimonials = [] }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';
    const [playerOpen, setPlayerOpen] = useState(false);

    const quickLinks = [
        { label: 'Servicios', href: route('tenant.public.services', tenant.slug), icon: Briefcase, description: 'Cultos, reuniones y actividades' },
        { label: 'Devocionales', href: route('tenant.public.devotionals', tenant.slug), icon: BookOpen, description: 'Reflexiones y palabra del día' },
        { label: podcast_page_title, href: route('tenant.public.podcast', tenant.slug), icon: Headphones, description: 'Mensajes y enseñanzas en audio' },
        { label: 'Predicas', href: route('tenant.public.sermons', tenant.slug), icon: Radio, description: 'Transmisiones en vivo y archivo' },
        { label: 'Testimonios', href: route('tenant.public.testimonials', tenant.slug), icon: Quote, description: 'Historias de fe y transformación' },
        { label: 'Donar', href: route('tenant.public.donations', tenant.slug), icon: Banknote, description: 'Apoya con tu ofrenda' },
    ];

    return (
        <PublicLayout
            bgColor={bg_color}
            renderFloatingBottom={
                playerOpen && podcast_episode_of_the_day ? (
                    <FloatingAudioPlayer
                        episodes={[podcast_episode_of_the_day]}
                        currentIndex={0}
                        onClose={() => setPlayerOpen(false)}
                        onIndexChange={() => {}}
                    />
                ) : null
            }
        >
            <Head title={tenant.name} />

            <div className="flex flex-col">
                <Header
                    tenantName={tenant.name}
                    description={tenant.store_description}
                    logoUrl={tenant.logo_url}
                    bgColor={bg_color}
                    textColor={brandColors.name_color ?? '#ffffff'}
                    descriptionColor={brandColors.description_color}
                />

                <PromotionalTicker tickers={tickers} />
            </div>

            <div className="flex-1 bg-gray-50 p-4 -mt-4 relative z-0 pb-20 flex flex-col gap-6">
                <BannerSlider sliders={sliders} tenantSlug={tenant.slug} />

                {(podcast_episode_of_the_day || podcast_page_title) && (
                    <section className="w-full" aria-labelledby="podcast-heading">
                        <div className="flex items-center justify-between mb-3">
                            <h2 id="podcast-heading" className="text-lg font-bold text-slate-900">
                                {podcast_page_title}
                            </h2>
                            <Link
                                href={route('tenant.public.podcast', tenant.slug)}
                                className="text-sm font-semibold text-primary flex items-center gap-0.5"
                            >
                                Ver todos
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                        <div>
                            {podcast_episode_of_the_day ? (
                                <EpisodeCard
                                    ep={podcast_episode_of_the_day}
                                    logoUrl={tenant.logo_url}
                                    bgColor={bg_color}
                                    onPlay={() => setPlayerOpen(true)}
                                />
                            ) : (
                                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                                        <Headphones className="size-7 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 text-sm">Próximamente: mensajes y enseñanzas en audio</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <section className="w-full" aria-labelledby="predicas-heading">
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
                                        <h3 className="font-semibold text-slate-900 line-clamp-2 leading-none">{sermon.title}</h3>
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

                {services.length > 0 && (
                    <section className="w-full" aria-labelledby="servicios-slider-heading">
                        <div className="flex items-center justify-between mb-3">
                            <h2 id="servicios-slider-heading" className="text-lg font-bold text-slate-900">
                                Nuestros servicios
                            </h2>
                            <Link
                                href={route('tenant.public.services', tenant.slug)}
                                className="text-sm font-semibold text-primary flex items-center gap-0.5"
                            >
                                Ver todos
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto snap-x snap-mandatory flex gap-3 pb-2 scrollbar-none">
                            {services.map((service) => (
                                <Link
                                    key={service.id}
                                    href={route('tenant.public.services', tenant.slug)}
                                    className="snap-center shrink-0 w-[180px] rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
                                >
                                    <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                                        {service.image_url ? (
                                            <img
                                                src={service.image_url}
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Church className="size-10 text-slate-300" />
                                            </div>
                                        )}
                                        {service.service_type && (
                                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                                                {service.service_type}
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-slate-900 line-clamp-2">{service.name}</h3>
                                        {service.schedule && (
                                            <p className="text-xs text-slate-500 line-clamp-1">{service.schedule}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <Link
                    href={route('tenant.public.appointments.request', tenant.slug)}
                    className="group relative block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                >
                    {/* Fondo con gradiente y patrón sutil */}
                    <div
                        className="relative min-h-[80px] px-2 py-2 flex flex-col justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${bg_color} 0%, ${bg_color}dd 50%, ${bg_color}99 100%)`,
                        }}
                    >
                        {/* Decoración: círculo suave de luz */}
                        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent" />


                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 border border-white/30 shadow-inner group-hover:bg-white/25 transition-colors">
                                    <HandHeart className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-white/90 text-sm font-medium">Estamos aquí para ti</p>
                                    <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                                        Solicita una cita
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="px-2 py-2 rounded-xl bg-white text-slate-800 font-bold text-sm shadow-md group-hover:bg-white/95 group-hover:shadow-lg transition-all inline-flex items-center gap-2">
                                    Pedir cita
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {devotionals.length > 0 && (
                    <section className="w-full" aria-labelledby="devocionales-slider-heading">
                        <div className="flex items-center justify-between mb-3">
                            <h2 id="devocionales-slider-heading" className="text-lg font-bold text-slate-900">
                                Devocionales
                            </h2>
                            <Link
                                href={route('tenant.public.devotionals', tenant.slug)}
                                className="text-sm font-semibold text-primary flex items-center gap-0.5"
                            >
                                Ver todos
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto snap-x snap-mandatory flex gap-3 pb-2 scrollbar-none">
                            {devotionals.map((d) => (
                                <Link
                                    key={d.id}
                                    href={route('tenant.public.devotionals.show', [tenant.slug, d.id])}
                                    className="snap-center shrink-0 w-[200px] rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
                                >
                                    <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                                        {d.cover_image ? (
                                            <img
                                                src={d.cover_image}
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BookOpen className="size-10 text-slate-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col flex-1">
                                        <h3 className="font-bold text-slate-900 line-clamp-2 leading-none">{d.title}</h3>
                                        <p className="text-xs text-slate-500 mt-2">
                                            {new Date(d.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        {(d.excerpt || d.scripture_reference) && (
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                {d.excerpt || d.scripture_reference}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                            <span className="inline-flex items-center gap-0.5" title="Fue de bendición">
                                                <Heart className="size-3.5" />
                                                {Number(d.blessing_count) || 0}
                                            </span>
                                            <span className="inline-flex items-center gap-0.5" title="Orando">
                                                <HandHeart className="size-3.5" />
                                                {Number(d.prayer_count) || 0}
                                            </span>
                                            <span className="inline-flex items-center gap-0.5" title="Compartidos">
                                                <Share2 className="size-3.5" />
                                                {Number(d.share_count) || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {Array.isArray(promo_shorts) && promo_shorts.length > 0 && (
                    <section className="w-full" aria-labelledby="shorts-heading">
                        <h2 id="shorts-heading" className="text-[140px] font-bold text-gray-200 px-4 flex items-center -mb-24">
                            Shorts
                        </h2>
                        <Carousel
                            items={promo_shorts.map((short, index) => (
                                <PromoCard
                                    key={short.id}
                                    card={{
                                        title: short.name,
                                        short_embed_url: short.short_embed_url,
                                        action_url: short.action_url,
                                        link_type: short.link_type,
                                    }}
                                    index={index}
                                />
                            ))}
                        />
                    </section>
                )}

                {Array.isArray(collaborators) && collaborators.length > 0 && (
                    <section className="w-full -mx-4" aria-labelledby="colaboradores-slider-heading">
                        <div className="flex items-center justify-between px-4 mb-3">
                            <h2 id="colaboradores-slider-heading" className="text-lg font-bold text-slate-900">
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
                                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-none">{c.name}</h3>
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

                {Array.isArray(testimonials) && testimonials.length > 0 && (
                    <section className="w-full -mx-4" aria-labelledby="testimonios-slider-heading">
                        <div className="flex items-center justify-between px-4 mb-3">
                            <h2 id="testimonios-slider-heading" className="text-lg font-bold text-slate-900">
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

                <section className="w-full px-2" aria-labelledby="accesos-heading">
                    <h2 id="accesos-heading" className="text-lg font-bold text-slate-900 mb-4">
                        Accesos rápidos
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {quickLinks.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    <item.icon className="w-6 h-6 text-slate-600" />
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <span className="font-bold text-slate-900 block">{item.label}</span>
                                    <span className="text-sm text-slate-500">{item.description}</span>
                                </div>
                                <span className="text-slate-400 text-sm shrink-0">Ir →</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
