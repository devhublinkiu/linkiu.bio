import type { LucideIcon } from 'lucide-react';
import {
    BadgeCheck,
    BookOpen,
    CalendarCheck,
    ChefHat,
    Clock,
    Headphones,
    Heart,
    Leaf,
    Lock,
    MapPin,
    MessageCircleMore,
    PackageSearch,
    RadioTower,
    RefreshCcw,
    ShieldCheck,
    Trophy,
    Truck,
    UserRoundCheck,
    Users,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

/** Alineado a Figma `benefits_*_linkiu` (nodo 256:1361). */
export type BenefitsVertical = 'ecommerce' | 'church' | 'servicios' | 'gastronomy' | 'dropshipping';

type BenefitItem = {
    icon: LucideIcon;
    boxClass: string;
    iconClass: string;
    line1: string;
    line2: string;
};

const COLUMN_BOX: [string, string][] = [
    ['bg-emerald-100', 'text-emerald-900'],
    ['bg-orange-100', 'text-orange-800'],
    ['bg-red-100', 'text-red-700'],
    ['bg-blue-100', 'text-blue-800'],
];

const BENEFITS_BY_VERTICAL: Record<BenefitsVertical, [LucideIcon, LucideIcon, LucideIcon, LucideIcon]> = {
    ecommerce: [ShieldCheck, Headphones, Truck, BadgeCheck],
    church: [Heart, RadioTower, Users, BookOpen],
    servicios: [UserRoundCheck, MessageCircleMore, CalendarCheck, Trophy],
    gastronomy: [Leaf, Clock, MapPin, ChefHat],
    dropshipping: [Lock, Truck, PackageSearch, RefreshCcw],
};

const LABELS_BY_VERTICAL: Record<BenefitsVertical, [string, string][]> = {
    ecommerce: [
        ['Pagos', 'seguros'],
        ['Atención', '24/7'],
        ['Envíos', 'nacionales'],
        ['Garantías', 'certificadas'],
    ],
    church: [
        ['Donaciones', 'seguras'],
        ['Transmisiones', 'en vivo'],
        ['Comunidad', 'activa'],
        ['Devocionales', 'y testimonios'],
    ],
    servicios: [
        ['Profesionales', 'verificados'],
        ['Soporte', 'inmediato'],
        ['Agenda', 'online'],
        ['Calidad', 'garantizada'],
    ],
    gastronomy: [
        ['Ingredientes', 'frescos'],
        ['Pedidos', 'rápidos'],
        ['Envío', 'local'],
        ['Sabor', 'auténtico'],
    ],
    dropshipping: [
        ['Pagos', 'seguros'],
        ['Envíos', 'nacionales'],
        ['Rastreo', 'incluido'],
        ['Devoluciones', 'fáciles'],
    ],
};

function resolveVerticalFromTenant(slug?: string): BenefitsVertical {
    switch (slug) {
        case 'gastronomia':
            return 'gastronomy';
        case 'ecommerce':
            return 'ecommerce';
        case 'church':
        case 'iglesias':
            return 'church';
        case 'servicios':
            return 'servicios';
        case 'dropshipping':
            return 'dropshipping';
        default:
            return 'ecommerce';
    }
}

function buildItems(vertical: BenefitsVertical): BenefitItem[] {
    const icons = BENEFITS_BY_VERTICAL[vertical];
    const labels = LABELS_BY_VERTICAL[vertical];
    return icons.map((Icon, i) => {
        const [box, iconColor] = COLUMN_BOX[i];
        const [line1, line2] = labels[i];
        return {
            icon: Icon,
            boxClass: box,
            iconClass: iconColor,
            line1,
            line2,
        };
    });
}

type BenefitsProps = {
    className?: string;
    /** Si no se pasa, se usa `currentTenant.vertical.slug` cuando exista. */
    vertical?: BenefitsVertical;
};

export default function Benefits({ className, vertical: verticalProp }: BenefitsProps) {
    const page = usePage<PageProps>();
    const slug = page.props.currentTenant?.vertical?.slug;
    const vertical = verticalProp ?? resolveVerticalFromTenant(slug);
    const items = buildItems(vertical);

    return (
        <div
            className={cn(
                'flex w-full items-center justify-center gap-10 px-4 py-4',
                className,
            )}
            data-part="benefits"
            data-vertical={vertical}
            aria-label="Beneficios"
        >
            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div
                        key={`${vertical}-${index}`}
                        className="flex shrink-0 flex-col items-center gap-0.5"
                    >
                        <div
                            className={cn(
                                'flex items-center justify-center rounded-lg p-1.5',
                                item.boxClass,
                            )}
                        >
                            <Icon className={cn('size-6', item.iconClass)} strokeWidth={2} aria-hidden />
                        </div>
                        <div className="text-center text-[10px] leading-[10px] text-slate-800 pt-2">
                            <p className="mb-0">{item.line1}</p>
                            <p>{item.line2}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
