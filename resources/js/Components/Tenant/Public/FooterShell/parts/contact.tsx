import { Link, usePage } from '@inertiajs/react';
import { Badge } from '@/Components/ui/badge';
import type { PageProps } from '@/types';
import { cn } from '@/lib/utils';

const MAX_CHIPS = 4;

export type ContactProps = {
    className?: string;
};

function digitsForWhatsAppUrl(raw: string): string {
    return raw.replace(/\D/g, '');
}

/**
 * Información de contacto — Figma 259:1523; WhatsApp desde módulo (settings); sedes como chips.
 */
export default function Contact({ className }: ContactProps) {
    const { currentTenant, location_status_message, locationsCount, public_location_names } = usePage<PageProps>().props;
    const slug = currentTenant?.slug ?? '';
    const waFromSettings = currentTenant?.settings?.whatsapp_admin_phone?.trim();
    const phoneFallback = currentTenant?.contact_phone?.trim();
    const whatsappNumber = waFromSettings || phoneFallback || '';
    const waDigits = whatsappNumber ? digitsForWhatsAppUrl(whatsappNumber) : '';
    const whatsappHref = waDigits ? `https://wa.me/${waDigits}` : '';

    const horario = location_status_message?.trim();
    const lineaAbierto = horario
        ? /^(abierto|cerrado)/i.test(horario)
            ? horario
            : `Abierto hoy: ${horario}`
        : 'Abierto hoy: —';

    const count =
        typeof locationsCount === 'number' && !Number.isNaN(locationsCount) ? locationsCount : 0;
    const namesFromServer = public_location_names ?? [];
    const sedesHref = slug ? route('tenant.public.locations', { tenant: slug }) : '#';

    const chips =
        namesFromServer.length > 0
            ? namesFromServer.slice(0, MAX_CHIPS)
            : count === 1
              ? ['Sede principal']
              : count > 1
                ? ['Varias sedes']
                : [];

    const mostrarVerTodasEnChip = count > 1 && Boolean(slug);

    return (
        <div
            className={cn(
                'footer-shell-contact flex w-full flex-col items-center gap-2.5 pt-6 text-center text-slate-950',
                className,
            )}
            data-name="Base_contacts"
            data-part="contact"
        >
            <p className="w-full shrink-0 text-sm font-bold leading-normal">Información de contacto</p>

            <div className="w-full shrink-0 text-xs font-normal leading-[14px] text-slate-950">
                <p className="mb-0 leading-[14px]">{lineaAbierto}</p>

                <div className="mt-2 flex w-full flex-col items-center gap-1.5">
                    <span className="block w-full text-[12px] leading-[14px] text-slate-950">WhatsApp:</span>
                    <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
                        {whatsappNumber ? (
                            whatsappHref ? (
                                <Badge
                                    variant="outline"
                                    className="border-slate-200 bg-slate-50 font-medium text-slate-900"
                                    asChild
                                >
                                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                                        {whatsappNumber}
                                    </a>
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="border-slate-200 bg-slate-50 font-medium text-slate-900"
                                >
                                    {whatsappNumber}
                                </Badge>
                            )
                        ) : (
                            <Badge variant="outline" className="font-normal text-slate-700">
                                —
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mt-2 flex w-full flex-col items-center gap-1.5">
                    <span className="block w-full text-[12px] leading-[14px] text-slate-950">Sedes:</span>
                    <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
                        {count === 0 && (
                            <Badge variant="outline" className="font-normal text-slate-700">
                                —
                            </Badge>
                        )}
                        {chips.map((name) => (
                            <Badge
                                key={name}
                                variant="outline"
                                className="max-w-[140px] truncate border-slate-200 bg-slate-50 font-medium text-slate-900"
                            >
                                {name}
                            </Badge>
                        ))}
                        {mostrarVerTodasEnChip && (
                            <Badge variant="outline" className="border-slate-200 bg-transparent p-0 font-medium" asChild>
                                <Link href={sedesHref} className="px-2 py-0.5 text-slate-950 hover:bg-slate-100">
                                    Ver todas las sedes
                                </Link>
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
