import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Banknote, Loader2, Upload } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface BankAccountPublic {
    id: number;
    bank_name: string;
    account_type: string;
    account_number: string;
    account_holder: string;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    bankAccounts: BankAccountPublic[];
}

export default function DonationsIndex({ tenant, bankAccounts }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        donor_name: '',
        donor_phone: '',
        amount: '' as string | number,
        bank_account_id: null as number | null,
        proof: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.public.donations.store', tenant.slug), {
            forceFormData: !!data.proof,
            preserveScroll: true,
            onSuccess: () => {},
            onError: () => toast.error('Revisa los campos e intenta de nuevo.'),
        });
    };

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title="Donaciones" />

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
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <Banknote className="size-6 text-primary" />
                        <h1 className="text-xl font-bold text-slate-900">Donaciones</h1>
                    </div>
                    <p className="text-sm text-slate-600 mb-6">
                        Tu ofrenda sostiene la obra. Indica tus datos para poder agradecerte y, si ya realizaste la transferencia, puedes subir tu comprobante (opcional).
                    </p>

                    <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="donor_name">Nombre *</Label>
                            <Input
                                id="donor_name"
                                value={data.donor_name}
                                onChange={(e) => setData('donor_name', e.target.value)}
                                placeholder="Tu nombre"
                                className={errors.donor_name ? 'border-destructive' : ''}
                            />
                            {errors.donor_name && <p className="text-destructive text-xs">{errors.donor_name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="donor_phone">Celular *</Label>
                            <Input
                                id="donor_phone"
                                type="tel"
                                value={data.donor_phone}
                                onChange={(e) => setData('donor_phone', e.target.value)}
                                placeholder="300 123 4567"
                                className={errors.donor_phone ? 'border-destructive' : ''}
                            />
                            {errors.donor_phone && (
                                <p className="text-destructive text-xs">{errors.donor_phone}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Monto (COP) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                min={1}
                                step={1}
                                value={data.amount === '' ? '' : data.amount}
                                onChange={(e) =>
                                    setData('amount', e.target.value === '' ? '' : Number(e.target.value) || 0)
                                }
                                placeholder="Ej: 50000"
                                className={errors.amount ? 'border-destructive' : ''}
                            />
                            {errors.amount && <p className="text-destructive text-xs">{errors.amount}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Comprobante de pago (opcional)</Label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="hidden"
                                onChange={(e) => setData('proof', e.target.files?.[0] ?? null)}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full gap-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="size-4" />
                                {data.proof ? data.proof.name : 'Seleccionar imagen o PDF'}
                            </Button>
                            {errors.proof && <p className="text-destructive text-xs">{errors.proof}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full gap-2">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Enviar
                        </Button>
                    </form>

                    {bankAccounts.length > 0 && (
                        <div className="mt-8 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                            <h2 className="text-base font-bold text-slate-900 mb-3">Dónde transferir o consignar</h2>
                            <p className="text-sm text-slate-600 mb-4">
                                Puedes realizar tu ofrenda a cualquiera de estas cuentas:
                            </p>
                            <ul className="space-y-4">
                                {bankAccounts.map((acc) => (
                                    <li
                                        key={acc.id}
                                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm"
                                    >
                                        <p className="font-semibold text-slate-900">{acc.bank_name}</p>
                                        <p className="text-slate-600">
                                            {acc.account_type}: <span className="font-mono font-medium">{acc.account_number}</span>
                                        </p>
                                        <p className="text-slate-600">Titular: {acc.account_holder}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <p className="text-center mt-6">
                        <Link
                            href={route('tenant.home', tenant.slug)}
                            className="text-sm text-primary hover:underline"
                        >
                            ← Volver al inicio
                        </Link>
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
