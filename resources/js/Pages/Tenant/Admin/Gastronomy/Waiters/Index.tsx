import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import {
    Plus,
    Minus,
    Trash2,
    Utensils,
    Table as TableIcon,
    Send,
    Search,
    UtensilsCrossed,
    ArrowLeft,
    ConciergeBell,
    AlertCircle,
    StickyNote,
    Package,
    Loader2,
    Clock,
    X,
    Bell,
    CheckCircle,
    Receipt,
    CreditCard,
    Banknote,
    Camera,
    Wallet,
    Copy,
    ImageIcon,
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Tenant, Product, Category, Location, TaxSettings, Table, Zone, VariantGroup, VariantOption, OrderItemData, EchoInstance, EchoChannel } from '@/types/pos';
import { formatCurrency, calculateTax } from '@/utils/currency';

interface WaiterCartItem {
    id: string;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    variant_options: VariantOption[];
    notes: string;
    is_sent?: boolean;
}

interface WaiterPaymentMethod {
    id: number;
    type: string; // 'cash' | 'bank_transfer' | 'dataphone'
    is_active: boolean;
    settings: Record<string, unknown>;
}

interface WaiterBankAccount {
    id: number;
    bank_name: string;
    account_type: string;
    account_number: string;
    account_holder: string;
    holder_id: string;
    is_active: boolean;
}

interface Props extends PageProps {
    categories: Category[];
    zones: Zone[];
    tenant: Tenant;
    locations: Location[];
    currentLocationId: number | null;
    taxSettings: TaxSettings;
    paymentMethods?: WaiterPaymentMethod[];
    bankAccounts?: WaiterBankAccount[];
}

export default function WaiterIndex({ categories, zones: initialZones, tenant, locations = [], currentLocationId, taxSettings, paymentMethods = [], bankAccounts = [] }: Props) {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [cart, setCart] = useState<WaiterCartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationId, setLocationId] = useState<number | null>(currentLocationId);
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [tableSearch, setTableSearch] = useState('');
    const [serviceType, setServiceType] = useState<'dine_in' | 'takeout'>('dine_in');

    // Estado local de zonas (para actualizar mesas sin recargar)
    const [localZones, setLocalZones] = useState<Zone[]>(initialZones);

    // Confirmación antes de enviar
    const [confirmSendOpen, setConfirmSendOpen] = useState(false);
    // Confirmación antes de limpiar
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);
    // Protección al salir
    const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
    const [pendingLeaveUrl, setPendingLeaveUrl] = useState('');

    // Variant Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [modalQuantity, setModalQuantity] = useState(1);
    const [modalSelectedVariants, setModalSelectedVariants] = useState<Record<number, number[]>>({});
    const [modalNotes, setModalNotes] = useState('');

    // Tracking de órdenes listas vía cocina
    const [readyOrderIds, setReadyOrderIds] = useState<Set<number>>(new Set());
    // IDs de órdenes que el mesero ha creado en esta sesión (para suscribirse vía Echo)
    const [sessionOrderIds, setSessionOrderIds] = useState<Set<number>>(new Set());

    // Pre-cuenta / Pago
    const [showBillModal, setShowBillModal] = useState(false);
    const [billPaymentMethod, setBillPaymentMethod] = useState<string>('');
    const [billPaymentRef, setBillPaymentRef] = useState('');
    const [billProofFile, setBillProofFile] = useState<File | null>(null);
    const [billProofPreview, setBillProofPreview] = useState<string>('');
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

    // Skeleton
    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoaded(true), 200);
        return () => clearTimeout(timer);
    }, []);

    // --- Sonido de notificación ---
    const playNotificationSound = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();
            [830, 1046, 1318].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.18);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.18 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.18);
                osc.stop(ctx.currentTime + i * 0.18 + 0.3);
            });
        } catch { /* Audio no disponible */ }
    }, []);

    // --- IDs de TODAS las órdenes activas (de la página + de la sesión) ---
    const allActiveOrderIds = useMemo(() => {
        const ids = new Set<number>();
        localZones.forEach(zone => {
            zone.tables.forEach(table => {
                if (table.active_order?.id) ids.add(table.active_order.id);
            });
        });
        sessionOrderIds.forEach(id => ids.add(id));
        return Array.from(ids);
    }, [localZones, sessionOrderIds]);

    // Refs para lookup dentro de Echo callbacks (evita re-suscripciones innecesarias)
    const zonesRef = useRef(localZones);
    useEffect(() => { zonesRef.current = localZones; }, [localZones]);
    const selectedTableRef = useRef(selectedTable);
    useEffect(() => { selectedTableRef.current = selectedTable; }, [selectedTable]);

    // --- Echo/Ably: escuchar cambios de estado en órdenes activas ---
    useEffect(() => {
        const echoInstance = (window as unknown as Record<string, unknown>).Echo as EchoInstance | undefined;
        if (!echoInstance?.connector || !tenant.id || allActiveOrderIds.length === 0) return;

        const subscribedChannels: string[] = [];

        allActiveOrderIds.forEach(orderId => {
            const channelName = `tenant.${tenant.id}.orders.${orderId}`;
            try {
                echoInstance.channel(channelName)
                    .listen('.order.status.updated', (e: Record<string, unknown>) => {
                        const data = e as { id: number; status: string; comment?: string };

                        if (data.comment === 'payment_verified') {
                            // Caja verificó el pago — liberar mesa localmente
                            playNotificationSound();
                            let tableName = '';
                            zonesRef.current.forEach(zone => {
                                zone.tables.forEach(table => {
                                    if (table.active_order?.id === data.id) tableName = table.name;
                                });
                            });
                            toast.success(`Pago verificado — ${tableName || `Pedido #${data.id}`} completado`, {
                                id: `verified-${data.id}`,
                                duration: 15000,
                                description: 'Caja aprobó el pago. Mesa liberada.',
                                style: { background: '#ecfdf5', border: '2px solid #059669', fontWeight: 'bold' },
                            });
                            // Liberar mesa localmente
                            setLocalZones(prev => prev.map(zone => ({
                                ...zone,
                                tables: zone.tables.map(t => {
                                    if (t.active_order?.id === data.id) {
                                        return { ...t, status: 'available' as const, active_order: undefined };
                                    }
                                    return t;
                                })
                            })));
                            setReadyOrderIds(prev => { const next = new Set(prev); next.delete(data.id); return next; });
                            // Si estoy viendo esa mesa, limpiar cart y selección
                            if (selectedTableRef.current?.active_order?.id === data.id) {
                                setCart([]);
                                setSelectedTable(null);
                            }
                        } else if (data.status === 'ready') {
                            setReadyOrderIds(prev => new Set(prev).add(data.id));
                            playNotificationSound();
                            let tableName = '';
                            zonesRef.current.forEach(zone => {
                                zone.tables.forEach(table => {
                                    if (table.active_order?.id === data.id) tableName = table.name;
                                });
                            });
                            toast.success(`Pedido ${tableName ? tableName : `#${data.id}`} LISTO`, {
                                id: `ready-${data.id}`,
                                duration: 20000,
                                description: 'Cocina lo despachó — llévaselo al cliente',
                                style: { background: '#ecfdf5', border: '2px solid #10b981', fontWeight: 'bold' },
                            });
                        } else if (data.status === 'preparing') {
                            toast.info(`Pedido #${data.id} en preparación`, { id: `preparing-${data.id}`, duration: 5000 });
                        }
                    });
                subscribedChannels.push(channelName);
            } catch (err) {
                console.error('[Echo] Error subscribing to channel:', channelName, err);
            }
        });

        return () => {
            subscribedChannels.forEach(ch => {
                try { echoInstance.leave(ch); } catch { /* ignore */ }
            });
        };
    }, [tenant.id, allActiveOrderIds, playNotificationSound]);

    // --- Al seleccionar mesa ocupada, cargar items existentes ---
    const handleTableSelect = (table: Table) => {
        setSelectedTable(table);
        // Si la mesa tiene una orden activa con items, cargarlos como "ya enviados"
        if (table.active_order?.items && table.active_order.items.length > 0) {
            const existingItems: WaiterCartItem[] = table.active_order.items.map((item: OrderItemData) => ({
                id: `sent-${item.id}`,
                product_id: item.product_id,
                product_name: item.product_name,
                price: parseFloat(String(item.price)),
                quantity: item.quantity,
                variant_options: typeof item.variant_options === 'string' ? JSON.parse(item.variant_options) : (item.variant_options as VariantOption[] || []),
                notes: (item.notes as string) || '',
                is_sent: true,
            }));
            // Mantener items nuevos del carrito (no enviados) + items ya enviados
            setCart(prev => {
                const unsent = prev.filter(i => !i.is_sent);
                return [...existingItems, ...unsent];
            });
        } else {
            // Mesa sin orden activa: limpiar items enviados, mantener nuevos
            setCart(prev => prev.filter(i => !i.is_sent));
        }
    };

    // Protección al salir con carrito lleno
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (cart.length > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [cart.length]);

    // Usuario
    const userName = (usePage().props.auth?.user as { name?: string } | undefined)?.name || 'Mesero';

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return null;
        const results: Product[] = [];
        categories.forEach(cat => {
            if (cat.products) {
                cat.products.forEach(prod => {
                    if (prod.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                        results.push(prod);
                    }
                });
            }
        });
        return results;
    }, [categories, searchQuery]);

    // -- Tax calculation (solo items nuevos para el botón de enviar) --
    const { subtotal: cartSubtotal, taxAmount: cartTaxAmount, grandTotal: cartGrandTotal } = useMemo(() => {
        const newOnly = cart.filter(i => !i.is_sent);
        const baseTotal = newOnly.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return calculateTax(baseTotal, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false);
    }, [cart, taxSettings]);

    // Total general de la mesa (enviados + nuevos) para informar al mesero
    const tableGrandTotal = useMemo(() => {
        const allTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const { grandTotal } = calculateTax(allTotal, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false);
        return grandTotal;
    }, [cart, taxSettings]);

    // When clicking a product: open modal for variants + notes
    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setModalQuantity(1);
        setModalSelectedVariants({});
        setModalNotes('');
        setShowVariantModal(true);
    };

    // Calculate unit price inside modal
    const modalUnitPrice = useMemo(() => {
        if (!selectedProduct) return 0;
        let total = Number(selectedProduct.price);
        if (selectedProduct.variant_groups) {
            selectedProduct.variant_groups.forEach(group => {
                const selectedOptionIds = modalSelectedVariants[group.id] || [];
                selectedOptionIds.forEach(optionId => {
                    const option = group.options.find(o => o.id === optionId);
                    if (option) total += Number(option.price_adjustment);
                });
            });
        }
        return total;
    }, [selectedProduct, modalSelectedVariants]);

    const handleVariantChange = (groupId: number, optionId: number, type: 'radio' | 'checkbox') => {
        setModalSelectedVariants(prev => {
            const currentSelected = prev[groupId] || [];
            if (type === 'radio') return { ...prev, [groupId]: [optionId] };
            if (currentSelected.includes(optionId)) return { ...prev, [groupId]: currentSelected.filter(id => id !== optionId) };
            return { ...prev, [groupId]: [...currentSelected, optionId] };
        });
    };

    const handleModalConfirm = () => {
        if (!selectedProduct) return;

        // Validate required variants
        if (selectedProduct.variant_groups) {
            for (const group of selectedProduct.variant_groups) {
                if (group.is_required) {
                    const selected = modalSelectedVariants[group.id] || [];
                    if (selected.length < group.min_selection) {
                        toast.error(`Selecciona al menos ${group.min_selection} opción en ${group.name}`);
                        return;
                    }
                }
            }
        }

        // Build variant_options array
        const variantOptions: VariantOption[] = [];
        if (selectedProduct.variant_groups) {
            selectedProduct.variant_groups.forEach(group => {
                const selectedList = modalSelectedVariants[group.id] || [];
                selectedList.forEach(optId => {
                    const opt = group.options.find(o => o.id === optId);
                    if (opt) {
                        variantOptions.push({
                            id: opt.id,
                            name: `${group.name}: ${opt.name}`,
                            price_adjustment: opt.price_adjustment,
                            price: Number(opt.price_adjustment),
                            group_name: group.name,
                            option_name: opt.name,
                        });
                    }
                });
            });
        }

        const itemId = `item-${Date.now()}-${Math.random()}`;
        const newItem: WaiterCartItem = {
            id: itemId,
            product_id: selectedProduct.id,
            product_name: selectedProduct.name,
            price: modalUnitPrice,
            quantity: modalQuantity,
            variant_options: variantOptions,
            notes: modalNotes.trim(),
        };

        setCart(prev => [...prev, newItem]);
        toast.success(`Añadido: ${selectedProduct.name}`);
        setShowVariantModal(false);
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const newItems = useMemo(() => cart.filter(i => !i.is_sent), [cart]);

    const handleClearCart = () => {
        if (newItems.length === 0) return;
        setConfirmClearOpen(true);
    };

    const confirmClearAction = () => {
        // Solo limpiar items nuevos, mantener los ya enviados a cocina
        setCart(prev => prev.filter(i => i.is_sent));
        setConfirmClearOpen(false);
    };

    const handleSubmit = () => {
        if (serviceType === 'dine_in' && !selectedTable) {
            toast.error('Selecciona una mesa primero');
            return;
        }
        if (newItems.length === 0) {
            toast.error('No hay productos nuevos para enviar');
            return;
        }
        setConfirmSendOpen(true);
    };

    const confirmSubmit = async () => {
        setConfirmSendOpen(false);
        setIsSubmitting(true);

        try {
            const response = await axios.post(route('tenant.admin.waiters.store', { tenant: tenant.slug }), {
                service_type: serviceType,
                table_id: serviceType === 'dine_in' ? selectedTable?.id : null,
                customer_name: serviceType === 'dine_in' && selectedTable
                    ? `Mesa ${selectedTable.name}`
                    : 'Mostrador',
                location_id: locationId,
                items: newItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    variant_options: item.variant_options,
                    notes: item.notes || undefined,
                })),
                send_to_kitchen: true,
            });

            if (response.data.success) {
                const orderId = response.data.order_id as number | undefined;
                const orderTotal = response.data.total as number | undefined;

                // Convertir items nuevos a "enviados" en el carrito (no borrarlos)
                const sentItems = cart.filter(i => i.is_sent);
                const justSentItems: WaiterCartItem[] = newItems.map((item, idx) => ({
                    ...item,
                    id: `sent-new-${Date.now()}-${idx}`,
                    is_sent: true,
                }));
                const allSentItems = [...sentItems, ...justSentItems];

                // Actualizar estado local de la mesa a "occupied" con TODOS los items
                if (serviceType === 'dine_in' && selectedTable) {
                    const tableId = selectedTable.id;
                    const existingCreatedAt = selectedTable.active_order?.created_at || new Date().toISOString();

                    setLocalZones(prev => prev.map(zone => ({
                        ...zone,
                        tables: zone.tables.map(t => {
                            if (t.id === tableId) {
                                return {
                                    ...t,
                                    status: 'occupied' as const,
                                    active_order: {
                                        id: orderId || t.active_order?.id || 0,
                                        table_id: tableId,
                                        customer_name: `Mesa ${t.name}`,
                                        total: orderTotal || 0,
                                        status: 'confirmed',
                                        created_at: existingCreatedAt,
                                        items: allSentItems.map((item, idx) => ({
                                            id: idx + 1,
                                            product_id: item.product_id,
                                            product_name: item.product_name,
                                            quantity: item.quantity,
                                            price: item.price,
                                            total: item.price * item.quantity,
                                            variant_options: item.variant_options,
                                            notes: item.notes,
                                        })),
                                    },
                                };
                            }
                            return t;
                        }),
                    })));

                    // Registrar orden para suscribirse vía Echo
                    if (orderId) {
                        setSessionOrderIds(prev => new Set(prev).add(orderId));
                    }

                    // La orden ya fue "ready" y ahora tiene nuevos items → quitar de readyOrderIds
                    if (orderId && readyOrderIds.has(orderId)) {
                        setReadyOrderIds(prev => {
                            const next = new Set(prev);
                            next.delete(orderId);
                            return next;
                        });
                    }
                }

                toast.success('✅ Pedido enviado a cocina');
                // Mantener todos los items como "enviados" en el carrito
                setCart(allSentItems);

                if (serviceType === 'takeout') {
                    setSelectedTable(null);
                    setServiceType('dine_in');
                }
                // Para dine_in: mantener mesa seleccionada para ver el acumulado
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0];
                toast.error(Array.isArray(firstError) ? firstError[0] : String(firstError));
            } else {
                toast.error('Error al enviar pedido');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLocationChange = (val: string) => {
        window.location.href = route('tenant.admin.waiters.index', {
            tenant: tenant.slug,
            location_id: val,
        });
    };

    // --- Pre-cuenta ---
    const handleOpenBill = () => {
        if (!selectedTable?.active_order) {
            toast.error('Esta mesa no tiene pedido activo');
            return;
        }
        setBillPaymentMethod('');
        setBillPaymentRef('');
        setBillProofFile(null);
        setBillProofPreview('');
        setShowBillModal(true);
    };

    const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBillProofFile(file);
        const reader = new FileReader();
        reader.onload = () => setBillProofPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmitPayment = async () => {
        if (!selectedTable?.active_order?.id || !billPaymentMethod) return;
        setIsSubmittingPayment(true);
        try {
            const formData = new FormData();
            formData.append('order_id', String(selectedTable.active_order.id));
            formData.append('payment_method', billPaymentMethod);
            if (billPaymentRef) formData.append('payment_reference', billPaymentRef);
            if (billProofFile) formData.append('payment_proof', billProofFile);

            await axios.post(
                route('tenant.admin.waiters.payment-proof', { tenant: tenant.slug }),
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            toast.success('Pago registrado — caja lo verificará');
            setShowBillModal(false);

            // Actualizar el estado local para que la mesa refleje "waiter_collected"
            setLocalZones(prev => prev.map(zone => ({
                ...zone,
                tables: zone.tables.map(t => {
                    if (t.id === selectedTable?.id && t.active_order) {
                        return { ...t, active_order: { ...t.active_order, waiter_collected: true } };
                    }
                    return t;
                })
            })));
        } catch {
            toast.error('Error al registrar el pago');
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copiado al portapapeles');
    };

    const paymentMethodLabels: Record<string, { label: string; icon: React.ReactNode }> = {
        cash: { label: 'Efectivo', icon: <Banknote className="w-5 h-5" /> },
        bank_transfer: { label: 'Transferencia', icon: <Wallet className="w-5 h-5" /> },
        dataphone: { label: 'Datáfono', icon: <CreditCard className="w-5 h-5" /> },
    };

    const activePaymentTypes = paymentMethods.filter(m => m.is_active).map(m => m.type);

    // Elapsed time for occupied tables
    const getElapsedTime = (createdAt: string): string => {
        const start = new Date(createdAt);
        const now = new Date();
        const diffMs = now.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}m`;
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h${mins}m`;
    };

    return (
        <AdminLayout hideSidebar hideNavbar hideFooter maxwidth="w-full h-screen">
            <Head title="Panel de Meseros" />

            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full" asChild>
                            <Link href={route('tenant.dashboard', { tenant: tenant.slug })}>
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ConciergeBell className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">PANEL DE MESEROS</h1>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión de Mesas y Comandas</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sede selector */}
                        {locations.length > 1 && (
                            <Select value={String(locationId || '')} onValueChange={handleLocationChange}>
                                <SelectTrigger className="w-[160px] h-9 bg-slate-50 border-slate-200 text-sm">
                                    <SelectValue placeholder="Sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* Service Type Toggle */}
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                            <button
                                onClick={() => {
                                    setServiceType('dine_in');
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${serviceType === 'dine_in' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <TableIcon className="w-3.5 h-3.5 inline mr-1" />
                                Mesa
                            </button>
                            <button
                                onClick={() => {
                                    setServiceType('takeout');
                                    setSelectedTable(null);
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${serviceType === 'takeout' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Package className="w-3.5 h-3.5 inline mr-1" />
                                Para llevar
                            </button>
                        </div>

                        <div className="h-8 w-px bg-slate-200 mx-1" />

                        {selectedTable && (
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Atendiendo</span>
                                <span className="text-sm font-black text-blue-600">Mesa {selectedTable.name}</span>
                            </div>
                        )}
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Sesión</span>
                            <span className="text-sm font-bold text-slate-700">{userName}</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                    {/* Left: Product Selection */}
                    <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar productos..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <ScrollArea className="flex-1 bg-white rounded-xl border border-slate-200 p-4">
                            {!isPageLoaded ? (
                                /* Skeleton */
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
                                    ))}
                                </div>
                            ) : searchQuery ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {filteredProducts && filteredProducts.length > 0 ? (
                                        filteredProducts.map(product => (
                                            <ProductCard key={product.id} product={product} onAdd={handleProductSelect} />
                                        ))
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                                            <Search className="w-10 h-10 mb-3 opacity-40" />
                                            <p className="text-sm font-medium">No se encontraron productos</p>
                                        </div>
                                    )}
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                    <AlertCircle className="w-12 h-12 mb-3 opacity-30" />
                                    <p className="text-sm font-bold">No hay categorías registradas</p>
                                </div>
                            ) : (
                                <Tabs defaultValue={categories[0]?.id.toString()} className="w-full">
                                    <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-slate-100/50 mb-4">
                                        {categories.map(cat => (
                                            <TabsTrigger key={cat.id} value={cat.id.toString()} className="py-2 px-4">
                                                {cat.name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {categories.map(cat => (
                                        <TabsContent key={cat.id} value={cat.id.toString()}>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {cat.products && cat.products.length > 0 ? (
                                                    cat.products.map(product => (
                                                        <ProductCard key={product.id} product={product} onAdd={handleProductSelect} />
                                                    ))
                                                ) : (
                                                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400">
                                                        <Utensils className="w-8 h-8 mb-2 opacity-30" />
                                                        <p className="text-sm font-medium">Sin productos en esta categoría</p>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Right: Table Selection & Cart */}
                    <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                        {/* Table Selection (solo en dine_in) */}
                        {serviceType === 'dine_in' && (
                            <Card className="shrink-0 border-slate-200">
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-500">
                                            <TableIcon className="w-4 h-4 text-blue-500" />
                                            Selección de Mesa
                                        </CardTitle>
                                        {/* Búsqueda de mesas */}
                                        <div className="relative">
                                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                            <Input
                                                placeholder="Buscar..."
                                                value={tableSearch}
                                                onChange={(e) => setTableSearch(e.target.value)}
                                                className="pl-7 h-7 w-[100px] text-xs bg-slate-50"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    {localZones.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                                            <TableIcon className="w-8 h-8 mb-2 opacity-30" />
                                            <p className="text-xs font-medium">No hay zonas ni mesas registradas</p>
                                        </div>
                                    ) : (
                                        <Tabs defaultValue={localZones[0]?.id.toString()} className="w-full">
                                            <TabsList className="w-full overflow-x-auto justify-start h-auto p-0.5 bg-slate-50 mb-3">
                                                {localZones.map(zone => (
                                                    <TabsTrigger key={zone.id} value={zone.id.toString()} className="text-[10px] uppercase py-1 px-2">
                                                        {zone.name}
                                                    </TabsTrigger>
                                                ))}
                                            </TabsList>
                                            {localZones.map(zone => (
                                                <TabsContent key={zone.id} value={zone.id.toString()} className="mt-0">
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {zone.tables
                                                            .filter(t => !tableSearch || t.name.toLowerCase().includes(tableSearch.toLowerCase()))
                                                            .map(table => (
                                                            <button
                                                                key={table.id}
                                                                onClick={() => handleTableSelect(table)}
                                                                className={cn(
                                                                    "flex flex-col items-center justify-center p-2 rounded-lg border text-sm transition-all relative",
                                                                    selectedTable?.id === table.id
                                                                        ? "bg-blue-600 border-blue-600 text-white shadow-md ring-2 ring-blue-100"
                                                                        : table.active_order?.waiter_collected
                                                                            ? "bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200"
                                                                            : (table.active_order?.id && readyOrderIds.has(table.active_order.id))
                                                                                ? "bg-green-100 border-green-400 text-green-800 ring-2 ring-green-200 animate-pulse"
                                                                                : (table.status === 'occupied'
                                                                                    ? "bg-amber-50 border-amber-200 text-amber-700"
                                                                                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300")
                                                                )}
                                                            >
                                                                <span className="font-bold">{table.name}</span>
                                                                {table.active_order?.waiter_collected && selectedTable?.id !== table.id && (
                                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                                        <Receipt className="w-3 h-3 text-emerald-600" />
                                                                        <span className="text-[8px] font-black text-emerald-700 uppercase">Cobrado</span>
                                                                    </div>
                                                                )}
                                                                {!table.active_order?.waiter_collected && table.active_order?.id && readyOrderIds.has(table.active_order.id) && selectedTable?.id !== table.id && (
                                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                                                        <span className="text-[8px] font-black text-green-700 uppercase">Listo</span>
                                                                    </div>
                                                                )}
                                                                {table.status === 'occupied' && table.active_order && !table.active_order.waiter_collected && !(table.active_order.id && readyOrderIds.has(table.active_order.id)) && (
                                                                    <div className="flex flex-col items-center mt-0.5">
                                                                        <span className="text-[8px] font-mono opacity-70">{getElapsedTime(table.active_order.created_at)}</span>
                                                                        <span className="text-[8px] font-bold">{formatCurrency(table.active_order.total)}</span>
                                                                    </div>
                                                                )}
                                                                {table.status === 'occupied' && !table.active_order && (
                                                                    <div className="w-1 h-1 rounded-full bg-amber-500 mt-1" />
                                                                )}
                                                            </button>
                                                        ))}
                                                        {zone.tables.filter(t => !tableSearch || t.name.toLowerCase().includes(tableSearch.toLowerCase())).length === 0 && (
                                                            <div className="col-span-full py-4 text-center text-xs text-slate-400">
                                                                {tableSearch ? 'Sin resultados' : 'Sin mesas'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Takeout Banner */}
                        {serviceType === 'takeout' && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
                                <Package className="w-8 h-8 text-indigo-600 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-indigo-900 text-sm">Pedido Para Llevar</h3>
                                    <p className="text-xs text-indigo-600">Sin mesa — directo a cocina</p>
                                </div>
                            </div>
                        )}

                        {/* Cart Section */}
                        <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm">
                            <CardHeader className="p-4 pb-2 bg-slate-50/50 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-500">
                                    <UtensilsCrossed className="w-4 h-4 text-green-500" />
                                    Pedido Actual
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {selectedTable && serviceType === 'dine_in' && (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                            Mesa {selectedTable.name}
                                        </Badge>
                                    )}
                                    {serviceType === 'takeout' && (
                                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200">
                                            Para llevar
                                        </Badge>
                                    )}
                                    {cart.length > 0 && (
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600" onClick={handleClearCart}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
                                <ScrollArea className="flex-1 px-4 py-2">
                                    {cart.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-40 text-slate-400 opacity-60">
                                            <Plus className="w-8 h-8 mb-2 border-2 border-dashed rounded-full p-1" />
                                            <p className="text-sm font-medium">Carrito vacío</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {/* Items ya enviados a cocina (read-only) */}
                                            {cart.filter(i => i.is_sent).length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 py-1">
                                                        <div className="h-px flex-1 bg-orange-200" />
                                                        <span className="text-[9px] font-bold uppercase text-orange-500 tracking-widest">En cocina</span>
                                                        <div className="h-px flex-1 bg-orange-200" />
                                                    </div>
                                                    {cart.filter(i => i.is_sent).map(item => (
                                                        <div key={item.id} className="flex flex-col gap-0.5 pb-2 border-b border-orange-100 last:border-0 opacity-70">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-medium text-xs text-slate-600 leading-tight">
                                                                    {item.quantity}x {item.product_name}
                                                                </span>
                                                                <span className="font-bold text-xs text-slate-500">
                                                                    {formatCurrency(item.price * item.quantity)}
                                                                </span>
                                                            </div>
                                                            {item.notes && (
                                                                <p className="text-[9px] text-amber-500 italic pl-3">→ {item.notes}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Items nuevos (editables) */}
                                            {cart.filter(i => !i.is_sent).length > 0 && (
                                                <div className="space-y-2">
                                                    {cart.filter(i => i.is_sent).length > 0 && (
                                                        <div className="flex items-center gap-2 py-1">
                                                            <div className="h-px flex-1 bg-blue-200" />
                                                            <span className="text-[9px] font-bold uppercase text-blue-500 tracking-widest">Nuevos</span>
                                                            <div className="h-px flex-1 bg-blue-200" />
                                                        </div>
                                                    )}
                                                    {cart.filter(i => !i.is_sent).map((item) => (
                                                        <div key={item.id} className="flex flex-col gap-1 pb-3 border-b border-slate-100 last:border-0">
                                                            <div className="flex justify-between items-start">
                                                                <span className="font-semibold text-sm text-slate-800 leading-tight">
                                                                    {item.product_name}
                                                                </span>
                                                                <span className="font-bold text-sm text-slate-900">
                                                                    {formatCurrency(item.price * item.quantity)}
                                                                </span>
                                                            </div>
                                                            {item.variant_options && item.variant_options.length > 0 && (
                                                                <p className="text-[10px] text-blue-600 font-medium leading-tight">
                                                                    {item.variant_options.map(v => v.option_name || v.name).join(' · ')}
                                                                </p>
                                                            )}
                                                            {item.notes && (
                                                                <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                                                                    <StickyNote className="w-3 h-3 inline" />
                                                                    {item.notes}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center justify-between mt-1">
                                                                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-white" onClick={() => updateQuantity(item.id, -1)}>
                                                                        <Minus className="w-3 h-3" />
                                                                    </Button>
                                                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-white" onClick={() => updateQuantity(item.id, 1)}>
                                                                        <Plus className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* Footer Cart */}
                                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                                    <div className="space-y-1">
                                        {/* Si hay items enviados, mostrar total de la mesa */}
                                        {cart.some(i => i.is_sent) && (
                                            <div className="flex justify-between items-center px-1 pb-1 mb-1 border-b border-dashed border-slate-200">
                                                <span className="text-slate-400 text-[10px] font-bold uppercase">Total Mesa</span>
                                                <span className="text-sm font-bold text-slate-600">{formatCurrency(tableGrandTotal)}</span>
                                            </div>
                                        )}
                                        {newItems.length > 0 && (
                                            <>
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-slate-500 text-xs">Nuevos - Subtotal</span>
                                                    <span className="text-sm font-medium">{formatCurrency(cartSubtotal)}</span>
                                                </div>
                                                {taxSettings && taxSettings.tax_rate > 0 && (
                                                    <div className="flex justify-between items-center px-1">
                                                        <span className="text-slate-500 text-xs">{taxSettings.tax_name} ({taxSettings.tax_rate}%)</span>
                                                        <span className="text-sm font-medium">{formatCurrency(cartTaxAmount)}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div className="flex justify-between items-center px-1 pt-1 border-t border-dashed border-slate-200">
                                            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                                {newItems.length > 0 ? 'Total Nuevos' : 'Total Mesa'}
                                            </span>
                                            <span className="text-xl font-black text-slate-900">
                                                {formatCurrency(newItems.length > 0 ? cartGrandTotal : tableGrandTotal)}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-200"
                                        disabled={newItems.length === 0 || (serviceType === 'dine_in' && !selectedTable) || isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5 mr-2" />
                                        )}
                                        {isSubmitting ? 'Enviando...' : newItems.length > 0 ? `ENVIAR ${newItems.length} NUEVO${newItems.length > 1 ? 'S' : ''} A COCINA` : 'ENVIAR A COCINA'}
                                    </Button>
                                    {/* Botón Pre-cuenta: solo si la mesa tiene orden activa */}
                                    {selectedTable?.active_order && cart.some(i => i.is_sent) && (
                                        selectedTable.active_order.waiter_collected ? (
                                            <Button
                                                variant="outline"
                                                disabled
                                                className="w-full h-10 border-amber-300 bg-amber-50 text-amber-700 font-bold cursor-not-allowed"
                                            >
                                                <Clock className="w-4 h-4 mr-2 animate-pulse" />
                                                EN APROBACIÓN — CAJA VERIFICANDO
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full h-10 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-bold"
                                                onClick={handleOpenBill}
                                            >
                                                <Receipt className="w-4 h-4 mr-2" />
                                                PRE-CUENTA / COBRAR
                                            </Button>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Variant & Notes Modal */}
            <Dialog open={showVariantModal} onOpenChange={setShowVariantModal}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl">
                    <DialogHeader className="p-4 border-b border-slate-100 flex-shrink-0">
                        <DialogTitle className="flex items-center justify-between">
                            <span className="font-bold text-lg text-slate-900">{selectedProduct?.name}</span>
                            <span className="text-lg font-black text-blue-600">{formatCurrency(modalUnitPrice)}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {selectedProduct?.variant_groups?.map(group => (
                            <div key={group.id} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 text-sm">{group.name}</h3>
                                    {group.is_required && (
                                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                            Requerido
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {group.options.map(option => {
                                        const isSelected = (modalSelectedVariants[group.id] || []).includes(option.id);
                                        const priceAdj = Number(option.price_adjustment);
                                        return (
                                            <label
                                                key={option.id}
                                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${isSelected
                                                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                                        {option.name}
                                                    </span>
                                                </div>
                                                <input
                                                    type={group.type === 'radio' ? 'radio' : 'checkbox'}
                                                    name={`group-${group.id}`}
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => handleVariantChange(group.id, option.id, group.type)}
                                                />
                                                {priceAdj > 0 && (
                                                    <span className="text-xs font-bold text-slate-600">+{formatCurrency(priceAdj)}</span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="space-y-2">
                            <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-amber-500" />
                                Nota para cocina
                            </label>
                            <Textarea
                                placeholder="Ej: Sin cebolla, extra salsa..."
                                value={modalNotes}
                                onChange={(e) => setModalNotes(e.target.value)}
                                className="resize-none h-20 text-sm"
                                maxLength={200}
                            />
                            <p className="text-[10px] text-slate-400 text-right">{modalNotes.length}/200</p>
                        </div>
                    </div>

                    <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50 flex-col sm:flex-row gap-3">
                        <div className="flex items-center justify-center bg-white rounded-xl border border-slate-200 h-12 w-full sm:w-auto px-1 shadow-sm">
                            <button onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))} className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-red-600">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-lg text-slate-900">{modalQuantity}</span>
                            <button onClick={() => setModalQuantity(modalQuantity + 1)} className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-blue-600">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <Button onClick={handleModalConfirm} className="flex-1 h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                            <span>Agregar {modalQuantity > 1 && `(${modalQuantity})`}</span>
                            <span className="ml-auto bg-black/20 px-2 py-0.5 rounded text-sm">
                                {formatCurrency(modalUnitPrice * modalQuantity)}
                            </span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmación Enviar */}
            <AlertDialog open={confirmSendOpen} onOpenChange={setConfirmSendOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Enviar pedido a cocina?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {newItems.length} producto{newItems.length > 1 ? 's' : ''} nuevo{newItems.length > 1 ? 's' : ''}.
                            {serviceType === 'dine_in' && selectedTable && <> Mesa: <strong>{selectedTable.name}</strong>.</>}
                            {serviceType === 'takeout' && <> Pedido para llevar.</>}
                            {' '}Esta acción enviará la comanda a cocina.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Revisar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
                            Sí, Enviar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirmación Vaciar */}
            <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Vaciar carrito?</AlertDialogTitle>
                        <AlertDialogDescription>Se eliminarán todos los productos del pedido actual.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmClearAction} className="bg-red-600 text-white hover:bg-red-700">
                            Sí, Vaciar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal Pre-cuenta / Pago del Mesero */}
            <Dialog open={showBillModal} onOpenChange={setShowBillModal}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl">
                    <DialogHeader className="p-4 border-b border-slate-100 flex-shrink-0">
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <Receipt className="w-5 h-5 text-emerald-600" />
                            Pre-cuenta — {selectedTable?.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-5">
                        {/* Resumen del pedido */}
                        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest mb-2">Detalle del pedido</h3>
                            {cart.filter(i => i.is_sent).map(item => (
                                <div key={item.id} className="flex justify-between items-baseline">
                                    <span className="text-sm text-slate-700">{item.quantity}x {item.product_name}</span>
                                    <span className="text-sm font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                            <div className="border-t border-dashed border-slate-200 pt-2 mt-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs text-slate-500">Subtotal</span>
                                    <span className="text-sm font-medium">{formatCurrency((() => {
                                        const sent = cart.filter(i => i.is_sent);
                                        const base = sent.reduce((s, i) => s + i.price * i.quantity, 0);
                                        return calculateTax(base, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false).subtotal;
                                    })())}</span>
                                </div>
                                {taxSettings && taxSettings.tax_rate > 0 && (
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-slate-500">{taxSettings.tax_name} ({taxSettings.tax_rate}%)</span>
                                        <span className="text-sm font-medium">{formatCurrency((() => {
                                            const sent = cart.filter(i => i.is_sent);
                                            const base = sent.reduce((s, i) => s + i.price * i.quantity, 0);
                                            return calculateTax(base, taxSettings?.tax_rate || 0, taxSettings?.price_includes_tax || false).taxAmount;
                                        })())}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 mt-2">
                                    <span className="text-sm font-black uppercase text-slate-800">Total</span>
                                    <span className="text-2xl font-black text-slate-900">{formatCurrency(tableGrandTotal)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Método de pago */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">¿Cómo paga el cliente?</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {(['cash', 'bank_transfer', 'dataphone'] as const).filter(type => activePaymentTypes.includes(type)).map(type => {
                                    const info = paymentMethodLabels[type];
                                    const isSelected = billPaymentMethod === type;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setBillPaymentMethod(type)}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center",
                                                isSelected
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            <div className={cn("p-2 rounded-lg", isSelected ? "bg-emerald-100" : "bg-slate-100")}>
                                                {info.icon}
                                            </div>
                                            <span className="text-xs font-bold">{info.label}</span>
                                        </button>
                                    );
                                })}
                                {activePaymentTypes.length === 0 && (
                                    <div className="col-span-3 text-center py-4 text-slate-400 text-sm">
                                        No hay métodos de pago configurados
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cuentas bancarias (si método = transferencia) */}
                        {billPaymentMethod === 'bank_transfer' && bankAccounts.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Datos para transferencia</h3>
                                {bankAccounts.map(acc => (
                                    <div key={acc.id} className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm text-blue-900">{acc.bank_name}</span>
                                            <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">{acc.account_type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono text-blue-800 tracking-wide">{acc.account_number}</span>
                                            <button onClick={() => copyToClipboard(acc.account_number)} className="text-blue-500 hover:text-blue-700">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-blue-600">{acc.account_holder} — {acc.holder_id}</p>
                                    </div>
                                ))}

                                {/* Referencia de pago */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">Referencia / Nro. de transacción</label>
                                    <Input
                                        placeholder="Ej: 123456789"
                                        value={billPaymentRef}
                                        onChange={(e) => setBillPaymentRef(e.target.value)}
                                        className="text-sm"
                                    />
                                </div>

                                {/* Foto del comprobante */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-600">Foto del comprobante</label>
                                    <div className="relative">
                                        {billProofPreview ? (
                                            <div className="relative rounded-xl overflow-hidden border border-slate-200">
                                                <img src={billProofPreview} alt="Comprobante" className="w-full max-h-48 object-contain bg-slate-50" />
                                                <button
                                                    onClick={() => { setBillProofFile(null); setBillProofPreview(''); }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                                                <Camera className="w-8 h-8 text-slate-400" />
                                                <span className="text-xs text-slate-500 font-medium">Toca para tomar foto o seleccionar imagen</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment"
                                                    className="hidden"
                                                    onChange={handleProofFileChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Si paga en efectivo: indicador simple */}
                        {billPaymentMethod === 'cash' && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                <Banknote className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-bold text-green-800">Recoge el efectivo y llévalo a caja</p>
                                <p className="text-xs text-green-600 mt-1">Caja completará el cobro</p>
                            </div>
                        )}

                        {/* Si paga con datáfono */}
                        {billPaymentMethod === 'dataphone' && (
                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                                <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                <p className="text-sm font-bold text-purple-800">Lleva al cliente al datáfono o acércalo</p>
                                <p className="text-xs text-purple-600 mt-1">Caja confirmará el cobro</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0 space-y-2">
                        <Button
                            onClick={handleSubmitPayment}
                            disabled={!billPaymentMethod || isSubmittingPayment}
                            className="w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                        >
                            {isSubmittingPayment ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Receipt className="w-5 h-5 mr-2" />
                            )}
                            {isSubmittingPayment ? 'Registrando...' : 'REGISTRAR PAGO'}
                        </Button>
                        <p className="text-[10px] text-center text-slate-400">El pago se enviará a caja para verificación</p>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
    const hasVariants = product.variant_groups && product.variant_groups.length > 0;
    return (
        <button
            onClick={() => onAdd(product)}
            className="flex flex-col text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all group relative"
        >
            <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <Utensils className="w-8 h-8 text-slate-300" />
                )}
            </div>
            {hasVariants && (
                <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    Opciones
                </span>
            )}
            <div className="p-2 space-y-1">
                <h3 className="font-bold text-xs text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-blue-600 font-black text-sm">
                    {formatCurrency(product.price)}
                </p>
            </div>
        </button>
    );
}
