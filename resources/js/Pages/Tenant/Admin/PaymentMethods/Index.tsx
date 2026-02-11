import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Switch } from '@/Components/ui/switch';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import {
    Banknote,
    CreditCard,
    Smartphone,
    Plus,
    Trash2,
    Edit,
    Save,
    AlertCircle,
    Copy,
    Building2,
    Globe
} from 'lucide-react';
import { toast } from 'sonner';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTitle as AlertDialogTitleComp,
} from "@/Components/ui/alert-dialog";

interface PaymentMethod {
    id: number;
    type: string;
    is_active: boolean;
    settings: any;
    location_id: number | null;
    location?: any;
}

interface BankAccount {
    id: number;
    bank_name: string;
    account_type: string;
    account_number: string;
    account_holder: string;
    holder_id?: string;
    is_active: boolean;
    location_id: number | null;
    location?: any;
}

interface Props {
    tenant: any;
    paymentMethods: PaymentMethod[];
    bankAccounts: BankAccount[];
    locations: any[];
}

export default function Index({ tenant, paymentMethods, bankAccounts, locations }: Props) {
    const { currentUserRole } = usePage<PageProps>().props;
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState<BankAccount | null>(null);

    const hasPermission = (permission: string) => {
        return currentUserRole?.permissions?.includes(permission);
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

    // Configura los métodos por tipo para fácil acceso
    const getMethod = (type: string) => paymentMethods.find(m => m.type === type);
    const transferMethod = getMethod('bank_transfer');
    const cashMethod = getMethod('cash');
    const dataphoneMethod = getMethod('dataphone');

    const toggleMethod = (method: PaymentMethod, isActive: boolean) => {
        if (!hasPermission('payment_methods.update')) {
            setShowPermissionModal(true);
            return;
        }

        router.put(route('tenant.payment-methods.update.method', { tenant: tenant.slug, method: method.id }), {
            is_active: isActive,
            settings: method.settings,
            location_id: method.location_id
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => toast.success(isActive ? 'Método activado' : 'Método desactivado'),
            onError: () => toast.error('Error actualizando método')
        });
    };

    const updateSettings = (method: PaymentMethod, newSettings: any) => {
        if (!hasPermission('payment_methods.update')) {
            setShowPermissionModal(true);
            return;
        }

        router.put(route('tenant.payment-methods.update.method', { tenant: tenant.slug, method: method.id }), {
            is_active: method.is_active,
            location_id: method.location_id,
            settings: { ...method.settings, ...newSettings }
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => toast.success('Configuración actualizada'),
            onError: () => toast.error('Error actualizando configuración')
        });
    };

    const confirmDeleteAccount = () => {
        if (!accountToDelete) return;

        router.delete(route('tenant.payment-methods.accounts.destroy', { tenant: tenant.slug, account: accountToDelete.id }), {
            onSuccess: () => {
                toast.success('Cuenta eliminada');
                setAccountToDelete(null);
            }
        });
    };

    return (
        <AdminLayout title="Métodos de Pago">
            <Head title="Métodos de Pago - Linkiu.Bio" />

            <div className="max-w-5xl mx-auto py-8 text-slate-900">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Métodos de Pago</h1>
                    <p className="text-slate-500 font-medium">Define cómo quieres recibir el dinero de tus clientes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Transferencia Bancaria */}
                    <Card className={`border-2 transition-all ${transferMethod?.is_active ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-slate-100'}`}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <Switch
                                    checked={transferMethod?.is_active}
                                    onCheckedChange={(checked) => transferMethod && toggleMethod(transferMethod, checked)}
                                />
                            </div>
                            <CardTitle className="mt-4">Transferencia Bancaria</CardTitle>
                            <CardDescription>Nequi, Daviplata, Bancolombia, etc.</CardDescription>
                        </CardHeader>
                        {transferMethod?.is_active && (
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Exigir Comprobante</Label>
                                    <Switch
                                        checked={transferMethod.settings?.require_proof ?? true}
                                        onCheckedChange={(checked) => updateSettings(transferMethod, { require_proof: checked })}
                                    />
                                </div>
                                <div className="pt-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold">Cuentas ({bankAccounts.length})</h4>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs gap-1"
                                            onClick={(e) => handleProtectedAction(e, 'payment_methods.create', () => setShowAddModal(true))}
                                        >
                                            <Plus className="w-3 h-3" /> Agregar
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                        {bankAccounts.map(account => (
                                            <AccountItem
                                                key={account.id}
                                                account={account}
                                                onDelete={(a) => handleProtectedAction(null, 'payment_methods.delete', () => setAccountToDelete(a))}
                                                onEdit={(a) => handleProtectedAction(null, 'payment_methods.update', () => setAccountToEdit(a))}
                                            />
                                        ))}
                                        {bankAccounts.length === 0 && (
                                            <p className="text-xs text-slate-400 text-center py-4 italic" >No tienes cuentas registradas.</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* 2. Efectivo */}
                    <Card className={`border-2 transition-all ${cashMethod?.is_active ? 'border-green-500/50 shadow-lg shadow-green-500/5' : 'border-slate-100'}`}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                                    <Banknote className="w-6 h-6" />
                                </div>
                                <Switch
                                    checked={cashMethod?.is_active}
                                    onCheckedChange={(checked) => cashMethod && toggleMethod(cashMethod, checked)}
                                />
                            </div>
                            <CardTitle className="mt-4">Efectivo</CardTitle>
                            <CardDescription>Pago contra entrega o en caja.</CardDescription>
                        </CardHeader>
                        {cashMethod?.is_active && (
                            <CardContent>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <Label className="text-xs font-bold uppercase text-slate-500">Preguntar cuánto devuelta necesita</Label>
                                    <Switch
                                        checked={cashMethod.settings?.ask_change ?? true}
                                        onCheckedChange={(checked) => updateSettings(cashMethod, { ask_change: checked })}
                                    />
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* 3. Datafono */}
                    <Card className={`border-2 transition-all ${dataphoneMethod?.is_active ? 'border-purple-500/50 shadow-lg shadow-purple-500/5' : 'border-slate-100'}`}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <Switch
                                    checked={dataphoneMethod?.is_active}
                                    onCheckedChange={(checked) => dataphoneMethod && toggleMethod(dataphoneMethod, checked)}
                                />
                            </div>
                            <CardTitle className="mt-4">Datáfono</CardTitle>
                            <CardDescription>Llevamos terminal para tarjetas.</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <PermissionDeniedModal
                    open={showPermissionModal}
                    onOpenChange={setShowPermissionModal}
                />

                <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitleComp>¿Seguro que deseas eliminar esta cuenta?</AlertDialogTitleComp>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. La cuenta bancaria será eliminada permanentemente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteAccount} className="bg-red-600 hover:bg-red-700">
                                Eliminar Cuenta
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AddAccountModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    locations={locations}
                    tenant={tenant}
                />

                {accountToEdit && (
                    <EditAccountModal
                        isOpen={!!accountToEdit}
                        onClose={() => setAccountToEdit(null)}
                        account={accountToEdit}
                        locations={locations}
                        tenant={tenant}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

function AccountItem({ account, onDelete, onEdit }: { account: BankAccount, onDelete: (a: BankAccount) => void, onEdit: (a: BankAccount) => void }) {
    return (
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center group">
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{account.bank_name}</span>
                    <Badge variant="secondary" className="text-[9px] h-4 px-1">{account.account_type}</Badge>
                    {account.location && (
                        <Badge variant="outline" className="text-[9px] h-4 px-1 border-primary/20 bg-primary/5 text-primary">
                            <Building2 className="w-2 h-2 mr-1" />
                            {account.location.name}
                        </Badge>
                    )}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                    {account.account_number}
                    <Copy className="w-3 h-3 cursor-pointer hover:text-primary" onClick={() => {
                        navigator.clipboard.writeText(account.account_number);
                        toast.success('Copiado');
                    }} />
                </div>
                {account.account_holder && <div className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{account.account_holder}</div>}
            </div>
            <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(account)}>
                    <Edit className="w-3.5 h-3.5 text-slate-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(account)}>
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
    );
}

function AddAccountModal({ isOpen, onClose, locations, tenant }: { isOpen: boolean, onClose: () => void, locations: any[], tenant: any }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        bank_name: '',
        account_type: 'Ahorros', // 'Ahorros', 'Corriente', 'Depósito Electrónico'
        account_number: '',
        account_holder: '',
        holder_id: '',
        location_id: '' as string | number,
        is_active: true
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.payment-methods.accounts.store', { tenant: tenant.slug }), {
            onSuccess: () => {
                toast.success('Cuenta agregada');
                onClose();
                reset();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nueva Cuenta Bancaria</DialogTitle>
                    <DialogDescription>Aqué cuenta deben transferir tus clientes?</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Banco</Label>
                            <Select value={data.bank_name} onValueChange={v => setData('bank_name', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nequi">Nequi</SelectItem>
                                    <SelectItem value="Daviplata">Daviplata</SelectItem>
                                    <SelectItem value="Bancolombia">Bancolombia</SelectItem>
                                    <SelectItem value="Davivienda">Davivienda</SelectItem>
                                    <SelectItem value="BBVA">BBVA</SelectItem>
                                    <SelectItem value="Bre-b">Bre-b</SelectItem>
                                    <SelectItem value="Otros">Otros</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.bank_name && <p className="text-red-500 text-xs">{errors.bank_name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select value={data.account_type} onValueChange={v => setData('account_type', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ahorros">Ahorros</SelectItem>
                                    <SelectItem value="Corriente">Corriente</SelectItem>
                                    <SelectItem value="Depósito Electrónico">Depósito Electrónico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Número de Cuenta (o Celular)</Label>
                        <Input value={data.account_number} onChange={e => setData('account_number', e.target.value)} placeholder="Ej: 3001234567" />
                        {errors.account_number && <p className="text-red-500 text-xs">{errors.account_number}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Titular</Label>
                            <Input value={data.account_holder} onChange={e => setData('account_holder', e.target.value)} />
                            {errors.account_holder && <p className="text-red-500 text-xs">{errors.account_holder}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Cédula/NIT (Opcional)</Label>
                            <Input value={data.holder_id} onChange={e => setData('holder_id', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Sede Asociada (Multisede)</Label>
                        <Select value={data.location_id.toString()} onValueChange={v => setData('location_id', v)}>
                            <SelectTrigger className="bg-slate-50 border-primary/20 focus:ring-primary">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary" />
                                    <SelectValue placeholder="Todas las sedes (Global)" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las sedes (Global)</SelectItem>
                                {locations.map(loc => (
                                    <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-slate-400">Si seleccionas una sede, esta cuenta solo aparecerá en pedidos de esa sede.</p>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>Guardar Cuenta</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditAccountModal({ isOpen, onClose, account, locations, tenant }: { isOpen: boolean, onClose: () => void, account: BankAccount, locations: any[], tenant: any }) {
    const { data, setData, put, processing, errors } = useForm({
        bank_name: account.bank_name,
        account_type: account.account_type,
        account_number: account.account_number,
        account_holder: account.account_holder,
        holder_id: account.holder_id || '',
        location_id: (account.location_id || 'all') as string | number,
        is_active: account.is_active
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('tenant.payment-methods.accounts.update', { tenant: tenant.slug, account: account.id }), {
            ...data,
            location_id: data.location_id === 'all' ? null : data.location_id
        }, {
            onSuccess: () => {
                toast.success('Cuenta actualizada');
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Cuenta</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Banco</Label>
                            <Select value={data.bank_name} onValueChange={v => setData('bank_name', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nequi">Nequi</SelectItem>
                                    <SelectItem value="Daviplata">Daviplata</SelectItem>
                                    <SelectItem value="Bancolombia">Bancolombia</SelectItem>
                                    <SelectItem value="Davivienda">Davivienda</SelectItem>
                                    <SelectItem value="BBVA">BBVA</SelectItem>
                                    <SelectItem value="Bre-b">Bre-b</SelectItem>
                                    <SelectItem value="Otros">Otros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select value={data.account_type} onValueChange={v => setData('account_type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Ahorros">Ahorros</SelectItem>
                                    <SelectItem value="Corriente">Corriente</SelectItem>
                                    <SelectItem value="Depósito Electrónico">Depósito Electrónico</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Número</Label>
                        <Input value={data.account_number} onChange={e => setData('account_number', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Titular</Label>
                            <Input value={data.account_holder} onChange={e => setData('account_holder', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>ID (Opcional)</Label>
                            <Input value={data.holder_id} onChange={e => setData('holder_id', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Sede Asociada (Multisede)</Label>
                        <Select value={data.location_id.toString()} onValueChange={v => setData('location_id', v)}>
                            <SelectTrigger className="bg-slate-50 border-primary/20 focus:ring-primary">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary" />
                                    <SelectValue placeholder="Todas las sedes (Global)" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las sedes (Global)</SelectItem>
                                {locations.map(loc => (
                                    <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-slate-400">Si seleccionas una sede, esta cuenta solo aparecerá en pedidos de esa sede.</p>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
