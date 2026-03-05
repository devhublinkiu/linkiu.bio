import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Checkbox } from '@/Components/ui/checkbox';
import { CalendarCheck, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

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
    appointmentTypes: Record<string, string>;
}

export default function AppointmentRequest({ tenant, appointmentTypes }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_name: '',
        guest_phone: '',
        guest_email: '',
        appointment_type: '',
        notes: '',
        consent: false,
    });

    const page = usePage<PageProps & { flash?: { success?: string } }>();
    useEffect(() => {
        if (page.props.flash?.success) {
            toast.success(page.props.flash.success);
            reset();
        }
    }, [page.props.flash?.success, reset]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.public.appointments.store', tenant.slug), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Recibimos tu solicitud. Te contactaremos pronto para confirmar tu cita.');
                reset();
            },
            onError: () => toast.error('Revisa los campos e intenta de nuevo.'),
        });
    };

    const typeOptions = Object.entries(appointmentTypes)
        .filter(([value]) => value !== '')
        .map(([value, label]) => ({ value, label }));

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title="Solicitar cita" />

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
                <div className="max-w-md mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarCheck className="size-6 text-primary" />
                        <h1 className="text-xl font-bold text-slate-900">Solicitar cita</h1>
                    </div>
                    <p className="text-sm text-slate-600 mb-6">
                        Solicita una cita para oración, consejería pastoral o reunión con nuestro equipo. Te contactaremos para confirmar día y hora.
                    </p>

                    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="guest_name">Nombre completo *</Label>
                            <Input
                                id="guest_name"
                                value={data.guest_name}
                                onChange={(e) => setData('guest_name', e.target.value)}
                                placeholder="Tu nombre"
                                className={errors.guest_name ? 'border-destructive' : ''}
                            />
                            {errors.guest_name && <p className="text-destructive text-xs">{errors.guest_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guest_phone">Teléfono / WhatsApp *</Label>
                            <Input
                                id="guest_phone"
                                type="tel"
                                value={data.guest_phone}
                                onChange={(e) => setData('guest_phone', e.target.value)}
                                placeholder="300 123 4567"
                                className={errors.guest_phone ? 'border-destructive' : ''}
                            />
                            {errors.guest_phone && <p className="text-destructive text-xs">{errors.guest_phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="guest_email">Correo electrónico (opcional)</Label>
                            <Input
                                id="guest_email"
                                type="email"
                                value={data.guest_email}
                                onChange={(e) => setData('guest_email', e.target.value)}
                                placeholder="correo@ejemplo.com"
                                className={errors.guest_email ? 'border-destructive' : ''}
                            />
                            {errors.guest_email && <p className="text-destructive text-xs">{errors.guest_email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de cita *</Label>
                            <Select value={data.appointment_type} onValueChange={(v) => setData('appointment_type', v)}>
                                <SelectTrigger className={errors.appointment_type ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Elige una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.appointment_type && <p className="text-destructive text-xs">{errors.appointment_type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Motivo o mensaje (opcional)</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Cuéntanos brevemente por qué deseas la cita..."
                                rows={3}
                                className={errors.notes ? 'border-destructive' : ''}
                            />
                            {errors.notes && <p className="text-destructive text-xs">{errors.notes}</p>}
                        </div>

                        <div className="flex items-start gap-2">
                            <Checkbox
                                id="consent"
                                checked={data.consent}
                                onCheckedChange={(checked) => setData('consent', checked === true)}
                                className={errors.consent ? 'border-destructive' : ''}
                            />
                            <Label htmlFor="consent" className="text-sm leading-tight cursor-pointer">
                                Acepto que mis datos se usen para contactarme y confirmar mi cita. *
                            </Label>
                        </div>
                        {errors.consent && <p className="text-destructive text-xs">{errors.consent}</p>}

                        <Button type="submit" disabled={processing} className="w-full gap-2">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Solicitar cita
                        </Button>
                    </form>

                    <p className="text-center mt-4">
                        <Link href={route('tenant.home', tenant.slug)} className="text-sm text-primary hover:underline">
                            ← Volver al inicio
                        </Link>
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
