import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Calendar, Copy, ExternalLink, HandHeart, Heart, Mail, Share2, User } from 'lucide-react';
import { toast } from 'sonner';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface DevotionalShow {
    id: number;
    title: string;
    scripture_reference: string | null;
    scripture_text: string | null;
    body: string;
    prayer: string | null;
    author: string | null;
    date: string;
    reflection_question: string | null;
    cover_image: string | null;
    video_url: string | null;
    external_link: string | null;
    excerpt: string | null;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    devotional: DevotionalShow;
    blessing_count?: number;
    prayer_count?: number;
    already_blessing?: boolean;
    already_prayer?: boolean;
}

function getVideoEmbedUrl(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    const u = url.trim();
    const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
}

function formatDate(d: string) {
    return new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Detecta si el body parece HTML (editor rico). */
function isHtml(html: string): boolean {
    if (!html || typeof html !== 'string') return false;
    const t = html.trim();
    return t.startsWith('<') && (t.includes('</p>') || t.includes('<p>') || t.includes('<br') || t.includes('<strong') || t.includes('<em'));
}

const VISITOR_ID_KEY = 'devotional_visitor_id';

function getVisitorId(): string {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
        id = crypto.randomUUID?.() ?? `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
}

const COOKIE_NAME = 'devotional_visitor_id';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export default function DevotionalShow({ tenant, devotional, blessing_count: initialBlessingCount, prayer_count: initialPrayerCount, already_blessing: initialAlreadyBlessing, already_prayer: initialAlreadyPrayer }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';
    const embedUrl = devotional.video_url ? getVideoEmbedUrl(devotional.video_url) : null;
    const bodyIsHtml = isHtml(devotional.body);

    const visitorId = useMemo(getVisitorId, []);

    const [blessingCount, setBlessingCount] = useState(() => Number(initialBlessingCount) || 0);
    const [prayerCount, setPrayerCount] = useState(() => Number(initialPrayerCount) || 0);
    const [alreadyBlessing, setAlreadyBlessing] = useState(!!initialAlreadyBlessing);
    const [alreadyPrayer, setAlreadyPrayer] = useState(!!initialAlreadyPrayer);
    const [loadingBlessing, setLoadingBlessing] = useState(false);
    const [loadingPrayer, setLoadingPrayer] = useState(false);

    // Cookie para que al recargar el servidor sepa si ya reaccionaste
    useEffect(() => {
        if (!visitorId || typeof document === 'undefined') return;
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(visitorId)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }, [visitorId]);

    // Sincronizar estado si el servidor no envió already_* (p. ej. primera visita)
    useEffect(() => {
        if (!visitorId || initialAlreadyBlessing !== undefined || initialAlreadyPrayer !== undefined) return;
        const baseUrl = route('tenant.public.devotionals.reactions-status', [tenant.slug, devotional.id]);
        const url = `${baseUrl}?visitor_id=${encodeURIComponent(visitorId)}`;
        fetch(url)
            .then((r) => r.json())
            .then((data) => {
                setAlreadyBlessing(!!data.already_blessing);
                setAlreadyPrayer(!!data.already_prayer);
            })
            .catch(() => {});
    }, [tenant.slug, devotional.id, visitorId, initialAlreadyBlessing, initialAlreadyPrayer]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `${devotional.title} - ${tenant.name}`;

    function getCsrfHeadersAndBody(): { headers: Record<string, string>; bodyToken: string } {
        const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        const bodyToken = meta?.content ?? '';
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        const cookieToken = match ? decodeURIComponent(match[1].trim()) : '';
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        };
        if (cookieToken) headers['X-XSRF-TOKEN'] = cookieToken;
        if (bodyToken) headers['X-CSRF-TOKEN'] = bodyToken;
        return { headers, bodyToken };
    }

    async function handleReaction(
        url: string,
        onSuccess: (data: { blessing_count?: number; prayer_count?: number; already_blessing?: boolean; already_prayer?: boolean }) => void
    ) {
        if (!visitorId) {
            toast.error('Recarga la página e intenta de nuevo.');
            return;
        }
        const { headers, bodyToken } = getCsrfHeadersAndBody();
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ visitor_id: visitorId, _token: bodyToken }),
            credentials: 'same-origin',
        });
        const text = await res.text();
        let data: Record<string, unknown> = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            // ignore
        }
        if (!res.ok) {
            if (res.status === 419) {
                toast.error('Sesión expirada. Recarga la página e intenta de nuevo.');
                return;
            }
            const msg = typeof data.message === 'string' ? data.message : data.error ?? 'No se pudo registrar';
            toast.error(String(msg));
            return;
        }
        onSuccess(data as { blessing_count?: number; prayer_count?: number; already_blessing?: boolean; already_prayer?: boolean });
    }

    const handleBlessing = () => {
        if (alreadyBlessing || loadingBlessing) return;
        setLoadingBlessing(true);
        handleReaction(route('tenant.public.devotionals.blessing', [tenant.slug, devotional.id]), (data) => {
            const bc = typeof data.blessing_count === 'number' ? data.blessing_count : undefined;
            const pc = typeof data.prayer_count === 'number' ? data.prayer_count : undefined;
            setBlessingCount((prev) => (typeof bc === 'number' && Number.isFinite(bc) ? bc : prev + 1));
            setPrayerCount((prev) => (typeof pc === 'number' && Number.isFinite(pc) ? pc : prev));
            setAlreadyBlessing(true);
            if (typeof data.already_prayer === 'boolean') setAlreadyPrayer(data.already_prayer);
            toast.success('Gracias, ¡que sea de bendición!');
        }).catch(() => toast.error('No se pudo registrar')).finally(() => setLoadingBlessing(false));
    };

    const handlePrayer = () => {
        if (alreadyPrayer || loadingPrayer) return;
        setLoadingPrayer(true);
        handleReaction(route('tenant.public.devotionals.prayer', [tenant.slug, devotional.id]), (data) => {
            const bc = typeof data.blessing_count === 'number' ? data.blessing_count : undefined;
            const pc = typeof data.prayer_count === 'number' ? data.prayer_count : undefined;
            setBlessingCount((prev) => (typeof bc === 'number' && Number.isFinite(bc) ? bc : prev));
            setPrayerCount((prev) => (typeof pc === 'number' && Number.isFinite(pc) ? pc : prev + 1));
            setAlreadyPrayer(true);
            if (typeof data.already_blessing === 'boolean') setAlreadyBlessing(data.already_blessing);
            toast.success('Gracias por orar');
        }).catch(() => toast.error('No se pudo registrar')).finally(() => setLoadingPrayer(false));
    };

    const registerShare = () => {
        const { headers } = getCsrfHeadersAndBody();
        fetch(route('tenant.public.devotionals.share', [tenant.slug, devotional.id]), {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
            credentials: 'same-origin',
        }).catch(() => {});
    };

    const copyLink = () => {
        registerShare();
        navigator.clipboard.writeText(shareUrl).then(() => toast.success('Enlace copiado')).catch(() => toast.error('No se pudo copiar'));
    };

    const shareWhatsApp = () => {
        registerShare();
        const u = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(u, '_blank');
    };

    const shareEmail = () => {
        registerShare();
        const u = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
        window.location.href = u;
    };

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`${devotional.title} - Devocionales - ${tenant.name}`} />

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

            <div className="max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-6">
                <Link
                    href={route('tenant.public.devotionals', tenant.slug)}
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 mb-4"
                >
                    ← Volver a Devocionales
                </Link>

                <article className="overflow-hidden">
                    {devotional.cover_image && (
                        <div className="w-full aspect-[1200/630] max-h-56 bg-slate-100 relative overflow-hidden rounded-2xl mb-6">
                            <img
                                src={devotional.cover_image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Título: más grande (3xl/4xl) */}
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            {devotional.title}
                        </h1>

                        {/* Fecha y autor en dos columnas */}
                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="size-4 shrink-0" />
                                {formatDate(devotional.date)}
                            </span>
                            {devotional.author && (
                                <span className="flex items-center gap-1.5">
                                    <User className="size-4 shrink-0" />
                                    {devotional.author}
                                </span>
                            )}
                        </div>

                        {/* Referencia bíblica: sin card, estilo más bíblico */}
                        {devotional.scripture_reference && (
                            <div className="border-l-4 border-amber-600/80 pl-4 py-2 space-y-1">
                                <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
                                    {devotional.scripture_reference}
                                </p>
                                {devotional.scripture_text && (
                                    <p className="text-slate-700 leading-relaxed italic text-[15px]">
                                        &ldquo;{devotional.scripture_text}&rdquo;
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Reflexión / mensaje: justificado; soporta HTML si viene del editor */}
                        <div className="space-y-2">
                            {bodyIsHtml ? (
                                <div
                                    className="prose prose-slate prose-sm max-w-none text-justify leading-relaxed text-slate-700 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_img]:rounded-lg [&_a]:text-primary [&_a]:underline"
                                    dangerouslySetInnerHTML={{ __html: devotional.body }}
                                />
                            ) : (
                                <p className="text-slate-700 text-justify leading-relaxed whitespace-pre-wrap">
                                    {devotional.body}
                                </p>
                            )}
                        </div>

                        {/* Pregunta de reflexión: diseño mejorado, sin card rígida */}
                        {devotional.reflection_question && (
                            <div className="py-4 px-0 border-t border-b border-slate-200">
                                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                                    Pregunta de reflexión
                                </p>
                                <p className="text-slate-800 font-medium leading-relaxed">
                                    {devotional.reflection_question}
                                </p>
                            </div>
                        )}

                        {/* Oración: diseño mejorado */}
                        {devotional.prayer && (
                            <div className="py-4 px-0">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Oración
                                </p>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap italic">
                                    {devotional.prayer}
                                </p>
                            </div>
                        )}

                        {/* Video */}
                        {embedUrl && (
                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                                <div className="aspect-video w-full">
                                    <iframe
                                        src={embedUrl}
                                        title="Video del devocional"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}

                        {/* Enlace externo: botón mejorado */}
                        {devotional.external_link && (
                            <a
                                href={devotional.external_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 active:scale-[0.99] transition-colors shadow-md"
                            >
                                <ExternalLink className="size-4 shrink-0" />
                                Ver artículo o recurso externo
                            </a>
                        )}

                        {/* Interacción: Fue de bendición, Orando (2 columnas ancho completo) */}
                        <div className="pt-8 mt-8 border-t border-slate-200 space-y-5">
                            <p className="text-sm font-semibold text-slate-600">
                                ¿Te bendijo este devocional?
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleBlessing}
                                    disabled={alreadyBlessing || loadingBlessing}
                                    className={`w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                                        alreadyBlessing
                                            ? 'bg-emerald-500 text-white border-2 border-emerald-600 cursor-default'
                                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]'
                                    }`}
                                >
                                    <Heart className={`size-5 shrink-0 ${alreadyBlessing ? 'fill-current' : ''}`} />
                                    <span className="truncate">Fue de bendición</span>
                                    <span className="min-w-[1.25rem] inline-flex justify-center rounded-full bg-black/10 px-1.5 py-0.5 text-xs font-bold tabular-nums shrink-0">
                                        {Number.isFinite(blessingCount) ? blessingCount : 0}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrayer}
                                    disabled={alreadyPrayer || loadingPrayer}
                                    className={`w-full inline-flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                                        alreadyPrayer
                                            ? 'bg-amber-500 text-white border-2 border-amber-600 cursor-default'
                                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md active:scale-[0.98]'
                                    }`}
                                >
                                    <HandHeart className="size-5 shrink-0" />
                                    <span className="truncate">Orando</span>
                                    <span className="min-w-[1.25rem] inline-flex justify-center rounded-full bg-black/10 px-1.5 py-0.5 text-xs font-bold tabular-nums shrink-0">
                                        {Number.isFinite(prayerCount) ? prayerCount : 0}
                                    </span>
                                </button>
                            </div>

                            {/* Compartir: diseño mejorado */}
                            <div className="pt-5 border-t border-slate-100">
                                <p className="text-sm font-semibold text-slate-600 mb-3">
                                    Compartir este devocional
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={shareWhatsApp}
                                        className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                    >
                                        <Share2 className="size-5 shrink-0" />
                                        <span className="text-xs font-semibold">WhatsApp</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={copyLink}
                                        className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors active:scale-[0.98]"
                                    >
                                        <Copy className="size-5 shrink-0" />
                                        <span className="text-xs font-semibold">Copiar</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={shareEmail}
                                        className="flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors active:scale-[0.98]"
                                    >
                                        <Mail className="size-5 shrink-0" />
                                        <span className="text-xs font-semibold">Correo</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </PublicLayout>
    );
}
