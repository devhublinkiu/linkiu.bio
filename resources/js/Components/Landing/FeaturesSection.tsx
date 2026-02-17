import { cn } from '@/lib/utils';
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
                'flex flex-col py-10 relative group/feature lg:border-r border-slate-200 dark:border-slate-800',
                index % 4 === 0 && 'lg:border-l border-slate-200 dark:border-slate-800',
                index < 8 && 'lg:border-b border-slate-200 dark:border-slate-800'
            )}
        >
            {index < 8 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none" />
            )}
            {index >= 8 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-slate-100 dark:from-slate-800/50 to-transparent pointer-events-none" />
            )}
            <div className="mb-4 relative z-10 px-10 text-slate-600 dark:text-slate-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-slate-300 dark:bg-slate-700 group-hover/feature:bg-slate-600 dark:group-hover/feature:bg-slate-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-slate-800 dark:text-slate-100">
                    {title}
                </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
}

export function FeaturesSection() {
    return (
        <section id="funciones" className="relative z-10 py-4">
            <div className="px-6 mb-12 text-center">
                <h2 className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                    Funciones
                </h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Todo lo que necesitas para llevar tu negocio a un solo enlace.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-4 max-w-7xl mx-auto">
                {features.map((feature, index) => (
                    <Feature key={feature.title} {...feature} index={index} />
                ))}
            </div>
        </section>
    );
}
