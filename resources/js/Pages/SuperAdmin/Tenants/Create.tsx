import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { FieldError } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/Components/ui/input-group';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { cn } from '@/lib/utils';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, CreditCard, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
}

interface Vertical {
    id: number;
    name: string;
    categories: Category[];
}

interface Plan {
    id: number;
    name: string;
    monthly_price: number;
    currency: string;
    description: string;
    quarterly_discount_percent: number;
    semiannual_discount_percent: number;
    yearly_discount_percent: number;
    allow_custom_slug?: boolean;
    vertical_id: number | string;
}

interface Props {
    verticals: Vertical[];
    plans: Plan[];
}

export default function Create({ verticals, plans }: Props) {
    // 1. Initial State from LocalStorage if available
    const getSavedData = () => {
        const saved = localStorage.getItem('tenant_wizard_draft');
        return saved ? JSON.parse(saved) : null;
    };

    const savedData = getSavedData();

    const [currentStep, setCurrentStep] = useState(savedData?.currentStep || 1);
    const { data, setData, post, processing, errors, reset } = useForm({
        vertical_id: savedData?.data?.vertical_id || '',
        category_id: savedData?.data?.category_id || '',

        plan_id: savedData?.data?.plan_id || '',
        billing_cycle: savedData?.data?.billing_cycle || 'monthly',

        owner_name: savedData?.data?.owner_name || '',
        owner_email: savedData?.data?.owner_email || '',
        owner_doc_type: savedData?.data?.owner_doc_type || 'CC',
        owner_doc_number: savedData?.data?.owner_doc_number || '',
        owner_phone: savedData?.data?.owner_phone || '',
        owner_address: savedData?.data?.owner_address || '',
        owner_country: savedData?.data?.owner_country || 'Colombia',
        owner_state: savedData?.data?.owner_state || '',
        owner_city: savedData?.data?.owner_city || '',
        owner_password: savedData?.data?.owner_password || '',

        tenant_name: savedData?.data?.tenant_name || '',
        slug: savedData?.data?.slug || '',
        regime: savedData?.data?.regime || 'comun',
        tenant_doc_type: savedData?.data?.tenant_doc_type || 'NIT',
        tenant_doc_number: savedData?.data?.tenant_doc_number || '',
        verification_digit: savedData?.data?.verification_digit || '',
        tenant_contact_email: savedData?.data?.tenant_contact_email || '',
        tenant_address: savedData?.data?.tenant_address || '',
        tenant_state: savedData?.data?.tenant_state || '',
        tenant_city: savedData?.data?.tenant_city || '',
        use_owner_address: savedData?.data?.use_owner_address || false,
    });

    // 2. Persist to LocalStorage on Change
    useEffect(() => {
        localStorage.setItem('tenant_wizard_draft', JSON.stringify({ data, currentStep }));
    }, [data, currentStep]);

    const clearDraft = () => {
        localStorage.removeItem('tenant_wizard_draft');
        reset();
        setCurrentStep(1);
        toast.success('Formulario reiniciado');
    };

    // Dynamic Categories
    const availableCategories = verticals.find(v => v.id.toString() === data.vertical_id)?.categories || [];

    // Plan Logic for Slug
    const filteredPlans = plans.filter(p => p.vertical_id.toString() === data.vertical_id);
    const selectedPlan = plans.find(p => p.id.toString() === data.plan_id);
    const allowCustomSlug = selectedPlan?.allow_custom_slug !== false;

    // Auto-slug logic
    useEffect(() => {
        if (!data.tenant_name) return;

        const baseSlug = data.tenant_name
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        if (!allowCustomSlug) {
            // Generate slug by mixing random chars into the name
            // Example: "linkiuecomm" -> "le34xzomm"
            const length = baseSlug.length;
            let generatedSlug;

            if (length > 6) {
                const start = baseSlug.substring(0, 2);
                const end = baseSlug.substring(length - 4);
                const randomMiddle = Math.random().toString(36).substring(2, 6);
                generatedSlug = start + randomMiddle + end;
            } else {
                // For short names, add random suffix
                const randomSuffix = Math.random().toString(36).substring(2, 5);
                generatedSlug = baseSlug + randomSuffix;
            }

            setData('slug', generatedSlug);
        } else {
            // Only auto-fill if empty to allow custom edits
            if (!data.slug) setData('slug', baseSlug);
        }
    }, [data.tenant_name, allowCustomSlug]);

    useEffect(() => {
        if (data.use_owner_address) {
            setData(prev => ({
                ...prev,
                tenant_address: prev.owner_address,
                tenant_state: prev.owner_state,
                tenant_city: prev.owner_city
            }));
        }
    }, [data.use_owner_address, data.owner_address, data.owner_state, data.owner_city]);

    // Error Jump Logic
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const step1Fields = ['vertical_id', 'category_id'];
            const step2Fields = ['plan_id', 'billing_cycle'];
            const step3Fields = ['owner_name', 'owner_email', 'owner_doc_number', 'owner_password', 'owner_address', 'owner_doc_type', 'owner_phone', 'owner_state', 'owner_city'];

            const hasError = (fields: string[]) => fields.some(f => errors[f as keyof typeof data]);

            if (hasError(step1Fields)) setCurrentStep(1);
            else if (hasError(step2Fields)) setCurrentStep(2);
            else if (hasError(step3Fields)) setCurrentStep(3);
            else setCurrentStep(4);

            toast.error('Por favor verifica los campos resaltados en rojo.');
        }
    }, [errors]);

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenants.store'), {
            onSuccess: () => {
                localStorage.removeItem('tenant_wizard_draft');
                toast.success('¡Tienda, Usuario y Suscripción creados!');
            },
            onError: (err) => {
                console.error('Submission Error:', err);
            }
        });
    };

    const steps = [
        { id: 1, title: 'Concepto', icon: ShoppingBag, desc: 'Vertical y Categoría' },
        { id: 2, title: 'Plan', icon: CreditCard, desc: 'Suscripción y Ciclo' },
        { id: 3, title: 'Propietario', icon: User, desc: 'Datos Personales' },
        { id: 4, title: 'Negocio', icon: Building2, desc: 'Datos Fiscales' },
    ];

    return (
        <SuperAdminLayout header="Alta de Nueva Tienda">
            <Head title="Nueva Tienda" />

            <div className="max-w-5xl mx-auto py-6">

                <div className="flex justify-end mb-4">
                    <Button variant="ghost" size="sm" onClick={clearDraft} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        Reiniciar Formulario
                    </Button>
                </div>

                {/* Steps Indicator */}
                <div className="mb-8">
                    <div className="flex justify-between relative">
                        <div className="absolute left-0 top-6 w-full h-1 bg-gray-100 -z-10 rounded-full">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                                style={{ width: ((currentStep - 1) / 3) * 100 + '%' }}
                            ></div>
                        </div>

                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        currentStep >= step.id
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                                            : "bg-white border-gray-200 text-gray-400"
                                    )}
                                >
                                    <step.icon className="w-5 h-5" />
                                </div>
                                <div className="text-center">
                                    <div className={cn("text-xs font-bold uppercase tracking-wider", currentStep >= step.id ? "text-blue-700" : "text-gray-400")}>
                                        {step.title}
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-medium hidden sm:block">{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={submit}>
                    <Card className="min-h-[400px] flex flex-col justify-between shadow-xl border-gray-200">
                        <CardHeader className="bg-gray-50/50 border-b pb-8">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                    {currentStep}
                                </span>
                                {steps[currentStep - 1].title}
                            </CardTitle>
                            <CardDescription>
                                Completa la información solicitada en el paso {currentStep} de 4.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-8">
                            {/* STEP 1: CLASSIFICATION */}
                            {currentStep === 1 && (
                                <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Vertical de Negocio</Label>
                                            <Select value={data.vertical_id} onValueChange={val => setData('vertical_id', val)}>
                                                <SelectTrigger className="h-12 border-blue-100 bg-blue-50/30">
                                                    <SelectValue placeholder="Selecciona una vertical..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {verticals.map(v => (
                                                        <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError>{errors.vertical_id}</FieldError>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Categoría Específica</Label>
                                            <Select
                                                value={data.category_id}
                                                onValueChange={val => setData('category_id', val)}
                                                disabled={!data.vertical_id}
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Selecciona una categoría..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableCategories.map(c => (
                                                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FieldError>{errors.category_id}</FieldError>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: PLAN */}
                            {currentStep === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {filteredPlans.length === 0 ? (
                                            <div className="col-span-3 py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                                                No hay planes disponibles para esta vertical.
                                            </div>
                                        ) : (
                                            filteredPlans.map(plan => (
                                                <div
                                                    key={plan.id}
                                                    className={cn(
                                                        "cursor-pointer border rounded-xl p-6 transition-all hover:shadow-lg relative",
                                                        data.plan_id === plan.id.toString()
                                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                                            : "border-gray-200 bg-white"
                                                    )}
                                                    onClick={() => setData('plan_id', plan.id.toString())}
                                                >
                                                    {data.plan_id === plan.id.toString() && (
                                                        <div className="absolute top-4 right-4 text-blue-600">
                                                            <CheckCircle2 className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                    <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                                                    <div className="text-2xl font-bold text-gray-900 mb-2">
                                                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: plan.currency }).format(plan.monthly_price)}
                                                        <span className="text-sm font-normal text-muted-foreground">/mes</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{plan.description}</p>

                                                    {plan.allow_custom_slug === false && (
                                                        <div className="mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded inline-block">
                                                            Slug automático
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <FieldError className="text-center">{errors.plan_id}</FieldError>

                                    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded-xl border">
                                        <Label className="mb-4 block text-center font-medium">Ciclo de Facturación</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['monthly', 'quarterly', 'semiannual', 'yearly'].map(cycle => (
                                                <button
                                                    key={cycle}
                                                    type="button"
                                                    onClick={() => setData('billing_cycle', cycle)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                                                        data.billing_cycle === cycle
                                                            ? "bg-black text-white border-black"
                                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {cycle === 'monthly' && 'Mensual'}
                                                    {cycle === 'quarterly' && 'Trimestral'}
                                                    {cycle === 'semiannual' && 'Semestral'}
                                                    {cycle === 'yearly' && 'Anual'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: OWNER */}
                            {currentStep === 3 && (
                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-2">
                                        <Label htmlFor="owner_name">Nombre Completo</Label>
                                        <Input id="owner_name" name="owner_name" value={data.owner_name} onChange={e => setData('owner_name', e.target.value)} />
                                        <FieldError>{errors.owner_name}</FieldError>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="owner_email">Correo Electrónico</Label>
                                        <Input id="owner_email" name="owner_email" type="email" value={data.owner_email} onChange={e => setData('owner_email', e.target.value)} />
                                        <FieldError>{errors.owner_email}</FieldError>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-2">
                                            <Label>Tipo Doc</Label>
                                            <Select value={data.owner_doc_type} onValueChange={val => setData('owner_doc_type', val)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CC">CC</SelectItem>
                                                    <SelectItem value="CE">CE</SelectItem>
                                                    <SelectItem value="PAS">Pasaporte</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="owner_doc_number">Número Documento</Label>
                                            <Input id="owner_doc_number" name="owner_doc_number" value={data.owner_doc_number} onChange={e => setData('owner_doc_number', e.target.value)} />
                                            <FieldError>{errors.owner_doc_number}</FieldError>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="owner_phone">Celular / WhatsApp</Label>
                                        <Input id="owner_phone" name="owner_phone" value={data.owner_phone} onChange={e => setData('owner_phone', e.target.value)} />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="owner_address">Dirección Personal</Label>
                                        <Input id="owner_address" name="owner_address" value={data.owner_address} onChange={e => setData('owner_address', e.target.value)} />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 md:col-span-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_country">País</Label>
                                            <Input id="owner_country" name="owner_country" value={data.owner_country} onChange={e => setData('owner_country', e.target.value)} readOnly className="bg-gray-50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_state">Departamento</Label>
                                            <Input id="owner_state" name="owner_state" value={data.owner_state} onChange={e => setData('owner_state', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_city">Ciudad</Label>
                                            <Input id="owner_city" name="owner_city" value={data.owner_city} onChange={e => setData('owner_city', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2 pt-4 border-t">
                                        <Label htmlFor="owner_password" className="text-red-600">Contraseña Temporal</Label>
                                        <Input id="owner_password" name="owner_password" type="text" value={data.owner_password} onChange={e => setData('owner_password', e.target.value)} placeholder="Asignar contraseña de acceso..." />
                                        <FieldError>{errors.owner_password}</FieldError>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: BUSINESS */}
                            {currentStep === 4 && (
                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="space-y-2">
                                        <Label htmlFor="tenant_name">Nombre del Negocio (Público)</Label>
                                        <Input id="tenant_name" name="tenant_name" value={data.tenant_name ?? ''} onChange={e => setData('tenant_name', e.target.value)} />
                                        <FieldError>{errors.tenant_name}</FieldError>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug (URL)</Label>
                                        <InputGroup>
                                            <InputGroupAddon className="bg-muted text-muted-foreground border-r-0">
                                                linkiu.bio/
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                id="slug"
                                                name="slug"
                                                className={cn("text-sm", !allowCustomSlug && "bg-muted text-muted-foreground cursor-not-allowed")}
                                                value={data.slug ?? ''}
                                                onChange={e => setData('slug', e.target.value)}
                                                readOnly={!allowCustomSlug}
                                            />
                                        </InputGroup>
                                        {!allowCustomSlug && (
                                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                                <span className="inline-block w-1 h-1 bg-amber-600 rounded-full"></span>
                                                Este plan genera un slug único mezclando caracteres aleatorios
                                            </p>
                                        )}
                                        <FieldError>{errors.slug}</FieldError>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Régimen Fiscal</Label>
                                        <Select value={data.regime} onValueChange={val => setData('regime', val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="comun">Responsable de IVA</SelectItem>
                                                <SelectItem value="simple">No Responsable de IVA</SelectItem>
                                                <SelectItem value="especial">Régimen Simple / Especial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2">
                                        <div className="space-y-2 col-span-1">
                                            <Label>Doc</Label>
                                            <Select value={data.tenant_doc_type} onValueChange={val => setData('tenant_doc_type', val)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NIT">NIT</SelectItem>
                                                    <SelectItem value="RUT">RUT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="tenant_doc_number">Número</Label>
                                            <Input id="tenant_doc_number" name="tenant_doc_number" value={data.tenant_doc_number ?? ''} onChange={e => setData('tenant_doc_number', e.target.value)} />
                                        </div>
                                        <div className="col-span-1 space-y-2">
                                            <Label htmlFor="verification_digit">DV</Label>
                                            <Input id="verification_digit" name="verification_digit" value={data.verification_digit ?? ''} maxLength={1} onChange={e => setData('verification_digit', e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex items-center gap-2 py-2">
                                        <Checkbox
                                            id="use_owner_address"
                                            checked={data.use_owner_address}
                                            onCheckedChange={val => setData('use_owner_address', val === true)}
                                        />
                                        <Label htmlFor="use_owner_address" className="font-normal cursor-pointer">Usar la misma dirección del propietario</Label>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="tenant_address">Dirección Fiscal</Label>
                                        <Input id="tenant_address" name="tenant_address" value={data.tenant_address ?? ''} onChange={e => setData('tenant_address', e.target.value)} disabled={data.use_owner_address} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tenant_state">Departamento</Label>
                                        <Input id="tenant_state" name="tenant_state" value={data.tenant_state ?? ''} onChange={e => setData('tenant_state', e.target.value)} disabled={data.use_owner_address} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tenant_city">Ciudad</Label>
                                        <Input id="tenant_city" name="tenant_city" value={data.tenant_city ?? ''} onChange={e => setData('tenant_city', e.target.value)} disabled={data.use_owner_address} />
                                    </div>

                                    <div className="space-y-2 md:col-span-2 pt-4">
                                        <Label htmlFor="tenant_contact_email">Email de Contacto (Público)</Label>
                                        <Input id="tenant_contact_email" name="tenant_contact_email" value={data.tenant_contact_email ?? ''} onChange={e => setData('tenant_contact_email', e.target.value)} placeholder="contacto@mitienda.com" />
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="bg-gray-50 flex justify-between border-t py-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1 || processing}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Anterior
                            </Button>

                            {currentStep < 4 ? (
                                <Button type="button" onClick={nextStep} disabled={processing}>
                                    Siguiente
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700 w-48">
                                    {processing ? (
                                        'Creando Tienda...'
                                    ) : (
                                        <>
                                            Finalizar y Crear
                                            <CheckCircle2 className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </form>

            </div>
        </SuperAdminLayout>
    );
}
