import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    IconLink,
    IconBuildingStore,
    IconShoppingCart,
    IconCalendarEvent,
    IconToolsKitchen2,
    IconMapPin,
    IconBrandWhatsapp,
    IconVideo,
    IconCreditCard,
    IconPlug,
    IconChartBar,
    IconSpeakerphone,
} from '@tabler/icons-react';

/** 12 funciones en orden: valor central → operación → crecimiento */
const features = [
    {
        title: 'Un solo enlace',
        description: 'Tu catálogo, pedidos y contacto en un solo link. Lo compartes en redes, WhatsApp o donde quieras.',
        icon: <IconLink className="size-6" />,
    },
    {
        title: 'Para todo tipo de negocio',
        description: 'Restaurante, tienda, servicios o lo que tengas. La herramienta se adapta a ti.',
        icon: <IconBuildingStore className="size-6" />,
    },
    {
        title: 'Pedidos en línea',
        description: 'Los clientes te piden desde el enlace. Tú ves todo en un solo lugar, sin complicarte.',
        icon: <IconShoppingCart className="size-6" />,
    },
    {
        title: 'Reserva y turno',
        description: 'Mesas en el restaurante, citas en tu negocio o turnos. Se adapta a lo que ofreces.',
        icon: <IconCalendarEvent className="size-6" />,
    },
    {
        title: 'Caja y cocina',
        description: 'Para restaurantes: tomar pedidos, mandar a cocina o barra y llevar las mesas al día.',
        icon: <IconToolsKitchen2 className="size-6" />,
    },
    {
        title: 'Múltiples sucursales',
        description: 'Si tienes más de un local, cada uno puede tener su menú o catálogo y ver todo junto.',
        icon: <IconMapPin className="size-6" />,
    },
    {
        title: 'WhatsApp al instante',
        description: 'Cada pedido o reserva te llega al WhatsApp en el momento. No te pierdes nada.',
        icon: <IconBrandWhatsapp className="size-6" />,
    },
    {
        title: 'Shorts',
        description: 'Videos cortos en tu página. Muestra tu negocio, platos o promos en formato vertical, como en redes.',
        icon: <IconVideo className="size-6" />,
    },
    {
        title: 'LinkiuPay',
        description: 'Cobra y gestiona pagos desde tu enlace. Ideal para vender sin tener todo el stock en casa.',
        icon: <IconCreditCard className="size-6" />,
    },
    {
        title: 'Integraciones',
        description: 'Conecta con lo que ya usas. Tu enlace y tus herramientas trabajando juntas.',
        icon: <IconPlug className="size-6" />,
    },
    {
        title: 'LinkiuLab',
        description: 'Clics, visitas, sesiones y estadísticas. Todo lo que necesitas para entender y mejorar tus ventas.',
        icon: <IconChartBar className="size-6" />,
    },
    {
        title: 'Anuncios y promos',
        description: 'Tickers, avisos y banners en tu página. Destaca ofertas y novedades para vender más.',
        icon: <IconSpeakerphone className="size-6" />,
    },
];

function Feature({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) {
    return (
        <div
            className={cn(
                'flex flex-col relative group/feature min-w-0',
                'shrink-0 w-[85vw] max-w-[320px] snap-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50',
                'md:shrink-0 md:w-full md:min-w-0 md:max-w-none md:snap-align-none md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:py-10 md:px-10',
                'md:border-r md:border-slate-200 dark:md:border-slate-800',
                index % 4 === 0 && 'md:border-l md:border-slate-200 dark:md:border-slate-800',
                index < 8 && 'md:border-b md:border-slate-200 dark:md:border-slate-800'
            )}
        >
            {/* Barrita vertical en el borde izquierdo de la celda (solo desktop) */}
            <div
                className="absolute left-0 top-20 bottom-32 w-1 rounded-tr-full rounded-br-full bg-slate-300 dark:bg-slate-700 group-hover/feature:w-1.5 group-hover/feature:bg-slate-600 dark:group-hover/feature:bg-slate-500 transition-all duration-200 origin-left hidden md:block z-10"
                aria-hidden
            />
            {index < 8 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none rounded-xl md:rounded-none" />
            )}
            {index >= 8 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none rounded-xl md:rounded-none" />
            )}
            <div className="mb-4 relative z-10 text-slate-600 dark:text-slate-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10">
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-slate-800 dark:text-slate-100">
                    {title}
                </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs relative z-10 md:max-w-none">
                {description}
            </p>
        </div>
    );
}

const AUTO_ADVANCE_MS = 4500;

export function FeaturesSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = features.length;

    const goTo = (index: number) => {
        const i = ((index % total) + total) % total;
        setCurrentIndex(i);
        const el = scrollRef.current;
        if (!el) return;
        const child = el.children[i] as HTMLElement | undefined;
        if (child) {
            const left = child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2;
            el.scrollTo({ left, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onScroll = () => {
            const scrollLeft = el.scrollLeft;
            const children = el.children;
            let nearest = 0;
            let minDist = Infinity;
            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                const dist = Math.abs(child.offsetLeft - scrollLeft - (el.offsetWidth - child.offsetWidth) / 2);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = i;
                }
            }
            setCurrentIndex(nearest);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % total;
                const el = scrollRef.current;
                if (el) {
                    const child = el.children[next] as HTMLElement | undefined;
                    if (child) {
                        const left = child.offsetLeft - el.offsetWidth / 2 + child.offsetWidth / 2;
                        el.scrollTo({ left, behavior: 'smooth' });
                    }
                }
                return next;
            });
        }, AUTO_ADVANCE_MS);
        return () => clearInterval(id);
    }, [total]);

    return (
        <section id="funciones" className="relative z-10 md:-mt-16">
            <div className="px-6 md:mb-12 mb-2 text-center">
                <h2 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                    Funciones
                </h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Todo lo que necesitas para llevar tu negocio a un solo enlace.
                </p>
            </div>
            {/* Móvil: carrusel con flechas y auto-avance. Desktop: grid */}
            <div className="relative max-w-8xl mx-auto">
                {/* Flechas solo móvil */}
                <div className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 flex justify-between w-full pointer-events-none">
                    <button
                        type="button"
                        onClick={() => goTo(currentIndex - 1)}
                        className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo(currentIndex + 1)}
                        className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                </div>
                <div
                    ref={scrollRef}
                    className={cn(
                        'flex overflow-x-auto snap-x snap-mandatory gap-4 py-4 px-4 pb-6',
                        'md:flex-none md:grid md:grid-cols-2 md:overflow-visible md:gap-0 md:px-6 md:pb-4',
                        'lg:grid-cols-4 relative z-10'
                    )}
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {features.map((feature, index) => (
                        <Feature key={feature.title} {...feature} index={index} />
                    ))}
                </div>
            </div>
            <p className="md:hidden text-center text-xs text-slate-500 dark:text-slate-400 px-4 pb-2">
                Desliza o usa las flechas para ver más funciones
            </p>
        </section>
    );
}
