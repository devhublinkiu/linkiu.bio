import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Users, Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface TeamCollaborator {
    id: number;
    name: string;
    role: string | null;
    photo: string | null;
    bio: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    collaborator: TeamCollaborator;
}

function formatWhatsAppNumber(phone: string | null): string {
    if (!phone || typeof phone !== 'string') return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length <= 10) return `57${digits}`;
    return digits;
}

export default function TeamShow({ tenant, collaborator }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';
    const hasEmail = collaborator.email?.trim();
    const hasPhone = collaborator.phone?.trim();
    const hasWhatsApp = collaborator.whatsapp?.trim();
    const whatsappNum = formatWhatsAppNumber(collaborator.whatsapp || collaborator.phone);
    const whatsappUrl = whatsappNum
        ? `https://wa.me/${whatsappNum}`
        : '';

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`${collaborator.name} - Nuestro equipo - ${tenant.name}`} />

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
                    href={route('tenant.public.team', tenant.slug)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="size-4" />
                    Volver al equipo
                </Link>

                <article className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg mb-4">
                            {collaborator.photo ? (
                                <img
                                    src={collaborator.photo}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Users className="size-14 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            {collaborator.name}
                        </h1>
                        {collaborator.role && (
                            <p className="text-primary font-semibold mt-1">
                                {collaborator.role}
                            </p>
                        )}
                        {collaborator.bio && (
                            <p className="text-slate-600 mt-4 text-left leading-relaxed whitespace-pre-line">
                                {collaborator.bio}
                            </p>
                        )}

                        {(hasEmail || hasPhone || hasWhatsApp) && (
                            <div className="mt-6 w-full border-t border-slate-100 pt-5">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                                    Contacto
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {hasEmail && (
                                        <a
                                            href={`mailto:${collaborator.email!.trim()}`}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                                        >
                                            <Mail className="size-4" />
                                            Correo
                                        </a>
                                    )}
                                    {hasPhone && !hasWhatsApp && (
                                        <a
                                            href={`tel:${collaborator.phone!.trim().replace(/\s/g, '')}`}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                                        >
                                            <Phone className="size-4" />
                                            Llamar
                                        </a>
                                    )}
                                    {hasWhatsApp && (
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-sm transition-colors"
                                        >
                                            <MessageCircle className="size-4" />
                                            WhatsApp
                                        </a>
                                    )}
                                    {hasPhone && hasWhatsApp && (
                                        <a
                                            href={`tel:${collaborator.phone!.trim().replace(/\s/g, '')}`}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
                                        >
                                            <Phone className="size-4" />
                                            Llamar
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </PublicLayout>
    );
}
