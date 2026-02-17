import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import {
    Store,
    MapPin,
    Truck,
    Save,
    Plus,
    Trash2,
    CheckCircle2,
    X,
    Building2,
    Globe,
    Loader2,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useColombiaApi, Department, City } from '@/hooks/useColombiaApi';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { MultiSelect } from "@/Components/ui/multi-select";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';

interface ShippingZone {
    id?: number;
    department_code: string;
    department_name: string;
    city_code?: string | null;
    city_name?: string | null;
    price?: number | null;
}

interface LocationOption {
    id: number;
    name: string;
}

/** Location with city/state for display (e.g. Domicilio local) */
interface MethodLocation extends LocationOption {
    city?: string | null;
    state?: string | null;
}

interface ShippingMethod {
    id: number;
    type: string;
    is_active: boolean;
    cost: number;
    free_shipping_min_amount?: number;
    delivery_time?: string;
    instructions?: string;
    settings?: Record<string, string>;
    location_id: number | null;
    location?: MethodLocation | null;
    zones?: ShippingZone[];
}

interface TenantSlug {
    slug: string;
}

interface Props {
    tenant: TenantSlug;
    shippingMethods: ShippingMethod[];
    tenantCity?: string;
    tenantState?: string;
    locations: LocationOption[];
    userLocationId: number | null;
}

export default function Index({ tenant, shippingMethods, tenantCity, tenantState, locations = [], userLocationId }: Props) {
    const { currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };

    const handleProtectedAction = (e: React.MouseEvent | null, permission: string, callback: () => void) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!hasPermission(permission)) {
            setShowPermissionModal(true);
        } else {
            callback();
        }
    };

    const getMethod = (type: string) => shippingMethods.find(m => m.type === type);
    const pickupMethod = getMethod('pickup');
    const localMethod = getMethod('local');
    const nationalMethod = getMethod('national');

    // Domicilio local: ciudad/estado de la sede si tiene location_id, si no del tenant
    const localDisplayCity = localMethod?.location?.city ?? tenantCity;
    const localDisplayState = localMethod?.location?.state ?? tenantState;
    const localCityLabel = [localDisplayCity, localDisplayState].filter(Boolean).join(', ') || 'No configurada';

    return (
        <AdminLayout title="Configuración de Envíos">
            <Head title="Envíos - Linkiu.Bio" />

            <div className="max-w-5xl mx-auto py-8 text-slate-900">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Métodos de Envío</h1>
                    <p className="text-slate-500 font-medium">Configura cómo tus clientes reciben sus pedidos.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 1. Retiro en Tienda */}
                    <div className="space-y-6">
                        <ShippingCard
                            tenant={tenant}
                            method={pickupMethod}
                            title="Retiro en Tienda"
                            description="El cliente pasa a recoger su pedido."
                            icon={<Store className="w-6 h-6" />}
                            colorClass="bg-orange-100 text-orange-600"
                            borderColorClass="border-orange-500/50"
                            handleProtectedAction={handleProtectedAction}
                            locations={locations}
                        >
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 font-medium">
                                    Esta opción siempre es <strong>Gratis</strong> para el cliente.
                                </div>
                                <MethodSettingsForm tenant={tenant} method={pickupMethod} type="pickup" locations={locations} handleProtectedAction={handleProtectedAction} />
                            </div>
                        </ShippingCard>

                        {/* 2. Domicilio Local */}
                        <ShippingCard
                            tenant={tenant}
                            method={localMethod}
                            title="Domicilio Local"
                            description={`Entregas en tu ciudad (${localCityLabel}).`}
                            icon={<MapPin className="w-6 h-6" />}
                            colorClass="bg-blue-100 text-blue-600"
                            borderColorClass="border-blue-500/50"
                            handleProtectedAction={handleProtectedAction}
                            locations={locations}
                        >
                            <div className="space-y-4">
                                {!localDisplayCity && (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">
                                        ⚠️ Asigna una sede con ciudad configurada o configura la ciudad del negocio para que esto funcione.
                                    </div>
                                )}
                                {localDisplayCity && (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Funciona para clientes en <strong>{localCityLabel}</strong>.
                                    </div>
                                )}
                                <MethodSettingsForm tenant={tenant} method={localMethod} type="local" locations={locations} handleProtectedAction={handleProtectedAction} />
                            </div>
                        </ShippingCard>
                    </div>

                    {/* 3. Envío Nacional */}
                    <div className="space-y-6">
                        <ShippingCard
                            tenant={tenant}
                            method={nationalMethod}
                            title="Despachos Nacionales"
                            description="Envíos por transportadora a otras ciudades."
                            icon={<Truck className="w-6 h-6" />}
                            colorClass="bg-purple-100 text-purple-600"
                            borderColorClass="border-purple-500/50"
                            handleProtectedAction={handleProtectedAction}
                            locations={locations}
                        >
                            <div className="space-y-6">
                                <MethodSettingsForm tenant={tenant} method={nationalMethod} type="national" locations={locations} handleProtectedAction={handleProtectedAction} />

                                {nationalMethod?.is_active && (
                                    <>
                                        <div className="h-px bg-slate-100 my-4" />
                                        <ZonesManager tenant={tenant} method={nationalMethod} handleProtectedAction={handleProtectedAction} />
                                    </>
                                )}
                            </div>
                        </ShippingCard>
                    </div>
                </div>
                <PermissionDeniedModal
                    open={showPermissionModal}
                    onOpenChange={setShowPermissionModal}
                />
            </div>
        </AdminLayout>
    );
}

function ShippingCard({
    tenant,
    method,
    title,
    description,
    icon,
    colorClass,
    borderColorClass,
    children,
    handleProtectedAction,
    locations,
}: {
    tenant: TenantSlug;
    method: ShippingMethod | undefined;
    title: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
    borderColorClass: string;
    children: React.ReactNode;
    handleProtectedAction: (e: React.MouseEvent | null, permission: string, callback: () => void) => void;
    locations: LocationOption[];
}) {
    const handleToggle = (checked: boolean) => {
        if (!method) return;
        handleProtectedAction(null, 'shipping_zones.update', () => {
            router.put(route('tenant.shipping.update', { tenant: tenant.slug, method: method.id }), {
                is_active: checked
            }, {
                preserveScroll: true,
                onSuccess: () => toast.success(checked ? 'Método activado' : 'Método desactivado')
            });
        });
    };

    return (
        <Card className={`border-2 transition-all ${method?.is_active ? borderColorClass + ' shadow-lg shadow-purple-500/5' : 'border-slate-100'}`}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl ${colorClass}`}>
                        {icon}
                    </div>
                    <Switch
                        checked={method?.is_active}
                        onCheckedChange={handleToggle}
                        disabled={!method}
                    />
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <CardTitle className="m-0">{title}</CardTitle>
                    {method?.location ? (
                        <Badge variant="outline" className="text-[10px] h-4 border-primary/20 bg-primary/5 text-primary gap-1">
                            <Building2 className="w-2.5 h-2.5" />
                            {method.location.name}
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-[10px] h-4 gap-1">
                            <Globe className="w-2.5 h-2.5" />
                            Global
                        </Badge>
                    )}
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            {method?.is_active && (
                <CardContent>
                    {children}
                </CardContent>
            )}
        </Card>
    );
}

function MethodSettingsForm({
    tenant,
    method,
    type,
    locations = [],
    handleProtectedAction,
}: {
    tenant: TenantSlug;
    method: ShippingMethod | undefined;
    type: string;
    locations: LocationOption[];
    handleProtectedAction: (e: React.MouseEvent | null, permission: string, callback: () => void) => void;
}) {
    const { data, setData, put, processing, isDirty } = useForm({
        cost: method?.cost ?? 0,
        free_shipping_min_amount: method?.free_shipping_min_amount ?? '',
        delivery_time: method?.delivery_time ?? '',
        instructions: method?.instructions ?? '',
        settings: method?.settings ?? {},
        location_id: method?.location_id ?? 'all'
    });

    if (!method) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        handleProtectedAction(null, 'shipping_zones.update', () => {
            put(route('tenant.shipping.update', { tenant: tenant.slug, method: method.id }), {
                onSuccess: () => toast.success('Configuración guardada')
            });
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">Sede Responsable</Label>
                <Select value={data.location_id?.toString()} onValueChange={v => setData('location_id', v === 'all' ? 'all' : v)}>
                    <SelectTrigger className="bg-white border-slate-200 h-9">
                        <SelectValue placeholder="Todas las sedes (Global)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las sedes (Global)</SelectItem>
                        {locations.map(loc => (
                            <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {type !== 'pickup' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Costo de Envío</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                            <CurrencyInput
                                className="pl-6"
                                value={data.cost}
                                onChange={(val: number | '') => setData('cost', val === '' ? 0 : val)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Gratis a partir de</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                            <CurrencyInput
                                className="pl-6"
                                placeholder="0"
                                value={data.free_shipping_min_amount === '' || data.free_shipping_min_amount == null ? '' : Number(data.free_shipping_min_amount)}
                                onChange={(val: number | '') => setData('free_shipping_min_amount', val === '' ? '' : val)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">{type === 'pickup' ? 'Tiempo de Preparación' : 'Tiempo de Entrega'}</Label>
                <Input
                    placeholder={type === 'pickup' ? 'Ej: Listo en 2 horas' : 'Ej: 1-3 días hábiles'}
                    value={type === 'pickup' ? (data.settings?.prep_time || '') : data.delivery_time}
                    onChange={e => {
                        if (type === 'pickup') {
                            setData('settings', { ...data.settings, prep_time: e.target.value });
                        } else {
                            setData('delivery_time', e.target.value);
                        }
                    }}
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase">Instrucciones para el cliente</Label>
                <Textarea
                    placeholder="Ej: Te enviaremos el número de guía por WhatsApp."
                    className="resize-none h-20"
                    value={data.instructions}
                    onChange={e => setData('instructions', e.target.value)}
                />
            </div>

            {isDirty && (
                <div className="flex justify-end pt-2">
                    <Button type="submit" size="sm" disabled={processing} className="gap-2 bg-slate-900 hover:bg-slate-800">
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar Cambios
                    </Button>
                </div>
            )}
        </form>
    );
}

type GroupedZones = Record<string, { id: string; name: string; zones: ShippingZone[] }>;

function ZonesManager({
    tenant,
    method,
    handleProtectedAction,
}: {
    tenant: TenantSlug;
    method: ShippingMethod;
    handleProtectedAction: (e: React.MouseEvent | null, permission: string, callback: () => void) => void;
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [zoneToDelete, setZoneToDelete] = useState<number | null>(null);
    const [isSubmittingZones, setIsSubmittingZones] = useState(false);

    const handleDeleteZone = (zoneId: number) => {
        if (!zoneId) return;
        handleProtectedAction(null, 'shipping_zones.update', () => {
            const newZones = (method.zones || []).filter((z) => z.id !== zoneId);
            router.post(route('tenant.shipping.zones.update', { tenant: tenant.slug, method: method.id }), {
                zones: newZones
            } as unknown as Record<string, import('@inertiajs/core').FormDataConvertible>, {
                preserveScroll: true,
                onStart: () => setIsSubmittingZones(true),
                onFinish: () => setIsSubmittingZones(false),
                onSuccess: () => {
                    toast.success('Zona eliminada');
                    setZoneToDelete(null);
                },
            });
        });
    };

    const groupedZones = useMemo((): GroupedZones => {
        const groups: GroupedZones = {};
        if (!method.zones) return {};

        method.zones.forEach((zone) => {
            const deptCode = zone.department_code;
            if (!groups[deptCode]) {
                groups[deptCode] = {
                    id: deptCode,
                    name: zone.department_name,
                    zones: []
                };
            }
            groups[deptCode].zones.push(zone);
        });
        return groups;
    }, [method.zones]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    Zonas de Cobertura ({method.zones?.length || 0})
                    {isSubmittingZones && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                </h3>
                <AddZoneModal
                    tenant={tenant}
                    method={method}
                    isOpen={isDialogOpen}
                    setIsOpen={setIsDialogOpen}
                    handleProtectedAction={handleProtectedAction}
                />
            </div>

            <div className="space-y-3">
                {Object.values(groupedZones).map((group) => {
                    const fullDeptZone = group.zones.find((z) => !z.city_code);

                    return (
                        <div key={group.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-sm text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    {group.name}
                                </h4>
                                {fullDeptZone && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Eliminar todo el departamento?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta acción eliminará la cobertura para todo el departamento de {group.name}.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction variant="destructive" onClick={() => fullDeptZone.id != null && handleDeleteZone(fullDeptZone.id)}>
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>

                            {fullDeptZone ? (
                                <Badge variant="secondary" className="text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 flex items-center justify-between gap-2 py-1 px-3">
                                    <span>Todo el departamento</span>
                                    {fullDeptZone.price && (
                                        <span className="font-black text-blue-800">
                                            ${new Intl.NumberFormat('es-CO').format(fullDeptZone.price)}
                                        </span>
                                    )}
                                </Badge>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {group.zones.map((zone) => (
                                        <Badge key={zone.id} variant="outline" className="text-xs font-medium gap-1 pr-1 pl-3 py-1 bg-slate-50 flex items-center border-slate-200">
                                            {zone.city_name}
                                            {zone.price != null && (
                                                <span className="font-bold text-slate-900 ml-1 border-l border-slate-200 pl-2">
                                                    ${new Intl.NumberFormat('es-CO').format(zone.price)}
                                                </span>
                                            )}
                                            <AlertDialog open={zoneToDelete === zone.id} onOpenChange={(open) => !open && setZoneToDelete(null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-4 hover:bg-slate-200 rounded-full ml-1 text-slate-400 hover:text-red-600"
                                                        onClick={() => zone.id != null && setZoneToDelete(zone.id)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Eliminar esta ciudad?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Se quitará {zone.city_name} de la cobertura de envío.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction variant="destructive" onClick={() => zone.id != null && handleDeleteZone(zone.id)}>
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {(!method.zones || method.zones.length === 0) && (
                    <Empty className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <MapPin className="size-8 text-slate-400" />
                            </EmptyMedia>
                            <EmptyTitle>No hay zonas de cobertura</EmptyTitle>
                            <EmptyDescription>
                                Usa el botón &quot;Nueva Zona&quot; para agregar departamentos o ciudades.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>
        </div>
    );
}

function AddZoneModal({
    tenant,
    method,
    isOpen,
    setIsOpen,
    handleProtectedAction,
}: {
    tenant: TenantSlug;
    method: ShippingMethod;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    handleProtectedAction: (e: React.MouseEvent | null, permission: string, callback: () => void) => void;
}) {
    const { departments, cities, fetchCities, loadingDepts, loadingCities } = useColombiaApi();
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [selectedCities, setSelectedCities] = useState<City[]>([]);
    const [selectAllCities, setSelectAllCities] = useState(false);
    const [price, setPrice] = useState<number | ''>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (selectedDept) {
            fetchCities(selectedDept.id);
            setSelectedCities([]);
            setSelectAllCities(false);
            setPrice('');
        }
    }, [selectedDept]);

    const handleSave = () => {
        handleProtectedAction(null, 'shipping_zones.update', () => {
            if (!selectedDept) return;

            const currentZones = method.zones || [];
            const newZones: Omit<ShippingZone, 'id'>[] = [];
            const zonePrice = price === '' ? null : price;

            if (selectAllCities) {
                const exists = currentZones.some((z) =>
                    z.department_code === String(selectedDept.id) && z.city_code === null
                );

                if (!exists) {
                    newZones.push({
                        department_code: String(selectedDept.id),
                        department_name: selectedDept.name,
                        city_code: null,
                        city_name: null,
                        price: zonePrice
                    });
                }
            } else {
                selectedCities.forEach(city => {
                    const exists = currentZones.some((z) =>
                        z.department_code === String(selectedDept.id) &&
                        z.city_code === String(city.id)
                    );

                    if (!exists) {
                        newZones.push({
                            department_code: String(selectedDept.id),
                            department_name: selectedDept.name,
                            city_code: String(city.id),
                            city_name: city.name,
                            price: zonePrice
                        });
                    }
                });
            }

            if (newZones.length === 0) {
                toast.error('Las zonas seleccionadas ya existen.');
                return;
            }

            const newZonesList = [...currentZones, ...newZones];

            router.post(route('tenant.shipping.zones.update', { tenant: tenant.slug, method: method.id }), {
                zones: newZonesList,
            } as unknown as Record<string, import('@inertiajs/core').FormDataConvertible>, {
                preserveScroll: true,
                onStart: () => setIsSaving(true),
                onFinish: () => setIsSaving(false),
                onSuccess: () => {
                    toast.success(`${newZones.length} zona(s) agregada(s)`);
                    setIsOpen(false);
                    setSelectedDept(null);
                    setSelectedCities([]);
                    setSelectAllCities(false);
                    setPrice('');
                },
            });
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => handleProtectedAction(null, 'shipping_zones.create', () => setIsOpen(open))}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-dashed font-bold">
                    <Plus className="w-3.5 h-3.5" /> Nueva Zona
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-[425px] max-h-[90vh] overflow-y-auto sm:w-full">
                <DialogHeader>
                    <DialogTitle className="font-black text-xl">Agregar Cobertura</DialogTitle>
                    <DialogDescription>Selecciona los destinos nacionales permitidos.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500">Departamento</Label>
                        <Select onValueChange={(val) => {
                            const dept = departments.find(d => String(d.id) === val);
                            setSelectedDept(dept || null);
                        }}>
                            <SelectTrigger>
                                <SelectValue placeholder={loadingDepts ? "Cargando..." : "Selecciona Departamento"} />
                            </SelectTrigger>
                            <SelectContent>
                                <ScrollArea className="h-[200px]">
                                    {departments.map(dept => (
                                        <SelectItem key={dept.id} value={String(dept.id)}>{dept.name}</SelectItem>
                                    ))}
                                </ScrollArea>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedDept && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold uppercase text-slate-500">Ciudades ({selectAllCities ? 'Todas' : selectedCities.length})</Label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="select-all-mode"
                                        checked={selectAllCities}
                                        onCheckedChange={(checked) => {
                                            setSelectAllCities(checked);
                                            if (checked) setSelectedCities([]);
                                        }}
                                    />
                                    <Label htmlFor="select-all-mode" className="text-xs font-normal text-slate-500">
                                        Todo el departamento
                                    </Label>
                                </div>
                            </div>

                            {!selectAllCities && (
                                <MultiSelect
                                    options={cities.map(c => ({ label: c.name, value: String(c.id) }))}
                                    selected={selectedCities.map(c => String(c.id))}
                                    onChange={(vals) => {
                                        const newSelected = vals.map(id => cities.find(c => String(c.id) === id)).filter(Boolean) as City[];
                                        setSelectedCities(newSelected);
                                    }}
                                    placeholder="Seleccionar ciudades..."
                                    className="w-full"
                                />
                            )}

                            {selectAllCities && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 text-center font-medium">
                                    Aplicar a <strong>todo ({selectedDept.name})</strong>.
                                </div>
                            )}

                            <div className="pt-2">
                                <Label className="text-xs font-bold uppercase text-slate-500">Costo Especial (Opcional)</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-bold text-slate-400">$</span>
                                    <CurrencyInput
                                        placeholder={`Tarifa base: $${new Intl.NumberFormat('es-CO').format(method.cost)}`}
                                        value={price}
                                        onChange={setPrice}
                                        className="h-10"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                                    Si lo dejas vacío, se cobrará el costo base configurado en el método.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={!selectedDept || (!selectAllCities && selectedCities.length === 0) || isSaving} className="w-full sm:w-auto bg-slate-900 gap-2">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Agregar {selectAllCities ? 'Todo el Depto' : `${selectedCities.length} Zona(s)`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function CurrencyInput({
    value,
    onChange,
    className,
    placeholder,
    ...props
}: {
    value: number | '';
    onChange: (value: number | '') => void;
    className?: string;
    placeholder?: string;
}) {
    const format = (val: string | number) => {
        if (val === '' || val === null || val === undefined) return '';
        const numberVal = Number(val);
        if (isNaN(numberVal)) return '';
        return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(numberVal);
    };

    const handleChange = (e: any) => {
        let raw = e.target.value;
        if (raw.includes(',')) raw = raw.split(',')[0];
        raw = raw.replace(/\./g, '');
        if (raw === '') { onChange(''); return; }
        if (isNaN(Number(raw))) return;
        onChange(Number(raw));
    };

    return (
        <Input
            type="text"
            className={className}
            placeholder={placeholder}
            value={format(value)}
            onChange={handleChange}
        />
    );
}
