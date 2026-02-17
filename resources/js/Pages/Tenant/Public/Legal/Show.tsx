import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, X } from 'lucide-react';

interface TenantProps {
    id: number;
    name: string;
    slug: string;
    logo_url?: string | null;
    brand_colors?: {
        bg_color?: string;
        name_color?: string;
        description_color?: string;
    };
}

interface LegalPageProps {
    slug: string;
    title: string;
    content: string;
}

interface Props {
    tenant: TenantProps;
    legalPage: LegalPageProps;
}

export default function Show({ tenant, legalPage }: Props) {
    const bgColor = tenant.brand_colors?.bg_color ?? '#0f172a';
    const textColor = tenant.brand_colors?.name_color ?? '#ffffff';

    return (
        <>
            <Head title={`${legalPage.title} - ${tenant.name}`} />

            {/* Fondo a ancho completo — overlay tipo modal */}
            <div className="fixed inset-0 z-50 w-full bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 pt-6 pb-10">
                {/* Contenedor del modal — mismo ancho que el layout */}
                <div className="w-full max-w-[480px] min-h-[min(80vh,600px)] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header con identidad */}
                    <header
                        className="shrink-0 px-4 py-4 flex items-center gap-4"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <Link
                            href={route('tenant.home', { tenant: tenant.slug })}
                            className="flex items-center gap-1.5 text-sm font-medium opacity-90 hover:opacity-100 transition-opacity"
                            style={{ color: textColor }}
                        >
                            <ChevronLeft className="size-5 shrink-0" aria-hidden />
                            Volver
                        </Link>
                        <div className="flex-1 min-w-0 flex items-center justify-center gap-3">
                            {tenant.logo_url ? (
                                <img
                                    src={tenant.logo_url}
                                    alt=""
                                    className="size-10 rounded-full object-cover border-2 border-white/30 shrink-0"
                                />
                            ) : null}
                            <span className="font-bold text-lg truncate">{tenant.name}</span>
                        </div>
                        <Link
                            href={route('tenant.home', { tenant: tenant.slug })}
                            className="flex size-10 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                            style={{ color: textColor }}
                            aria-label="Cerrar"
                        >
                            <X className="size-5" />
                        </Link>
                    </header>

                    {/* Contenido scrolleable */}
                    <main className="flex-1 overflow-y-auto px-8 py-6">
                        <h1 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-6">
                            {legalPage.title}
                        </h1>
                        {legalPage.content ? (
                            <div
                                className="legal-content text-slate-700 text-base leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:space-y-1 [&_ol]:space-y-1 [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold"
                                dangerouslySetInnerHTML={{ __html: legalPage.content }}
                            />
                        ) : (
                            <p className="text-slate-500">Este contenido aún no está disponible.</p>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}
