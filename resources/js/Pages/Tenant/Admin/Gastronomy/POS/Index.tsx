import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import POSLayout from '@/Components/Tenant/Admin/Gastronomy/POS/POSLayout';
import { ShoppingCart, LogOut, CheckCircle, Clock, Construction, Armchair, Plus, Search, ChefHat } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Badge } from '@/Components/ui/badge';
import { Card } from '@/Components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Sheet, SheetContent } from "@/Components/ui/sheet";

import CheckoutDialog from '@/Components/Tenant/Admin/Gastronomy/POS/CheckoutDialog';
import VariantSelectorModal from '@/Components/Tenant/Admin/Gastronomy/POS/VariantSelectorModal';
import CustomerSelectorModal from '@/Components/Tenant/Admin/Gastronomy/POS/CustomerSelectorModal';
import CartSidebar from '@/Components/Tenant/Admin/Gastronomy/POS/CartSidebar';
import ProductCatalogDrawer from '@/Components/Tenant/Admin/Gastronomy/POS/ProductCatalogDrawer';

import { Category, Product, CartItem, Reservation, Customer, TaxSettings, Table, Zone, Location } from '@/types/pos';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

interface Props {
    tenant: any;
    categories: Category[];
    zones: Zone[];
    reservations?: Reservation[];
    active_tables?: any[]; // Legacy prop just in case, active orders come inside zones
    taxSettings: TaxSettings;
    locations: Location[];
    currentLocationId: number;
    currentUserRole?: {
        label: string;
        is_owner: boolean;
        permissions: string[];
    };
}

export default function POSIndex({ tenant, categories, zones = [], taxSettings, currentUserRole, reservations = [], locations = [], currentLocationId }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [activeZoneId, setActiveZoneId] = useState<string>(zones.length > 0 ? String(zones[0].id) : 'all');

    const [showCheckout, setShowCheckout] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [showProductDrawer, setShowProductDrawer] = useState(false);

    // Multisede state
    const [locationId, setLocationId] = useState(currentLocationId);
    const [confirmCloseCartOpen, setConfirmCloseCartOpen] = useState(false);
    const [confirmFreeTableOpen, setConfirmFreeTableOpen] = useState(false);
    const [pendingTable, setPendingTable] = useState<Table | null>(null);

    // Waiter Mode Logic
    const isWaiter = currentUserRole?.label === 'waiter' || currentUserRole?.permissions.includes('pos.waiter_mode');

    // Default to 'all' zone if waiter to show tables immediately
    useEffect(() => {
        if (isWaiter && zones.length > 0) {
            // Keep activeZoneId logic, but maybe ensure we default to a view that makes sense
        }
    }, [isWaiter]);

    // Reservation Check-in State
    const [currentReservationCheckingIn, setCurrentReservationCheckingIn] = useState<Reservation | null>(null);
    const [checkInConfirmOpen, setCheckInConfirmOpen] = useState(false);
    const [pendingCheckInTable, setPendingCheckInTable] = useState<any>(null); // Table from selection
    const [pendingCheckInReservation, setPendingCheckInReservation] = useState<Reservation | null>(null);

    // Permission Check
    const canPay = currentUserRole?.is_owner || currentUserRole?.permissions.includes('pos.process_payment') || false;

    // Computed Cart Total
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.total, 0);
    }, [cart]);

    useEffect(() => {
        // Real-time listener for orders could go here

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

    // --- Table Selection Logic ---

    const handleTableClick = (table: Table) => {
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

        // 3. Normal Selection

        // Warn if switching tables with unsaved cart
        if (selectedTable && selectedTable.id !== table.id && cart.length > 0) {
            setPendingTable(table);
            setConfirmCloseCartOpen(true);
            return;
        } else if (selectedTable?.id !== table.id) {
            // Clean slate when switching
            setCart([]);
            setSelectedCustomer(null);
        }

        setSelectedTable(table);

        // Load active order if exists (Mock logic for now, backend integration needed for full persistence)
        if (table.active_order) {
            // In a real app, you'd fetch the order items via API here
            // For now we assume if there's an active order we might just show state.
            // But let's just allow starting a new order/adding to it
            if (table.active_order.customer_name) {
                // Simulate loading customer
                // setSelectedCustomer({ name: table.active_order.customer_name, id: 0 });
            }
        }
    };

    const handleCheckInConfirmation = (table: Table, reservation: Reservation) => {
        setPendingCheckInTable(table);
        setPendingCheckInReservation(reservation);
        setCheckInConfirmOpen(true);
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
        if (product.variant_groups && product.variant_groups.length > 0) {
            setSelectedProduct(product);
            setShowVariantModal(true);
        } else {
            addToCart(product);
        }
    };

    const addToCart = (product: Product, variantOptions: any = null, finalPrice: number | null = null, quantity: number = 1) => {
        // Ensure price is a number
        const basePrice = parseFloat(String(product.price));
        // Use finalPrice (unit price of variant) if provided, otherwise base price
        const unitPrice = finalPrice !== null ? finalPrice : basePrice;

        // Generate a deterministic ID based on product + options
        const itemId = `item-${Date.now()}-${Math.random()}`;

        const newItem: CartItem = {
            id: itemId,
            product_id: product.id,
            name: product.name,
            price: unitPrice,
            quantity: quantity,
            image_url: product.image_url,
            total: unitPrice * quantity,
            variant_options: variantOptions
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
        if (cart.length === 0) return;
        if (!selectedTable) {
            toast.error("Selecciona una mesa primero");
            return;
        }

        router.post(route('tenant.pos.store', { tenant: tenant.slug }), {
            location_id: locationId,
            items: cart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                variant_options: item.variant_options
            })),
            total: cartTotal,
            service_type: 'dine_in',
            table_id: selectedTable.id,
            payment_method: null,
            customer_id: selectedCustomer?.id || null,
            customer_name: selectedCustomer?.name || `Mesa ${selectedTable.name}`,
            customer_phone: selectedCustomer?.phone || null,
            send_to_kitchen: true,
        }, {
            onSuccess: () => {
                toast.success('Pedido enviado a cocina');
                setCart([]);
                setIsMobileCartOpen(false);
            },
            onError: () => toast.error('Error al enviar pedido')
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
        router.visit(route('tenant.pos.index', { tenant: tenant.slug, location_id: val }));
    };

    return (
        <POSLayout title="POS | Mesas" user={currentUserRole} tenant={tenant}>
            <Head title="Punto de Venta" />

            <div className="w-full flex h-[calc(100vh-64px)] overflow-hidden">

                {/* LEFT: Zone Map Area */}
                <div className="flex-1 flex flex-col bg-slate-100 min-w-0">

                    {/* Zone Tabs & Location Selector */}
                    <div className="bg-white border-b px-6 py-4 flex justify-between items-center z-10 shrink-0">
                        <div className="flex space-x-2 overflow-x-auto">
                            <button
                                onClick={() => setActiveZoneId('all')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeZoneId === 'all'
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
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeZoneId === String(zone.id)
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {zone.name}
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-2">
                            <Select value={String(locationId)} onValueChange={handleLocationChange}>
                                <SelectTrigger className="w-[200px] h-9 bg-slate-50 border-slate-200">
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

                    {/* Table Grid */}
                    <ScrollArea className="flex-1 p-6">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-20">
                            {zones
                                .filter(z => activeZoneId === 'all' || String(z.id) === activeZoneId)
                                .map(zone => (
                                    zone.tables.map(table => {
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
                                            displayStatus = 'available'; // Reset to available if not reserved today
                                        }

                                        if (displayStatus === 'occupied') {
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
                                                    {displayStatus === 'available' ? 'Libre' :
                                                        displayStatus === 'occupied' ? 'Ocupada' :
                                                            displayStatus === 'reserved' ? 'Reservada' : 'Mant.'}
                                                </div>

                                                {/* Active Order Info (if occupied) */}
                                                {table.status === 'occupied' && table.active_order && (
                                                    <div className="absolute top-3 left-3 flex flex-col items-start">
                                                        <span className="text-[10px] bg-white/80 px-1.5 py-0.5 rounded text-slate-500 font-mono border border-slate-200 shadow-sm">
                                                            Orden activa
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

                                                {/* Occupied Details */}
                                                {table.status === 'occupied' && (
                                                    <div className="mt-1 text-center bg-white/50 w-full py-1 border-t border-red-100">
                                                        <div className="text-sm font-bold text-slate-800">
                                                            {table.active_order?.total ? `$${parseFloat(String(table.active_order.total)).toLocaleString()}` : '$0'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ))}

                            {/* Fallback Empty State */}
                            {zones.length === 0 && (
                                <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
                                    <Construction className="w-12 h-12 mb-4 opacity-50" />
                                    <h3 className="text-lg font-bold">No hay zonas configuradas</h3>
                                    <p className="text-sm">Configura zonas y mesas en el panel de administración.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>


                {/* RIGHT: Cart Sidebar */}
                <div className="hidden lg:flex w-[400px] border-l border-slate-200 shrink-0 bg-white z-20 h-full">
                    <CartSidebar
                        cart={cart}
                        cartTotal={cartTotal}
                        selectedCustomer={selectedCustomer}
                        selectedTable={selectedTable}
                        onUpdateQuantity={updateQuantity}
                        onRemoveFromCart={removeFromCart}
                        onClearCart={() => setCart([])}
                        onOpenCustomerModal={() => setShowCustomerModal(true)}
                        onShowCheckout={() => setShowCheckout(true)}
                        onSendToKitchen={handleSendToKitchen}
                        canPay={canPay}
                        onAddProducts={() => {
                            if (!selectedTable) {
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
                        cartTotal={cartTotal}
                        selectedCustomer={selectedCustomer}
                        selectedTable={selectedTable}
                        onUpdateQuantity={updateQuantity}
                        onRemoveFromCart={removeFromCart}
                        onClearCart={() => setCart([])}
                        onOpenCustomerModal={() => setShowCustomerModal(true)}
                        onShowCheckout={() => {
                            setShowCheckout(true);
                            setIsMobileCartOpen(false);
                        }}
                        onSendToKitchen={handleSendToKitchen}
                        canPay={canPay}
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
                total={cartTotal}
                items={cart}
                onSuccess={() => {
                    setCart([]);
                    setShowCheckout(false);
                    setSelectedCustomer(null);
                    setSelectedTable(null);
                }}
                customer={selectedCustomer}
                tenant={tenant}
                table={selectedTable}
                isWaiter={isWaiter}
                locationId={locationId}
            />

            <VariantSelectorModal
                open={showVariantModal}
                onOpenChange={setShowVariantModal}
                product={selectedProduct}
                // FIXED: Arguments order mismatch. VariantSelectorModal passes (product, quantity, variants, totalPrice)
                onAddToCart={(product, quantity, variants, totalPrice) => {
                    addToCart(product, variants, totalPrice, quantity);
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
                                setCart([]);
                                setSelectedCustomer(null);
                                setSelectedTable(pendingTable);
                                setConfirmCloseCartOpen(false);
                            }}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Vaciar y Cambiar
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
        </POSLayout>
    );
}
