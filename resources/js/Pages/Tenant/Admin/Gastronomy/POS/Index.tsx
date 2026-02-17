import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import POSLayout from '@/Components/Tenant/Admin/Gastronomy/POS/POSLayout';
import { ShoppingCart, CheckCircle, Clock, Construction, Armchair, Plus, Search, ChefHat, Package, Loader2, Image, CreditCard, Receipt, BadgeCheck, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Badge } from '@/Components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Sheet, SheetContent } from "@/Components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";

import CheckoutDialog from '@/Components/Tenant/Admin/Gastronomy/POS/CheckoutDialog';
import { type CheckoutResult } from '@/Components/Tenant/Admin/Gastronomy/POS/CheckoutDialog';
import VariantSelectorModal from '@/Components/Tenant/Admin/Gastronomy/POS/VariantSelectorModal';
import CustomerSelectorModal from '@/Components/Tenant/Admin/Gastronomy/POS/CustomerSelectorModal';
import CartSidebar from '@/Components/Tenant/Admin/Gastronomy/POS/CartSidebar';
import ProductCatalogDrawer from '@/Components/Tenant/Admin/Gastronomy/POS/ProductCatalogDrawer';
import ReceiptModal, { type ReceiptData } from '@/Components/Tenant/Admin/Gastronomy/POS/ReceiptModal';

import { Category, Product, CartItem, Reservation, Customer, TaxSettings, Table, Zone, Location, Tenant, UserRole, OrderItemData, VariantOption } from '@/types/pos';
import { formatCurrency, calculateTax } from '@/utils/currency';
import { toast } from 'sonner';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

interface Props {
    tenant: Tenant;
    categories: Category[];
    zones: Zone[];
    reservations?: Reservation[];
    taxSettings: TaxSettings;
    locations: Location[];
    currentLocationId: number;
    currentUserRole?: UserRole;
}

export default function POSIndex({ tenant, categories, zones = [], taxSettings, currentUserRole, reservations = [], locations = [], currentLocationId }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [activeZoneId, setActiveZoneId] = useState<string>('all');

    const [showCheckout, setShowCheckout] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [showProductDrawer, setShowProductDrawer] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Multisede state
    const [locationId, setLocationId] = useState(currentLocationId);
    const [confirmCloseCartOpen, setConfirmCloseCartOpen] = useState(false);
    const [confirmClearCartOpen, setConfirmClearCartOpen] = useState(false);
    const [confirmFreeTableOpen, setConfirmFreeTableOpen] = useState(false);
    const [pendingTable, setPendingTable] = useState<Table | null>(null);

    // Búsqueda rápida de mesas
    const [tableSearch, setTableSearch] = useState('');

    // Receipt modal
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

    // Takeout mode (pedido rápido sin mesa)
    const [isTakeoutMode, setIsTakeoutMode] = useState(false);

    // Verificación de pago del mesero
    const [showVerifyPayment, setShowVerifyPayment] = useState(false);
    const [verifyingTable, setVerifyingTable] = useState<Table | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Búsqueda rápida de productos inline
    const [quickProductSearch, setQuickProductSearch] = useState('');

    // Skeleton loader
    const [isPageLoaded, setIsPageLoaded] = useState(false);

    // Waiter Mode Logic
    const isWaiter = currentUserRole?.label === 'waiter' || currentUserRole?.permissions?.includes('pos.waiter_mode') || false;

    // Reservation Check-in State
    const [currentReservationCheckingIn, setCurrentReservationCheckingIn] = useState<Reservation | null>(null);
    const [checkInConfirmOpen, setCheckInConfirmOpen] = useState(false);
    const [pendingCheckInTable, setPendingCheckInTable] = useState<Table | null>(null);
    const [pendingCheckInReservation, setPendingCheckInReservation] = useState<Reservation | null>(null);

    // Permission Check
    const canPay = currentUserRole?.is_owner || currentUserRole?.permissions?.includes('pos.process_payment') || false;

    // Computed Totals (centralizado con utility)
    const { cartSubtotal, cartTaxAmount, cartGrandTotal } = useMemo(() => {
        const baseTotal = cart.reduce((total, item) => total + item.total, 0);
        const { subtotal, taxAmount, grandTotal } = calculateTax(
            baseTotal,
            taxSettings?.tax_rate || 0,
            taxSettings?.price_includes_tax || false
        );
        return { cartSubtotal: subtotal, cartTaxAmount: taxAmount, cartGrandTotal: grandTotal };
    }, [cart, taxSettings]);

    // Simular carga inicial con skeleton
    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoaded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Productos filtrados inline para búsqueda rápida
    const allProducts = useMemo(() => {
        const products: Product[] = [];
        categories.forEach(cat => {
            if (cat.products) {
                products.push(...cat.products);
            }
        });
        return products;
    }, [categories]);

    const filteredInlineProducts = useMemo(() => {
        if (!quickProductSearch || quickProductSearch.length < 2) return [];
        const q = quickProductSearch.toLowerCase();
        return allProducts.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6);
    }, [quickProductSearch, allProducts]);

    // Estado para tracking de órdenes "ready" vía Echo o polling
    const [readyOrderIds, setReadyOrderIds] = useState<Set<number>>(new Set());
    const [echoConnected, setEchoConnected] = useState(false);

    // Estado para órdenes cobradas por mesero (notificación en tiempo real)
    const [waiterCollectedIds, setWaiterCollectedIds] = useState<Set<number>>(new Set());

    // Helper de audio para notificación audible (pedido listo en cocina)
    const playNotificationSound = () => {
        try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();
            // Sonido tipo "ding-dong-ding" igual al de cocina
            const notes = [830, 1046, 1318];
            notes.forEach((freq, i) => {
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
        } catch { /* Audio not available */ }
    };

    // Recopilar IDs de órdenes activas en las mesas
    const activeOrderIds = useMemo(() => {
        const ids: number[] = [];
        zones.forEach(zone => {
            zone.tables.forEach(table => {
                if (table.active_order?.id) {
                    ids.push(table.active_order.id);
                }
            });
        });
        return ids;
    }, [zones]);

    // Real-time via Echo: escuchar cambios de estado de órdenes activas
    useEffect(() => {
        interface EchoChannel {
            listen: (event: string, cb: (e: { id: number; status: string; comment?: string }) => void) => EchoChannel;
            stopListening: (event: string) => void;
        }

        const echoInstance = (window as unknown as Record<string, unknown>).Echo as {
            connector?: unknown;
            channel: (ch: string) => EchoChannel;
        } | undefined;

        if (!echoInstance?.connector || !tenant.id || activeOrderIds.length === 0) {
            setEchoConnected(false);
            return;
        }

        setEchoConnected(true);
        const channels: EchoChannel[] = [];

        activeOrderIds.forEach(orderId => {
            const channel = echoInstance.channel(`tenant.${tenant.id}.orders.${orderId}`)
                .listen('.order.status.updated', (e: { id: number; status: string; comment?: string }) => {
                    if (e.comment === 'waiter_collected') {
                        setWaiterCollectedIds(prev => new Set(prev).add(e.id));
                        playNotificationSound();
                        toast.success(`Mesero registró cobro del Pedido #${e.id}`, {
                            id: `waiter-collected-${e.id}`,
                            duration: 20000,
                            description: 'Toca la mesa para verificar el pago',
                            style: { background: '#ecfdf5', border: '2px solid #059669', fontWeight: 'bold' },
                        });
                        router.reload({ only: ['zones'] });
                    } else if (e.status === 'ready') {
                        setReadyOrderIds(prev => new Set(prev).add(e.id));
                        playNotificationSound();
                        toast.success(`Pedido #${e.id} LISTO en cocina`, {
                            id: `ready-${e.id}`,
                            duration: 15000,
                            description: 'Toca la mesa para ver el pedido',
                            style: { background: '#ecfdf5', border: '2px solid #10b981', fontWeight: 'bold' },
                        });
                    } else if (e.status === 'preparing') {
                        toast.info(`Pedido #${e.id} en preparación`, { id: `preparing-${e.id}`, duration: 5000 });
                    }
                });
            channels.push(channel);
        });

        return () => {
            channels.forEach(ch => ch.stopListening('.order.status.updated'));
        };
    }, [tenant.id, activeOrderIds]);

    // Polling fallback: si Echo no está conectado, consultar estado de órdenes cada 20s
    useEffect(() => {
        if (echoConnected || activeOrderIds.length === 0 || !tenant.slug) return;

        const poll = async () => {
            try {
                const res = await fetch(`/${tenant.slug}/admin/gastronomy/kitchen/orders?status=ready`, {
                    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!res.ok) return;
                const orders: { id: number; status: string }[] = await res.json();

                orders.forEach(order => {
                    if (order.status === 'ready' && activeOrderIds.includes(order.id) && !readyOrderIds.has(order.id)) {
                        setReadyOrderIds(prev => new Set(prev).add(order.id));
                        playNotificationSound();
                        toast.success(`Pedido #${order.id} LISTO en cocina`, {
                            id: `ready-${order.id}`,
                            duration: 15000,
                            description: 'Toca la mesa para ver el pedido',
                            style: { background: '#ecfdf5', border: '2px solid #10b981', fontWeight: 'bold' },
                        });
                    }
                });
            } catch { /* Network error, retry next interval */ }
        };

        const interval = setInterval(poll, 20000);
        // Primera consulta inmediata
        poll();

        return () => clearInterval(interval);
    }, [echoConnected, activeOrderIds, tenant.slug, readyOrderIds]);

    useEffect(() => {
        // Check for expired reservations every minute
        const interval = setInterval(() => {
            if (!reservations) return;
            const now = new Date();

            reservations.forEach(res => {
                if (res.status === 'seated') {
                    // Combine date and time to get start timestamp
                    const startRes = new Date(`${res.reservation_date}T${res.reservation_time}`);
                    // Add 2 hours duration (7200000 ms)
                    const endRes = new Date(startRes.getTime() + 7200000);

                    if (now > endRes) {
                        toast.warning(`La mesa ${res.table ? res.table.name : 'Sin Mesa'} ha excedido el tiempo de reserva.`, {
                            duration: 10000,
                            action: {
                                label: 'Entendido',
                                onClick: () => console.log('Alert acknowledged')
                            }
                        });
                    }
                }
            });
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [reservations]);

    // --- Helpers ---
    const handleCheckInConfirmation = (table: Table, reservation: Reservation) => {
        setPendingCheckInTable(table);
        setPendingCheckInReservation(reservation);
        setCheckInConfirmOpen(true);
    };

    // --- Table Selection Logic ---

    /**
     * Carga items de una orden activa de la mesa al carrito local.
     */
    const loadActiveOrderItems = (table: Table) => {
        if (table.active_order && table.active_order.items) {
            const includesTax = taxSettings?.price_includes_tax || false;
            const rate = taxSettings?.tax_rate || 0;

            const existingItems: CartItem[] = table.active_order.items.map((item: OrderItemData) => {
                const itemTotal = parseFloat(String(item.total));
                const itemPrice = parseFloat(String(item.price));

                const normalizedTotal = (!includesTax) ? itemTotal / (1 + rate / 100) : itemTotal;
                const normalizedPrice = (!includesTax) ? itemPrice / (1 + rate / 100) : itemPrice;

                return {
                    id: `sent-${item.id}`,
                    product_id: item.product_id,
                    name: item.product_name,
                    price: normalizedPrice,
                    quantity: item.quantity,
                    total: normalizedTotal,
                    variant_options: typeof item.variant_options === 'string' ? JSON.parse(item.variant_options) : item.variant_options,
                    notes: item.notes as string | undefined,
                    is_sent: true,
                };
            });
            setCart(existingItems);

            if (table.active_order.customer_id) {
                setSelectedCustomer({
                    id: table.active_order.customer_id,
                    name: table.active_order.customer_name,
                    phone: table.active_order.customer_phone || undefined,
                });
            } else {
                setSelectedCustomer(null);
            }
        } else {
            setCart([]);
            setSelectedCustomer(null);
        }
    };

    // Verificar pago del mesero
    const handleVerifyPayment = async () => {
        if (!verifyingTable?.active_order?.id) return;
        setIsVerifying(true);
        try {
            await axios.post(
                route('tenant.admin.pos.verify-payment', { tenant: tenant.slug, order: verifyingTable.active_order.id })
            );
            toast.success('Pago verificado y orden completada. Mesa liberada.');
            setShowVerifyPayment(false);
            setVerifyingTable(null);
            router.reload();
        } catch {
            toast.error('Error al verificar el pago');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleTableClick = (table: Table) => {
        // Desactivar modo takeout si se selecciona una mesa
        if (isTakeoutMode) {
            setIsTakeoutMode(false);
        }

        // 0. Si la mesa tiene pago cobrado por mesero, abrir modal de verificación
        if (table.active_order?.waiter_collected) {
            setVerifyingTable(table);
            setShowVerifyPayment(true);
            return;
        }

        // 1. If logic for check-in triggered from widget
        if (currentReservationCheckingIn) {
            handleCheckInConfirmation(table, currentReservationCheckingIn);
            return;
        }

        // 2. Click on Reserved Table -> Trigger Check-in
        if (table.status === 'reserved') {
            const reservation = reservations.find(r => r.table_id === table.id && r.status === 'confirmed');
            if (reservation) {
                handleCheckInConfirmation(table, reservation);
                return;
            }
        }

        // 3. Re-clicking the same table → refresh items from active order
        if (selectedTable?.id === table.id) {
            loadActiveOrderItems(table);
            return;
        }

        // 4. Switching to a different table: only warn if there are UNSENT items
        const hasUnsentItems = cart.some(item => !item.is_sent);
        if (selectedTable && hasUnsentItems) {
            setPendingTable(table);
            setConfirmCloseCartOpen(true);
            return;
        }

        // 5. Select the new table and load its order
        setSelectedTable(table);
        loadActiveOrderItems(table);
    };

    const confirmCheckIn = () => {
        if (!pendingCheckInReservation || !pendingCheckInTable) return;

        const reservation = pendingCheckInReservation;
        const table = pendingCheckInTable;

        router.put(route('tenant.admin.reservations.update', {
            tenant: tenant.slug,
            reservation: reservation.id
        }), {
            status: 'seated',
            table_id: table.id
        }, {
            onSuccess: () => {
                toast.success(`Check-in completado para ${reservation.customer_name}`);

                // Select the table and link customer
                setSelectedTable(table);
                setSelectedCustomer({
                    id: reservation.customer_id || 0,
                    name: reservation.customer_name,
                    phone: reservation.customer_phone,
                    email: reservation.customer_email || ''
                });
                setCart([]);

                setCheckInConfirmOpen(false);
                setPendingCheckInTable(null);
                setPendingCheckInReservation(null);
                setCurrentReservationCheckingIn(null);
            }
        });
    };


    // --- Cart & Product Logic ---

    // Variant Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showVariantModal, setShowVariantModal] = useState(false);

    // Customer Modal State
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    const handleProductSelect = (product: Product) => {
        // Siempre abrir el modal para permitir notas (ej: "sin cebolla")
        setSelectedProduct(product);
        setShowVariantModal(true);
    };

    const addToCart = (product: Product, variantOptions: Record<number, number[]> | null = null, finalPrice: number | null = null, quantity: number = 1, notes?: string) => {
        const basePrice = parseFloat(String(product.price));
        const unitPrice = finalPrice !== null ? finalPrice : basePrice;
        const itemId = `item-${Date.now()}-${Math.random()}`;

        // Convertir Record<groupId, optionId[]> a VariantOption[] para el carrito
        let formattedVariants: VariantOption[] | undefined;
        if (variantOptions && product.variant_groups) {
            const result: VariantOption[] = [];
            for (const [groupId, optionIds] of Object.entries(variantOptions)) {
                const group = product.variant_groups?.find(g => g.id === Number(groupId));
                if (!group) continue;
                for (const optId of optionIds) {
                    const opt = group.options.find(o => o.id === optId);
                    if (opt) {
                        result.push({
                            id: opt.id,
                            name: opt.name,
                            price_adjustment: opt.price_adjustment,
                            group_name: group.name,
                            option_name: opt.name,
                            price: Number(opt.price_adjustment),
                        });
                    }
                }
            }
            formattedVariants = result.length > 0 ? result : undefined;
        }

        const newItem: CartItem = {
            id: itemId,
            product_id: product.id,
            name: product.name,
            price: unitPrice,
            quantity: quantity,
            image_url: product.image_url,
            total: unitPrice * quantity,
            variant_options: formattedVariants,
            notes,
        };

        setCart(prev => [...prev, newItem]);
        toast.success("Producto agregado");
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                // Be careful not to lose unit price precision
                return { ...item, quantity: newQty, total: newQty * item.price };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Send to Kitchen
    const handleSendToKitchen = () => {
        const newItems = cart.filter(item => !item.is_sent);

        if (newItems.length === 0) {
            toast.error("No hay productos nuevos para enviar a cocina");
            return;
        }

        if (!selectedTable) {
            toast.error("Selecciona una mesa primero");
            return;
        }

        setIsProcessing(true);

        router.post(route('tenant.pos.store', { tenant: tenant.slug }), {
            location_id: locationId,
            items: newItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                variant_options: item.variant_options,
                notes: item.notes || null,
            })),
            service_type: 'dine_in',
            table_id: selectedTable.id,
            payment_method: null,
            customer_id: selectedCustomer?.id || null,
            customer_name: selectedCustomer?.name || (selectedTable.name.toLowerCase().startsWith('mesa') ? selectedTable.name : `Mesa ${selectedTable.name}`),
            customer_phone: selectedCustomer?.phone || null,
            send_to_kitchen: true,
        }, {
            onSuccess: () => {
                setIsProcessing(false);
                toast.success('Pedido enviado a cocina');
                // Limpiar selección para permitir cambiar de mesa libremente
                setCart([]);
                setSelectedTable(null);
                setSelectedCustomer(null);
                setIsMobileCartOpen(false);
            },
            onError: () => {
                setIsProcessing(false);
                toast.error('Error al enviar pedido');
            }
        });
    };

    // Cancelar item enviado a cocina
    const [confirmCancelItemId, setConfirmCancelItemId] = useState<string | null>(null);

    const handleCancelSentItem = (itemId: string) => {
        setConfirmCancelItemId(itemId);
    };

    const confirmCancelSentItem = () => {
        if (!confirmCancelItemId) return;

        // Extraer el DB id del formato 'sent-{id}'
        const dbId = confirmCancelItemId.replace('sent-', '');
        if (!dbId || dbId === confirmCancelItemId) {
            // No es un item enviado, simplemente remover del cart
            setCart(prev => prev.filter(i => i.id !== confirmCancelItemId));
            setConfirmCancelItemId(null);
            return;
        }

        setIsProcessing(true);
        fetch(route('tenant.admin.pos.cancel-item', { tenant: tenant.slug, item: dbId }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Accept': 'application/json',
            },
        })
        .then(res => res.json())
        .then(data => {
            setIsProcessing(false);
            if (data.success) {
                // Remover item del carrito local
                setCart(prev => prev.filter(i => i.id !== confirmCancelItemId));
                toast.success(data.message || 'Item anulado');
                setConfirmCancelItemId(null);
            } else {
                toast.error(data.message || 'Error al anular item');
                setConfirmCancelItemId(null);
            }
        })
        .catch(() => {
            setIsProcessing(false);
            toast.error('Error de red al anular item');
            setConfirmCancelItemId(null);
        });
    };

    const handleFreeTable = () => {
        if (!selectedTable) return;
        setConfirmFreeTableOpen(true);
    };

    const confirmFreeTableAction = () => {
        if (!selectedTable) return;

        router.post(route('tenant.admin.pos.free-table', {
            tenant: tenant.slug,
            table: selectedTable.id
        }), {}, {
            onSuccess: () => {
                toast.success("Mesa liberada correctamente");
                setSelectedTable(null);
                setCart([]);
                setConfirmFreeTableOpen(false);
            }
        });
    };

    const handleLocationChange = (val: string) => {
        router.visit(route('tenant.admin.pos', { tenant: tenant.slug, location_id: val }));
    };

    // Vaciar carrito con confirmación
    const handleClearCart = () => {
        if (cart.length === 0) return;
        const hasUnsent = cart.some(item => !item.is_sent);
        if (hasUnsent) {
            setConfirmClearCartOpen(true);
        } else {
            // Solo hay items enviados, limpiar directamente
            setCart([]);
        }
    };

    const confirmClearCartAction = () => {
        setCart(prev => prev.filter(item => item.is_sent));
        setConfirmClearCartOpen(false);
    };

    // Timer tick para actualizar tiempos de mesas ocupadas cada 30s
    const [timerTick, setTimerTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTimerTick(t => t + 1), 30000);
        return () => clearInterval(interval);
    }, []);

    // Calcular tiempo transcurrido para mesas ocupadas
    const getElapsedTime = (createdAt: string): string => {
        // timerTick forces re-calculation
        void timerTick;
        const start = new Date(createdAt);
        const now = new Date();
        const diffMs = now.getTime() - start.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}min`;
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <POSLayout title="POS | Mesas" user={currentUserRole} tenant={tenant}>
            <Head title="Punto de Venta" />

            <div className="w-full flex h-[calc(100vh-64px)] overflow-hidden">

                {/* LEFT: Zone Map Area */}
                <div className="flex-1 flex flex-col bg-slate-100 min-w-0">

                    {/* Zone Tabs & Location Selector */}
                    <div className="bg-white border-b px-4 md:px-6 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3 z-10 shrink-0">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            <button
                                onClick={() => setActiveZoneId('all')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${activeZoneId === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                Todas
                            </button>
                            {zones.map(zone => (
                                <button
                                    key={zone.id}
                                    onClick={() => setActiveZoneId(String(zone.id))}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${activeZoneId === String(zone.id)
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {zone.name}
                                </button>
                            ))}

                            {/* Separador visual */}
                            <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />

                            {/* Botón Pedido Rápido (Takeout) */}
                            <button
                                onClick={() => {
                                    setIsTakeoutMode(true);
                                    setSelectedTable(null);
                                    setCart([]);
                                    setSelectedCustomer(null);
                                    setShowProductDrawer(true);
                                }}
                                className="px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center gap-1.5"
                            >
                                <Package className="w-4 h-4" />
                                Pedido Rápido
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Búsqueda rápida de productos inline */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                                <Input
                                    placeholder="Buscar producto..."
                                    value={quickProductSearch}
                                    onChange={(e) => setQuickProductSearch(e.target.value)}
                                    className="pl-8 h-9 w-[160px] md:w-[200px] bg-indigo-50/50 border-indigo-200 text-sm focus:ring-indigo-300"
                                />
                                {/* Dropdown resultados */}
                                {filteredInlineProducts.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden max-h-64">
                                        {filteredInlineProducts.map(product => (
                                            <button
                                                key={product.id}
                                                className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-indigo-50 transition-colors text-left"
                                                onClick={() => {
                                                    handleProductSelect(product);
                                                    setQuickProductSearch('');
                                                }}
                                            >
                                                {product.image_url ? (
                                                    <img src={product.image_url} className="w-8 h-8 rounded object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded bg-slate-100 shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-slate-800 truncate">{product.name}</div>
                                                    <div className="text-xs text-slate-400">{formatCurrency(product.price)}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Búsqueda rápida de mesas */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Buscar mesa..."
                                    value={tableSearch}
                                    onChange={(e) => setTableSearch(e.target.value)}
                                    className="pl-8 h-9 w-[120px] md:w-[150px] bg-slate-50 border-slate-200 text-sm"
                                />
                            </div>

                            {/* Selector de Sede (visible en móvil y desktop) */}
                            <Select value={String(locationId)} onValueChange={handleLocationChange}>
                                <SelectTrigger className="w-[160px] md:w-[200px] h-9 bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Seleccionar Sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Banner Modo Check-in */}
                    {currentReservationCheckingIn && (
                        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between z-20 animate-in fade-in slide-in-from-top duration-300">
                            <div className="flex items-center gap-3 font-bold">
                                <Armchair className="w-5 h-5 text-indigo-400" />
                                <span>MODO CHECK-IN: Selecciona mesa para {currentReservationCheckingIn.customer_name} ({currentReservationCheckingIn.party_size} pax)</span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                                onClick={() => setCurrentReservationCheckingIn(null)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    )}

                    {/* Banner Modo Takeout */}
                    {isTakeoutMode && (
                        <div className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between z-20 animate-in fade-in slide-in-from-top duration-300">
                            <div className="flex items-center gap-3 font-bold">
                                <Package className="w-5 h-5" />
                                <span>PEDIDO RÁPIDO — Takeout / Delivery (sin mesa)</span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                                onClick={() => {
                                    setIsTakeoutMode(false);
                                    setCart([]);
                                    setSelectedCustomer(null);
                                }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    )}

                    {/* Table Grid */}
                    <ScrollArea className="flex-1 p-6">
                        {!isPageLoaded ? (
                            /* Skeleton Loader */
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="h-40 rounded-xl border border-slate-200 bg-slate-50 animate-pulse flex flex-col items-center justify-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div className="w-16 h-4 rounded bg-slate-200" />
                                        <div className="w-10 h-3 rounded bg-slate-200" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
                            {zones
                                .filter(z => activeZoneId === 'all' || String(z.id) === activeZoneId)
                                .flatMap(zone =>
                                    zone.tables
                                        .filter(table => {
                                            if (!tableSearch) return true;
                                            return table.name.toLowerCase().includes(tableSearch.toLowerCase());
                                        })
                                        .map(table => {
                                            // Check if reserved for today
                                            const isReservedToday = reservations.some(r => r.table_id === table.id && ['confirmed', 'pending'].includes(r.status));

                                            // Colors based on status
                                            let statusColor = "bg-white border-slate-200";
                                            let statusBadge = "bg-slate-100 text-slate-500";
                                            let icon = <Armchair className="w-8 h-8 text-slate-300" />;

                                            // Determine effective status for POS purposes
                                            let displayStatus = table.status;
                                            if (displayStatus === 'available' && isReservedToday) {
                                                displayStatus = 'reserved';
                                            } else if (displayStatus === 'reserved' && !isReservedToday) {
                                                displayStatus = 'available';
                                            }

                                            // Verificar si la orden de esta mesa está "ready" vía Echo
                                            const isOrderReady = table.active_order?.id ? readyOrderIds.has(table.active_order.id) : false;
                                            const isWaiterCollected = table.active_order?.waiter_collected === true || (table.active_order?.id ? waiterCollectedIds.has(table.active_order.id) : false);

                                            if (displayStatus === 'occupied' && isWaiterCollected) {
                                                statusColor = "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300/50";
                                                statusBadge = "bg-emerald-500 text-white";
                                                icon = <ShoppingCart className="w-8 h-8 text-emerald-500" />;
                                            } else if (displayStatus === 'occupied' && isOrderReady) {
                                                statusColor = "bg-green-50 border-green-300 ring-2 ring-green-300/30";
                                                statusBadge = "bg-green-100 text-green-700";
                                                icon = <CheckCircle className="w-8 h-8 text-green-500" />;
                                            } else if (displayStatus === 'occupied') {
                                                statusColor = "bg-red-50/30 border-red-200";
                                                statusBadge = "bg-red-100 text-red-600";
                                                icon = <Clock className="w-8 h-8 text-red-400" />;
                                            } else if (displayStatus === 'reserved') {
                                                statusColor = "bg-amber-50/30 border-amber-200";
                                                statusBadge = "bg-amber-100 text-amber-600";
                                                icon = <CheckCircle className="w-8 h-8 text-amber-400" />;
                                            } else if (displayStatus === 'available') {
                                                statusColor = "bg-white border-slate-200 hover:bg-slate-50";
                                                statusBadge = "bg-slate-100 text-slate-500";
                                                icon = <Armchair className="w-8 h-8 text-slate-300" />;
                                            } else if (displayStatus === 'maintenance') {
                                                statusColor = "bg-slate-100 border-slate-200 opacity-50";
                                                icon = <Construction className="w-8 h-8 text-slate-400" />;
                                            }

                                            const isSelected = selectedTable?.id === table.id;

                                            return (
                                                <div
                                                    key={table.id}
                                                    onClick={() => handleTableClick(table)}
                                                    className={`
                                                        relative h-40 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer
                                                        ${statusColor}
                                                        ${isSelected ? 'border-2 border-slate-900 bg-white ring-2 ring-slate-900/10' : 'hover:border-slate-400'}
                                                    `}
                                                >
                                                    {/* Header Status */}
                                                    <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusBadge}`}>
                                                        {isWaiterCollected ? '💰 Cobrado' :
                                                            isOrderReady ? 'Listo' :
                                                                displayStatus === 'available' ? 'Libre' :
                                                                    displayStatus === 'occupied' ? 'Ocupada' :
                                                                        displayStatus === 'reserved' ? 'Reservada' : 'Mant.'}
                                                    </div>

                                                    {/* Active Order Timer (if occupied) */}
                                                    {table.status === 'occupied' && table.active_order && (
                                                        <div className="absolute top-3 left-3 flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-red-400" />
                                                            <span className="text-[10px] bg-red-50 px-1.5 py-0.5 rounded text-red-600 font-mono font-bold border border-red-200">
                                                                {getElapsedTime(table.active_order.created_at)}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {icon}

                                                    <div className="text-xl font-black text-slate-700 font-mono">
                                                        {table.name}
                                                    </div>

                                                    <div className="text-xs text-slate-400 font-medium">
                                                        {table.capacity} Pax
                                                    </div>

                                                    {/* Occupied Details: Total / Waiter Collected */}
                                                    {table.status === 'occupied' && table.active_order && isWaiterCollected && (
                                                        <div className="absolute bottom-0 left-0 right-0 text-center bg-emerald-100 py-1.5 border-t border-emerald-300 rounded-b-xl">
                                                            <div className="text-xs font-black text-emerald-800">
                                                                VERIFICAR {formatCurrency(table.active_order.total)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {table.status === 'occupied' && table.active_order && !isWaiterCollected && (
                                                        <div className="absolute bottom-0 left-0 right-0 text-center bg-red-50/80 py-1.5 border-t border-red-200 rounded-b-xl">
                                                            <div className="text-sm font-black text-red-700">
                                                                {formatCurrency(table.active_order.total)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                )}

                            {/* Empty State: no zones */}
                            {zones.length === 0 && (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                                    <Construction className="w-12 h-12 mb-4 opacity-50" />
                                    <h3 className="text-lg font-bold">No hay zonas configuradas</h3>
                                    <p className="text-sm">Configura zonas y mesas en el panel de administración.</p>
                                </div>
                            )}

                            {/* Empty State: zona sin mesas (o búsqueda sin resultados) */}
                            {zones.length > 0 && zones
                                .filter(z => activeZoneId === 'all' || String(z.id) === activeZoneId)
                                .every(z => z.tables.filter(t => !tableSearch || t.name.toLowerCase().includes(tableSearch.toLowerCase())).length === 0) && (
                                <div className="col-span-full h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                    <Search className="w-10 h-10 mb-3 opacity-30" />
                                    <h3 className="text-base font-bold">
                                        {tableSearch ? 'No se encontraron mesas' : 'Esta zona no tiene mesas'}
                                    </h3>
                                    <p className="text-sm mt-1">
                                        {tableSearch ? `Sin resultados para "${tableSearch}"` : 'Agrega mesas desde el panel de administración.'}
                                    </p>
                                </div>
                            )}
                        </div>
                        )}
                    </ScrollArea>
                </div>


                {/* RIGHT: Cart Sidebar */}
                <div className="hidden lg:flex w-[400px] border-l border-slate-200 shrink-0 bg-white z-20 h-full">
                    <CartSidebar
                        cart={cart}
                        cartTotal={cartSubtotal}
                        selectedCustomer={selectedCustomer}
                        selectedTable={selectedTable}
                        onUpdateQuantity={updateQuantity}
                        onRemoveFromCart={removeFromCart}
                        onClearCart={handleClearCart}
                        onOpenCustomerModal={() => setShowCustomerModal(true)}
                        onShowCheckout={() => setShowCheckout(true)}
                        onSendToKitchen={handleSendToKitchen}
                        onCancelSentItem={handleCancelSentItem}
                        canPay={canPay}
                        isProcessing={isProcessing}
                        isTakeoutMode={isTakeoutMode}
                        onAddProducts={() => {
                            if (!selectedTable && !isTakeoutMode) {
                                toast.error("Selecciona una mesa primero");
                                return;
                            }
                            setShowProductDrawer(true);
                        }}
                        onFreeTable={handleFreeTable}
                        taxSettings={taxSettings}
                    />
                </div>
            </div>

            {/* Mobile Cart Sheet */}
            <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
                <SheetContent side="right" className="p-0 w-full sm:w-[400px]">
                    <CartSidebar
                        cart={cart}
                        cartTotal={cartSubtotal}
                        selectedCustomer={selectedCustomer}
                        selectedTable={selectedTable}
                        onUpdateQuantity={updateQuantity}
                        onRemoveFromCart={removeFromCart}
                        onClearCart={handleClearCart}
                        onOpenCustomerModal={() => setShowCustomerModal(true)}
                        onShowCheckout={() => {
                            setShowCheckout(true);
                            setIsMobileCartOpen(false);
                        }}
                        onSendToKitchen={handleSendToKitchen}
                        onCancelSentItem={handleCancelSentItem}
                        canPay={canPay}
                        isProcessing={isProcessing}
                        isTakeoutMode={isTakeoutMode}
                        onAddProducts={() => {
                            setIsMobileCartOpen(false);
                            setShowProductDrawer(true);
                        }}
                        onFreeTable={handleFreeTable}
                        taxSettings={taxSettings}
                    />
                </SheetContent>
            </Sheet>

            {/* Product Catalog Drawer */}
            <ProductCatalogDrawer
                open={showProductDrawer}
                onOpenChange={setShowProductDrawer}
                categories={categories}
                onProductSelect={handleProductSelect}
            />

            {/* Mobile FAB */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <Button
                    onClick={() => setIsMobileCartOpen(true)}
                    size="lg"
                    className="rounded-full w-14 h-14 shadow-lg bg-slate-900 hover:bg-slate-800 text-white relative"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            {cart.length}
                        </span>
                    )}
                </Button>
            </div>

            {/* Modals */}
            <CheckoutDialog
                open={showCheckout}
                onOpenChange={setShowCheckout}
                total={cartGrandTotal}
                items={cart}
                onSuccess={(result?: CheckoutResult) => {
                    // Si es pago exitoso y hay resultado, mostrar recibo
                    if (result) {
                        setReceiptData({
                            orderId: result.orderId,
                            items: [...cart],
                            paymentMethod: result.paymentMethod,
                            cashAmount: result.cashAmount,
                            change: result.change,
                            customer: selectedCustomer,
                            table: selectedTable,
                            tenant,
                            taxSettings,
                        });
                        setShowReceipt(true);
                    }
                    setCart([]);
                    setShowCheckout(false);
                    setSelectedCustomer(null);
                    if (!isTakeoutMode) {
                        setSelectedTable(null);
                    }
                    setIsTakeoutMode(false);
                }}
                customer={selectedCustomer}
                tenant={tenant}
                table={isTakeoutMode ? null : selectedTable}
                isWaiter={isWaiter}
                locationId={locationId}
            />

            <ReceiptModal
                open={showReceipt}
                onOpenChange={setShowReceipt}
                data={receiptData}
            />

            <VariantSelectorModal
                open={showVariantModal}
                onOpenChange={setShowVariantModal}
                product={selectedProduct}
                onAddToCart={(product: Product, quantity: number, variants: Record<number, number[]>, totalPrice: number, notes?: string) => {
                    addToCart(product, variants, totalPrice, quantity, notes);
                    setShowVariantModal(false);
                }}
            />

            <CustomerSelectorModal
                open={showCustomerModal}
                onOpenChange={setShowCustomerModal}
                onSelect={(customer) => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                }}
            />

            {/* Check-in Confirmation AlertDialog */}
            <AlertDialog open={checkInConfirmOpen} onOpenChange={setCheckInConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Llegó el cliente?</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3">
                                <p>Confirma el check-in de esta reserva:</p>
                                {pendingCheckInReservation && (
                                    <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-sm">
                                        <div className="font-semibold text-slate-800">
                                            {pendingCheckInReservation.customer_name}
                                        </div>
                                        <div className="text-slate-500">
                                            {pendingCheckInReservation.reservation_time?.substring(0, 5)} · {pendingCheckInReservation.party_size} personas
                                        </div>
                                        {pendingCheckInTable && (
                                            <div className="text-indigo-600 font-medium">
                                                Mesa: {pendingCheckInTable.name}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <p className="text-xs text-slate-400">
                                    La mesa cambiará a <strong className="text-red-500">ocupada</strong> y el cliente se vinculará al pedido.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setPendingCheckInTable(null);
                            setPendingCheckInReservation(null);
                        }}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmCheckIn}
                            className="bg-slate-900 text-white hover:bg-slate-800"
                        >
                            Sí, Check-in
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Clear Cart Confirmation */}
            <AlertDialog open={confirmCloseCartOpen} onOpenChange={setConfirmCloseCartOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cambiar de mesa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tienes productos en el carrito. Al cambiar de mesa, el carrito actual se vaciará.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmCloseCartOpen(false)}>Mantener mesa actual</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setConfirmCloseCartOpen(false);
                                if (pendingTable) {
                                    setSelectedTable(pendingTable);
                                    loadActiveOrderItems(pendingTable);
                                    setPendingTable(null);
                                }
                            }}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Vaciar y Cambiar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Clear Cart Confirmation */}
            <AlertDialog open={confirmClearCartOpen} onOpenChange={setConfirmClearCartOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Vaciar carrito?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminarán los productos que aún no han sido enviados a cocina. Los productos ya enviados se mantendrán.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmClearCartAction}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Sí, Vaciar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Sent Item Confirmation */}
            <AlertDialog open={!!confirmCancelItemId} onOpenChange={(open) => { if (!open) setConfirmCancelItemId(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">¿Anular este producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Este producto ya fue enviado a cocina. Al anularlo, se restará del total de la orden inmediatamente y cocina será notificada.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Volver</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmCancelSentItem}
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Anulando...' : 'Sí, Anular Item'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Free Table Confirmation */}
            <AlertDialog open={confirmFreeTableOpen} onOpenChange={setConfirmFreeTableOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">¿Liberar Mesa Manualmente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción cambiará el estado de la mesa <strong className="text-slate-900">{selectedTable?.name}</strong> a <span className="text-green-600 font-bold">Disponible</span> sin procesar un pago.
                            Úsala solo en casos excepcionales (error de sistema o cliente que se retiró sin consumir).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Volver</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmFreeTableAction}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Sí, Liberar Mesa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Modal de Verificación de Pago del Mesero */}
            <Dialog open={showVerifyPayment} onOpenChange={(open) => { if (!open) { setShowVerifyPayment(false); setVerifyingTable(null); } }}>
                <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
                    {verifyingTable?.active_order && (() => {
                        const order = verifyingTable.active_order;
                        const proofUrl = order.payment_proof_url || (order as unknown as { payment_proof?: string }).payment_proof;
                        return (
                            <>
                                {/* Header */}
                                <div className="bg-emerald-600 p-5 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-white text-lg">
                                            <BadgeCheck className="w-6 h-6" />
                                            Verificar Pago — {verifyingTable.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-emerald-100 mt-1">
                                            El mesero registró el cobro de esta mesa. Revisa los detalles y verifica.
                                        </DialogDescription>
                                    </DialogHeader>
                                </div>

                                {/* Body */}
                                <div className="p-5 space-y-4">
                                    {/* Resumen del pedido */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Resumen del Pedido #{order.id}</h4>
                                        {order.items && order.items.length > 0 ? (
                                            <div className="space-y-2">
                                                {order.items.filter(i => (i as unknown as { status?: string }).status !== 'cancelled').map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-sm">
                                                        <span className="text-slate-700">{item.quantity}x {item.product_name}</span>
                                                        <span className="font-semibold text-slate-900">{formatCurrency(Number(item.total) || (Number(item.price) * item.quantity))}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400">Items no disponibles en vista previa</p>
                                        )}
                                        <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between">
                                            <span className="text-base font-black text-slate-900">TOTAL</span>
                                            <span className="text-xl font-black text-emerald-700">{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>

                                    {/* Método de pago */}
                                    <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase">Método de Pago</p>
                                            <p className="text-sm font-semibold text-slate-900 capitalize">
                                                {{ cash: 'Efectivo', bank_transfer: 'Transferencia Bancaria', dataphone: 'Datáfono' }[order.payment_method || ''] || order.payment_method || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Referencia */}
                                    {order.payment_reference && (
                                        <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-4 border border-amber-200">
                                            <Receipt className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-amber-600 uppercase">Referencia</p>
                                                <p className="text-sm font-semibold text-slate-900 font-mono">{order.payment_reference}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Foto del comprobante */}
                                    {proofUrl && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Image className="w-4 h-4 text-slate-500" />
                                                <p className="text-xs font-bold text-slate-500 uppercase">Comprobante de Pago</p>
                                            </div>
                                            <a href={typeof proofUrl === 'string' ? proofUrl : '#'} target="_blank" rel="noopener noreferrer"
                                                className="block rounded-xl overflow-hidden border-2 border-slate-200 hover:border-emerald-400 transition-colors">
                                                <img
                                                    src={typeof proofUrl === 'string' ? proofUrl : ''}
                                                    alt="Comprobante de pago"
                                                    className="w-full max-h-64 object-contain bg-slate-100"
                                                />
                                            </a>
                                            <p className="text-[10px] text-slate-400 text-center">Toca la imagen para verla completa</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer con acciones */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
                                    <Button
                                        onClick={handleVerifyPayment}
                                        disabled={isVerifying}
                                        className="w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                                    >
                                        {isVerifying ? (
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        ) : (
                                            <BadgeCheck className="w-5 h-5 mr-2" />
                                        )}
                                        {isVerifying ? 'Verificando...' : 'VERIFICAR Y COMPLETAR PEDIDO'}
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-400">
                                        Se marcará la orden como completada y la mesa quedará libre
                                    </p>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </POSLayout>
    );
}
