import React, { useState, useEffect, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Clock, Users, User, Phone, Mail, CheckCircle, MapPin, ChevronRight, ChevronLeft, AlertCircle, Banknote, Upload, Copy, FileText, Smartphone } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { format, parse, isBefore, startOfHour, addMinutes, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import PublicLayout from '@/Components/Tenant/Gastronomy/Public/PublicLayout';
import Header from '@/Components/Tenant/Gastronomy/Public/Header';
import axios from 'axios';

interface Props {
    tenant: any;
    locations: any[];
    bankAccounts: any[];
}

export default function ReservationIndex({ tenant, locations, bankAccounts = [] }: Props) {
    const [step, setStep] = useState(locations.length > 1 ? 0 : 1); // 0: Loc, 1: Date, 2: Contact, 3: Payment, 4: Summary, 5: Success
    const [createdReservation, setCreatedReservation] = useState<any>(null);

    // Safely get brand colors
    const brandColors = tenant.brand_colors || {
        bg_color: '#f8fafc',
        name_color: '#1e293b',
        description_color: '#64748b'
    };

    const { bg_color, name_color } = brandColors;

    const form = useForm({
        location_id: locations.length === 1 ? locations[0].id : '',
        reservation_date: format(new Date(), 'yyyy-MM-dd'),
        reservation_time: '',
        party_size: 2,
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        notes: '',
        payment_proof: null as File | null,
    });

    const selectedLocation = useMemo(() =>
        locations.find(l => l.id === Number(form.data.location_id)),
        [form.data.location_id, locations]);

    // Generate dynamic time slots based on location opening hours and settings
    const timeSlots = useMemo(() => {
        if (!selectedLocation || !selectedLocation.opening_hours) return [];

        const date = parse(form.data.reservation_date, 'yyyy-MM-dd', new Date());
        // Database keys are in English: monday, tuesday, etc.
        const dayName = format(date, 'EEEE', { locale: undefined }).toLowerCase();
        const ranges = selectedLocation.opening_hours[dayName];

        // Format is usually an array of {open, close}
        if (!ranges || !Array.isArray(ranges) || ranges.length === 0) return [];

        const slots: string[] = [];

        // Configuration from Location settings
        const minAnticipationHours = selectedLocation.reservation_min_anticipation ?? 2;
        const slotDurationMinutes = selectedLocation.reservation_slot_duration ?? 60;

        const now = new Date();
        const minTime = addMinutes(now, minAnticipationHours * 60);

        ranges.forEach((range: any) => {
            if (!range.open || !range.close) return;

            const [openHour, openMin] = range.open.split(':').map(Number);
            const [closeHour, closeMin] = range.close.split(':').map(Number);

            let current = new Date(date);
            current.setHours(openHour, openMin, 0, 0);

            let end = new Date(date);
            end.setHours(closeHour, closeMin, 0, 0);

            // If closing time is before opening, it means it closes the next day (e.g., 2:00 AM)
            if (isAfter(current, end)) {
                end.setDate(end.getDate() + 1);
            }

            // Generate slots for this specific range
            while (isBefore(current, end)) {
                // Filter: Only show slots if they are in the future AND respect minimum anticipation
                // Use !isBefore for inclusive comparison (exactly minAnticipation allowed)
                if (!isBefore(current, minTime)) {
                    slots.push(format(current, 'HH:mm'));
                }
                current = addMinutes(current, slotDurationMinutes);
            }
        });

        // Ensure unique and sorted slots (in case of overlapping ranges)
        return Array.from(new Set(slots)).sort();
    }, [selectedLocation, form.data.reservation_date]);

    // Reset time when date or location changes
    useEffect(() => {
        form.setData('reservation_time', '');
    }, [form.data.reservation_date, form.data.location_id]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('location_id', String(form.data.location_id));
        formData.append('reservation_date', form.data.reservation_date);
        formData.append('reservation_time', form.data.reservation_time);
        formData.append('party_size', String(form.data.party_size));
        formData.append('customer_name', form.data.customer_name);
        formData.append('customer_phone', form.data.customer_phone);
        if (form.data.customer_email) formData.append('customer_email', form.data.customer_email);
        if (form.data.notes) formData.append('notes', form.data.notes);
        if (form.data.payment_proof) formData.append('payment_proof', form.data.payment_proof);

        try {
            const response = await axios.post(route('tenant.reservations.store', tenant.slug), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                setCreatedReservation(response.data.reservation);
                setStep(5);
                toast.success('Reserva confirmada con éxito');
            }
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                // Set errors in form
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    form.setError(key as any, errors[key][0]);
                });
                toast.error('Por favor corrige los errores en el formulario');
            } else {
                toast.error('Error al procesar la reserva. Intenta nuevamente.');
                console.error(error);
            }
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado al portapapeles");
    };

    return (
        <PublicLayout bgColor={bg_color} showFloatingCart={false}>
            <Head title={`Reservar en ${tenant.name}`} />

            <div className="flex flex-col">
                <Header
                    tenantName={tenant.name}
                    logoUrl={tenant.logo_url}
                    description={tenant.store_description}
                    bgColor={bg_color}
                    textColor={name_color}
                />
            </div>

            <div className="flex-1 bg-slate-50 p-4 -mt-4 relative z-0 pb-20">
                <Card className="w-full shadow-lg border-t-4 border-indigo-600 mb-8 mt-4">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-bold text-slate-800">
                            {step === 5 ? '¡Reserva Confirmada!' : `Reservar Mesa`}
                        </CardTitle>
                        <CardDescription>
                            {step === 0 && "Selecciona la sede"}
                            {step === 1 && "Selecciona cuándo quieres visitarnos"}
                            {step === 2 && "Tus datos de contacto"}
                            {step === 3 && "Pago y Comprobante"}
                            {step === 4 && "Confirma los detalles"}
                            {step === 5 && "Gracias por tu reserva. Te hemos enviado un WhatsApp."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Step 0: Location Selection */}
                        {step === 0 && (
                            <div className="space-y-4">
                                <p className="text-sm text-center text-slate-600">Por favor selecciona una sede para continuar:</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {locations.map((loc) => (
                                        <div
                                            key={loc.id}
                                            onClick={() => {
                                                form.setData('location_id', loc.id);
                                                setStep(1);
                                            }}
                                            className="cursor-pointer p-4 rounded-lg border hover:border-indigo-500 hover:bg-slate-50 transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-slate-900">{loc.name}</h3>
                                                    <p className="text-xs text-slate-500">{loc.address}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 1: Date, Time & Pax */}
                        {step === 1 && (
                            <div className="space-y-6">
                                {/* Pax */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4 text-indigo-600" />
                                        Cantidad de Personas
                                    </label>
                                    <div className="flex items-center gap-4 justify-center bg-slate-100 p-3 rounded-lg">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-full border-slate-300"
                                            onClick={() => form.setData('party_size', Math.max(1, form.data.party_size - 1))}
                                            disabled={form.data.party_size <= 1}
                                        >
                                            -
                                        </Button>
                                        <span className="text-2xl font-bold w-12 text-center text-slate-800">{form.data.party_size}</span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-10 w-10 rounded-full border-slate-300"
                                            onClick={() => form.setData('party_size', form.data.party_size + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-indigo-600" />
                                        Fecha
                                    </label>
                                    <Input
                                        type="date"
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                        value={form.data.reservation_date}
                                        onChange={(e) => form.setData('reservation_date', e.target.value)}
                                        className="bg-white"
                                    />
                                </div>

                                {/* Timer Slots */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-600" />
                                        Hora Disponible
                                    </label>
                                    {timeSlots.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.map((slot) => (
                                                <Button
                                                    key={slot}
                                                    type="button"
                                                    variant={form.data.reservation_time === slot ? 'default' : 'outline'}
                                                    className={`w-full ${form.data.reservation_time === slot ? 'bg-indigo-600 hover:bg-indigo-700' : 'hover:bg-indigo-50'}`}
                                                    onClick={() => form.setData('reservation_time', slot)}
                                                >
                                                    {format(parse(slot, 'HH:mm', new Date()), 'h:mm a')}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 bg-amber-50 rounded-lg text-amber-700 border border-amber-200">
                                            <AlertCircle className="w-8 h-8 mb-2" />
                                            <p className="text-sm text-center">No hay horarios disponibles para esta fecha.</p>
                                        </div>
                                    )}
                                    {form.errors.reservation_time && (
                                        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{form.errors.reservation_time}</p>
                                    )}
                                </div>

                                <Button
                                    className="w-full mt-4"
                                    onClick={() => {
                                        if (!form.data.reservation_time) {
                                            toast.error("Por favor selecciona una hora");
                                            return;
                                        }
                                        setStep(2);
                                    }}
                                >
                                    Continuar <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}

                        {/* Step 2: Contact Info */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <User className="w-4 h-4 text-slate-500" />
                                        Tu Nombre
                                    </label>
                                    <Input
                                        placeholder="Ej: Juan Pérez"
                                        value={form.data.customer_name}
                                        onChange={(e) => form.setData('customer_name', e.target.value)}
                                    />
                                    {form.errors.customer_name && <p className="text-xs text-red-500">{form.errors.customer_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-500" />
                                        WhatsApp
                                    </label>
                                    <Input
                                        placeholder="Ej: 3001234567"
                                        type="tel"
                                        value={form.data.customer_phone}
                                        onChange={(e) => form.setData('customer_phone', e.target.value)}
                                    />
                                    {form.errors.customer_phone && <p className="text-xs text-red-500">{form.errors.customer_phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        Correo (Opcional)
                                    </label>
                                    <Input
                                        placeholder="correo@ejemplo.com"
                                        type="email"
                                        value={form.data.customer_email}
                                        onChange={(e) => form.setData('customer_email', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        Notas Especiales
                                    </label>
                                    <Textarea
                                        placeholder="Cumpleaños, alergias, mesa en terraza..."
                                        value={form.data.notes}
                                        onChange={(e) => form.setData('notes', e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={() => {
                                            if (!form.data.customer_name || !form.data.customer_phone) {
                                                toast.error("Nombre y Teléfono son obligatorios");
                                                return;
                                            }
                                            setStep(3);
                                        }}
                                    >
                                        Continuar <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment (Bank Info & Proof) - Checkout Style */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Banknote className="w-5 h-5 text-blue-600 mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-blue-900">Datos Bancarios</h3>
                                            <p className="text-xs text-blue-700 mb-2">Envía el comprobante a una de las siguientes cuentas:</p>
                                        </div>
                                    </div>

                                    {/* Bank Accounts List from Checkout */}
                                    {bankAccounts && bankAccounts.length > 0 ? (
                                        <div className="space-y-2 mb-4">
                                            {bankAccounts.map((account: any) => (
                                                <div key={account.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex justify-between items-center shadow-sm">
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{account.bank_name}</p>
                                                        <p className="font-mono text-slate-600 mt-0.5">{account.account_type}</p>
                                                        <p className="font-mono font-bold text-slate-800 text-sm tracking-wide">{account.account_number}</p>
                                                        {account.account_holder && <p className="text-[10px] text-slate-400 uppercase mt-1">Titular: {account.account_holder}</p>}
                                                    </div>
                                                    <Button
                                                        size="icon" variant="secondary" className="h-9 w-9 shrink-0 text-slate-600 hover:text-slate-900"
                                                        onClick={(e) => { e.preventDefault(); copyToClipboard(account.account_number); }}
                                                        title="Copiar número"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-yellow-50 text-yellow-700 text-xs rounded mb-3 border border-yellow-100">
                                            No hay cuentas bancarias configuradas. Consulta al establecimiento.
                                        </div>
                                    )}

                                    {/* Payment Proof Upload - Matches Checkout Logic */}
                                    <div className="mt-4">
                                        <Label htmlFor="proof" className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                            Comprobante de Pago
                                            {selectedLocation?.reservation_payment_proof_required && (
                                                <Badge variant="destructive" className="text-[10px] h-4 px-1">Obligatorio</Badge>
                                            )}
                                        </Label>
                                        <div className="mt-2 flex items-center gap-3">
                                            <Input
                                                id="proof"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        form.setData('payment_proof', e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="proof"
                                                className={`cursor-pointer bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center active:scale-95 ${!form.data.payment_proof && selectedLocation?.reservation_payment_proof_required ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                                            >
                                                <Upload className="w-4 h-4" />
                                                {form.data.payment_proof ? 'Cambiar archivo' : 'Subir Comprobante'}
                                            </label>
                                        </div>
                                        {form.data.payment_proof && (
                                            <div className="mt-2 flex items-center gap-2 text-green-600 text-xs font-bold animate-in fade-in">
                                                <FileText className="w-3 h-3" />
                                                <span className="truncate max-w-[250px]">{form.data.payment_proof.name}</span>
                                            </div>
                                        )}
                                        <p className="text-xs text-slate-500 mt-2">
                                            Sube una captura de la transferencia para agilizar la confirmación.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        onClick={() => {
                                            if (selectedLocation?.reservation_payment_proof_required && !form.data.payment_proof) {
                                                toast.error('Debes subir el comprobante de pago para continuar.');
                                                return;
                                            }
                                            setStep(4);
                                        }}
                                    >
                                        Continuar <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Summary Confirmation */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <h3 className="font-semibold text-slate-900 mb-3 border-b pb-2">Resumen de Reserva</h3>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="block text-xs text-slate-500">Ubicación</span>
                                            <span className="font-medium">{selectedLocation?.name}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-500">Personas</span>
                                            <span className="font-medium">{form.data.party_size}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-500">Fecha</span>
                                            <span className="font-medium">{form.data.reservation_date}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-500">Hora</span>
                                            <span className="font-medium">
                                                {form.data.reservation_time ? format(parse(form.data.reservation_time, 'HH:mm', new Date()), 'h:mm a') : '-'}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-slate-900 mt-4 mb-3 border-b pb-2">Datos de Contacto</h3>
                                    <div className="text-sm space-y-1">
                                        <p><span className="text-slate-500 w-16 inline-block">Nombre:</span> {form.data.customer_name}</p>
                                        <p><span className="text-slate-500 w-16 inline-block">Tel:</span> {form.data.customer_phone}</p>
                                        {form.data.customer_email && <p><span className="text-slate-500 w-16 inline-block">Email:</span> {form.data.customer_email}</p>}
                                    </div>

                                    {form.data.payment_proof && (
                                        <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded text-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Comprobante adjuntado</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Editar
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={handleSubmit}
                                        disabled={form.processing}
                                    >
                                        {form.processing ? 'Enviando...' : 'Confirmar Reserva'}
                                    </Button>
                                </div>
                            </div>
                        )}


                        {/* Step 5: Success */}
                        {step === 5 && (
                            <div className="py-8 text-center space-y-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-900">¡Reserva Solicitada!</h3>
                                    <div className="bg-slate-100 p-4 rounded-lg inline-block w-full max-w-xs">
                                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Código de Reserva</p>
                                        <p className="text-3xl font-mono font-black text-indigo-600 tracking-wider">
                                            #{String(createdReservation?.id || '000').padStart(4, '0')}
                                        </p>
                                    </div>

                                    {/* Reservation Details Summary */}
                                    <div className="bg-slate-50 p-4 rounded-lg w-full max-w-sm mx-auto border border-slate-200 text-left space-y-3 shadow-sm">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Ubicación:</span>
                                            <span className="font-medium text-slate-900">{selectedLocation?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Fecha:</span>
                                            <span className="font-medium text-slate-900">{form.data.reservation_date}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4" /> Hora:</span>
                                            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                                {form.data.reservation_time ? format(parse(form.data.reservation_time, 'HH:mm', new Date()), 'h:mm a') : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 flex items-center gap-2"><Users className="w-4 h-4" /> Personas:</span>
                                            <span className="font-medium text-slate-900">{form.data.party_size}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm max-w-sm mx-auto">
                                        Hemos recibido tu solicitud. Te enviaremos una confirmación a tu WhatsApp <strong>{form.data.customer_phone}</strong> en breve.
                                    </p>
                                    <Button variant="outline" onClick={() => window.location.reload()}>
                                        Hacer otra reserva
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
