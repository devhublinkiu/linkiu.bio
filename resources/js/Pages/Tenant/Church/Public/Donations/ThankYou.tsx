import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Button } from '@/Components/ui/button';
import { Ripple } from '@/Components/ui/ripple';
import { CheckCircle2, Banknote } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
}

export default function DonationsThankYou({ tenant }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title="Gracias por tu ofrenda" />

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

            <div className="flex-1 bg-slate-50/80 p-4 -mt-4 pb-20 pt-8">
                <div className="max-w-md mx-auto text-center">
                    {/* Icono con efecto ripple (igual que success de gastronomía) */}
                    <div className="relative w-full flex flex-col items-center text-center animate-in zoom-in-50 duration-500 mb-6">
                        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[560px] h-[560px] z-0 flex items-center justify-center pointer-events-none overflow-visible">
                            <Ripple mainCircleSize={100} mainCircleOpacity={0.22} numCircles={5} />
                        </div>
                        <div className="relative z-10 w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 mb-2">¡Gracias por tu ofrenda!</h1>
                    <p className="text-slate-600 mb-8">
                        Hemos recibido tu información. Si subiste un comprobante, lo revisaremos pronto. Que Dios bendiga tu generosidad.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link href={route('tenant.public.donations', tenant.slug)}>
                            <Button variant="outline" className="w-full gap-2">
                                <Banknote className="size-4" />
                                Hacer otra donación
                            </Button>
                        </Link>
                        <Link href={route('tenant.home', tenant.slug)}>
                            <Button className="w-full">Volver al inicio</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
