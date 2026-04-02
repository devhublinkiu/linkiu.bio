import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonRegisterLinkiuProps = {
    className?: string;
};

/**
 * CTA atribución Linkiu — Figma nodo 259:1526 (antes del badge operativo).
 */
export default function ButtonRegisterLinkiu({ className }: ButtonRegisterLinkiuProps) {
    return (
        <Link
            href={route('register.tenant')}
            aria-label="Hecho con Linkiu. Crea tu negocio gratis"
            className={cn(
                'inline-flex items-center justify-center gap-[5px] rounded-full border border-slate-300 px-6 py-1 text-slate-300 transition-colors hover:border-slate-200 hover:text-slate-200',
                className,
            )}
            data-name="button_register_linkiu"
            data-part="button-register-linkiu"
        >
            <p className="m-0 whitespace-nowrap text-center text-xs leading-normal">
                <span className="font-normal">Hecho con Linkiu</span>
                <span className="font-semibold"> | </span>
                <span className="font-bold">Crea tu negocio gratis</span>
            </p>
            <ArrowUpRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
        </Link>
    );
}
