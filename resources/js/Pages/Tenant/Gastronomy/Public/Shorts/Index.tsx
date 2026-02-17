import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { PageProps } from '@/types';

const EMBED_PARAMS = '?autoplay=true&muted=false&loop=true&preload=true&controls=false&playsinline=true';
const AUTO_SLIDE_MS = 10000;

type SlideItem =
    | {
          type: 'location';
          location_id: number;
          location_name: string;
          short_embed_url: string | null;
      }
    | {
          type: 'promo';
          id: number;
          name: string;
          description: string | null;
          short_embed_url: string | null;
          link_type: string;
          action_url: string;
          location_name: string;
      };

interface Props {
    tenant: { name: string; slug: string; brand_colors?: { bg_color?: string } };
    items: SlideItem[];
    /** false = 0 o 1 sede → solo promos + botón "Ingresar a la tienda" */
    has_multiple_locations?: boolean;
}

const LINK_TYPE_LABEL: Record<string, string> = {
    category: 'Categoría',
    product: 'Producto',
    external: 'Enlace externo',
};

export default function ShortsIndex({ tenant, items, has_multiple_locations = false }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const slug = currentTenant?.slug ?? tenant?.slug;
    const active = items[currentIndex];

    const goPrev = () => setCurrentIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
    const goNext = () => setCurrentIndex((i) => (i >= items.length - 1 ? 0 : i + 1));

    useEffect(() => {
        if (items.length <= 1) return;
        const t = setInterval(() => {
            setCurrentIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
        }, AUTO_SLIDE_MS);
        return () => clearInterval(t);
    }, [items.length]);

    const enterLocation = (locationId: number) => {
        router.post(route('tenant.shorts.enter', { tenant: slug }), { location_id: locationId });
    };

    const handleVerMas = (actionUrl: string, linkType: string) => {
        if (!actionUrl || actionUrl === '#') return;
        if (linkType === 'external') {
            window.open(actionUrl, '_blank', 'noopener,noreferrer');
        } else {
            router.visit(actionUrl);
        }
    };

    if (!items.length) {
        const homeUrl = slug ? route('tenant.home', { tenant: slug }) : '#';
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-900 text-white p-4">
                <Head title={tenant.name} />
                <p className="text-center">No hay shorts disponibles.</p>
                {!has_multiple_locations && homeUrl !== '#' && (
                    <Link
                        href={homeUrl}
                        className="rounded-xl font-black text-lg px-6 py-3 bg-white text-black hover:bg-white/90"
                    >
                        Ingresar a la tienda
                    </Link>
                )}
            </div>
        );
    }

    const embedUrl = active?.short_embed_url;
    const isLocation = active?.type === 'location';
    const isPromo = active?.type === 'promo';

    return (
        <>
            <Head title={!has_multiple_locations ? `${tenant.name} - Promociones` : `${tenant.name} - Elige tu sede`} />

            <div className="min-h-screen w-full flex justify-center items-start pt-0 sm:pt-4 pb-0 sm:pb-4 relative overflow-hidden transition-colors duration-500">
                <div className="fixed inset-0 -z-30 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="fixed inset-0 -z-20 transition-colors duration-500 mix-blend-multiply opacity-80 bg-[#f0f2f5]" />
                <div className="fixed inset-0 -z-10 backdrop-blur-[100px] bg-white/10" />

                <div className="w-full max-w-[480px] h-screen min-h-[600px] max-h-[100vh] sm:h-[850px] sm:min-h-[700px] bg-black shadow-2xl md:rounded-[2rem] overflow-hidden flex flex-col relative border border-slate-200/60 mx-auto z-10">
                    {/* Video */}
                    {embedUrl ? (
                        <div className="absolute inset-0 z-0">
                            <iframe
                                key={currentIndex}
                                title={isLocation ? `Sede ${active.location_name}` : active.type === 'promo' ? active.name : ''}
                                src={`${embedUrl}${EMBED_PARAMS}`}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                    )}

                    {/* Indicadores */}
                    <div className="absolute top-6 left-0 right-0 flex justify-center gap-2 z-20 px-4">
                        {items.map((_, i) => (
                            <span
                                key={i}
                                className={`block h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                            />
                        ))}
                    </div>

                    {/* Overlay inferior */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-16 pb-8 px-5">
                        {/* Slide SEDE: solo texto sede + INGRESAR */}
                        {isLocation && active.type === 'location' && (
                            <>
                                <p className="text-xl font-black text-white uppercase tracking-wider mb-4 drop-shadow-lg">
                                    SEDE {active.location_name}
                                </p>
                                <Button
                                    onClick={() => enterLocation(active.location_id)}
                                    className="w-full h-14 rounded-xl font-black text-lg bg-white text-black hover:bg-white/90 shadow-lg"
                                >
                                    INGRESAR
                                </Button>
                            </>
                        )}

                        {/* Slide PROMO: título, descripción, badges, Ver más (+ Ingresar a la tienda si hay sede) */}
                        {isPromo && active.type === 'promo' && (
                            <>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1 drop-shadow-lg">
                                    {active.name}
                                </h2>
                                {active.description && (
                                    <p className="text-sm text-white/95 mb-3 line-clamp-2 drop-shadow">
                                        {active.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                        {LINK_TYPE_LABEL[active.link_type] ?? active.link_type}
                                    </Badge>
                                    {active.location_name && (
                                        <Badge variant="outline" className="bg-black/30 text-white border-white/40">
                                            {active.location_name}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => handleVerMas(active.action_url, active.link_type)}
                                        className="w-full h-14 rounded-xl font-black text-lg bg-white text-black hover:bg-white/90 shadow-lg"
                                    >
                                        {active.link_type === 'external' ? 'Ver enlace' : 'Ver más'}
                                    </Button>
                                    {!has_multiple_locations && slug && (
                                        <Link
                                            href={route('tenant.home', { tenant: slug })}
                                            className="w-full h-12 rounded-xl font-bold text-base bg-white/20 text-white border border-white/40 hover:bg-white/30 flex items-center justify-center"
                                        >
                                            Ingresar a la tienda
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Flechas */}
                    <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-xl flex items-center justify-center text-black"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 hover:bg-white shadow-xl flex items-center justify-center text-black"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-7 h-7" />
                    </button>
                </div>
            </div>
        </>
    );
}
