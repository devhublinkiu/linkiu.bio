import type { LucideIcon } from 'lucide-react';
import { Server, ServerCrash } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PlatformOperationalStatus = 'operational' | 'intermittent' | 'interrupted';

const STATUS_CONFIG: Record<
    PlatformOperationalStatus,
    { label: string; icon: LucideIcon; className: string; iconClassName: string }
> = {
    operational: {
        label: 'Todos los sistemas operativos',
        icon: Server,
        className: 'bg-emerald-100',
        iconClassName: 'text-emerald-900',
    },
    intermittent: {
        label: 'Algunos servicios intermitentes',
        icon: Server,
        className: 'bg-amber-100',
        iconClassName: 'text-amber-700',
    },
    interrupted: {
        label: 'Servicios con interrupciones',
        icon: ServerCrash,
        className: 'bg-red-100',
        iconClassName: 'text-red-600',
    },
};

type BagdeOperativeProps = {
    className?: string;
    /** Estado de la plataforma; por defecto operativo (diseño Figma LINKIU-OFICIAL node 253:1028). */
    status?: PlatformOperationalStatus;
};

export default function BagdeOperative({ className, status = 'operational' }: BagdeOperativeProps) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    const textClass =
        status === 'operational'
            ? 'text-emerald-900'
            : status === 'intermittent'
              ? 'text-amber-700'
              : 'text-red-600';

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full px-2 py-1',
                cfg.className,
                className,
            )}
            role="status"
            aria-label={cfg.label}
            data-part="badge-operative"
            data-status={status}
        >
            <span className="relative flex size-4 shrink-0 items-center justify-center" aria-hidden>
                <Icon className={cn('size-4', cfg.iconClassName)} strokeWidth={2} />
            </span>
            <p className={cn('text-center text-xs font-normal leading-none whitespace-nowrap', textClass)}>
                {cfg.label}
            </p>
        </div>
    );
}
