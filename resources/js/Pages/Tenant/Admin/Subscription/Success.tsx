import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    CheckCircle2,
    ArrowRight,
    Rocket,
    Globe,
    LayoutDashboard,
    Zap,
    Download,
    UploadCloud,
    Clock,
    ShieldCheck,
    Loader2,
    FileText
} from 'lucide-react';
import { route } from 'ziggy-js';
import { getEcho } from '@/echo';
import { toast } from 'sonner';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { toPng } from 'html-to-image';
import { ReceiptTicket } from '@/Components/Tenant/Admin/Subscription/ReceiptTicket';

interface Props {
    tenant: any;
    plan: any;
    invoice: any;
}

export default function Success({ tenant, plan, invoice }: Props) {
    const isPaid = invoice.status === 'paid';
    const { width, height } = useWindowSize();
    const [showConfetti, setShowConfetti] = useState(isPaid);
    const receiptRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        invoice_id: invoice.id,
        proof: null as File | null,
    });

    // Real-time listener for payment approval
    useEffect(() => {
        const echo = getEcho();
        if (invoice.status !== 'pending_review' || !echo) return;
        const channel = `tenant-updates.${tenant.id}`;
        try {
            echo.channel(channel)
                .listen('.payment.status_updated', (e: any) => {
                    if (e.invoice_id === invoice.id && e.status === 'paid') {
                        setShowConfetti(true);
                        toast.success('¡Pago aprobado! Redirigiendo...');
                        router.reload();
                    }
                });

            return () => {
                try {
                    if (typeof (echo as any).leave === 'function') {
                        (echo as any).leave(channel);
                    }
                } catch (cleanupErr) {
                    console.error('[Echo] Cleanup error:', cleanupErr);
                }
            };
        } catch (err) {
            console.error('[Echo] Failed to subscribe:', err);
        }
    }, [invoice.status, invoice.id, tenant.id]);

    const handleDownloadReceipt = async () => {
        if (!receiptRef.current) return;

        try {
            const dataUrl = await toPng(receiptRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                skipFonts: true, // Skip external fonts to avoid CORS issues
                cacheBust: true, // Prevent caching issues
            });
            const link = document.createElement('a');
            link.download = `Recibo_Linkiu_#${invoice.id}.png`;
            link.href = dataUrl;
            link.click();
            toast.success('Recibo descargado correctamente.');
        } catch (err) {
            console.error('Failed to generate receipt:', err);
            toast.error('Error al generar el recibo. Por favor, intenta de nuevo.');
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.invoices.store', { tenant: tenant.slug }), {
            onSuccess: () => toast.success('Comprobante enviado con éxito.'),
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={isPaid ? "¡Pago Exitoso!" : "Procesando tu Suscripción"}>
            <Head title={isPaid ? "¡Felicidades! - Suscripción Activa" : "Carga tu Comprobante"} />

            <div className="max-w-2xl mx-auto py-12 px-4">
                <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white">
                    <div className="p-8 sm:p-12 text-center space-y-8 relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

                        {isPaid ? (
                            <PaidState tenant={tenant} plan={plan} invoice={invoice} onDownload={handleDownloadReceipt} />
                        ) : invoice.status === 'pending' ? (
                            <UploadState
                                data={data}
                                setData={setData}
                                handleUpload={handleUpload}
                                processing={processing}
                                plan={plan}
                                invoice={invoice}
                                errors={errors}
                            />
                        ) : (
                            <ReviewState plan={plan} tenant={tenant} />
                        )}
                    </div>
                </Card>

                <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {isPaid
                        ? "Un resumen de tu transacción ha sido enviado a tu correo electrónico."
                        : "Tu acceso Pro se activará en cuanto el equipo verifique tu transacción."}
                </p>
            </div>

            {/* Hidden Receipt for Capturing */}
            <div className="fixed left-[-9999px] top-0">
                <ReceiptTicket ref={receiptRef} invoice={invoice} tenant={tenant} plan={plan} />
            </div>

            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.15}
                    colors={['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#000000']}
                />
            )}
        </AdminLayout>
    );
}

function PaidState({ tenant, plan, invoice, onDownload }: { tenant: any, plan: any, invoice: any, onDownload?: () => void }) {
    return (
        <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-16 h-16" />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                    ¡Bienvenido al <span className="text-primary">{plan.name}</span>!
                </h2>
                <p className="text-slate-500 font-bold text-md max-w-md mx-auto leading-relaxed">
                    Tu pago ha sido procesado correctamente. Tu marca acaba de subir de nivel. 🚀
                </p>
            </div>

            {/* Order Detail Box */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tu Nueva URL</span>
                        <span className="text-sm font-black text-slate-900 underline decoration-primary decoration-2 underline-offset-4">
                            linkiu.bio/{tenant.slug}
                        </span>
                    </div>
                </div>
                <Button className="font-black text-[10px] uppercase tracking-widest gap-2" onClick={onDownload}>
                    <Download className="w-4 h-4" />
                    Recibo #{invoice.id}
                </Button>
            </div>

            {/* Next Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href={route('tenant.dashboard', { tenant: tenant.slug })} className="block group">
                    <Card className="p-6 rounded-3xl border-2 border-slate-50 group-hover:border-primary transition-all group-hover:bg-primary/5 text-left h-full">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <h4 className="font-black uppercase text-sm mb-1">Ir al Dashboard</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gestiona tu tienda ahora</p>
                    </Card>
                </Link>

                <Link href={route('tenant.profile.edit', { tenant: tenant.slug })} className="block group">
                    <Card className="p-6 rounded-3xl border-2 border-slate-50 group-hover:border-primary transition-all group-hover:bg-primary/5 text-left h-full">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5" />
                        </div>
                        <h4 className="font-black uppercase text-sm mb-1">Crea tu Primer Link</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Empieza a compartir tu marca</p>
                    </Card>
                </Link>
            </div>

            <div className="pt-4">
                <Button
                    asChild
                    className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg uppercase tracking-widest gap-3 shadow-xl"
                >
                    <Link href={route('tenant.dashboard', { tenant: tenant.slug })}>
                        ¡Comenzar Ahora!
                        <Rocket className="w-6 h-6 animate-bounce" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}

function UploadState({ data, setData, handleUpload, processing, plan, invoice, errors }: any) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UploadCloud className="w-10 h-10" />
                </div>
            </div>

            <div className="space-y-3">
                <Badge className="bg-slate-900 text-white font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                    Paso Final: Confirmar Pago
                </Badge>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                    Sube tu Comprobante
                </h2>
                <p className="text-slate-500 font-bold text-sm max-w-md mx-auto leading-relaxed">
                    Has seleccionado el plan **{plan.name}**. Sube una foto o PDF de tu transferencia para que podamos activarlo.
                </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
                <div className="relative group">
                    <input
                        type="file"
                        onChange={e => setData('proof', e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        accept="image/*,application/pdf"
                    />
                    <div className={cn(
                        "p-10 rounded-[32px] border-4 border-dashed transition-all flex flex-col items-center gap-4 bg-slate-50",
                        data.proof ? "border-primary bg-primary/5" : "border-slate-100 group-hover:border-slate-200"
                    )}>
                        {data.proof ? (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg animate-in zoom-in">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <span className="block font-black text-slate-900 uppercase text-xs truncate max-w-[200px]">
                                        {data.proof.name}
                                    </span>
                                    <span className="text-[10px] font-bold text-primary uppercase">Archivo listo para enviar</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="font-black text-slate-900 uppercase text-xs italic tracking-tight">Seleccionar archivo</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">PNG, JPG o PDF (máx. 4MB)</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {errors.proof && <p className="text-xs font-bold text-destructive">{errors.proof}</p>}

                <Button
                    type="submit"
                    disabled={processing || !data.proof}
                    className="w-full h-16 rounded-[24px] bg-primary hover:bg-primary/90 text-white font-black text-xl uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                    {processing ? 'Enviando...' : 'Notificar al Sistema'}
                    <Rocket className="w-6 h-6 ml-3" />
                </Button>
            </form>
        </div>
    );
}

function ReviewState({ plan, tenant }: { plan: any, tenant: any }) {
    return (
        <div className="py-12 space-y-8 animate-in zoom-in duration-500">
            <div className="flex justify-center relative">
                <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 relative z-10">
                    <Clock className="w-12 h-12 animate-pulse" />
                </div>
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-amber-500 border-t-transparent animate-spin opacity-20" />
            </div>

            <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
                    Verificando tu Pago
                </h2>
                <div className="space-y-6">
                    <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
                        "Estamos procesando tu pago... por favor espera un momento mientras validamos los datos."
                    </p>

                    <div className="max-w-xs mx-auto p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 flex justify-center items-center gap-4">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Estado: En Revisión Manual</span>
                    </div>
                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Mientras tanto puedes:</p>
                        <Button asChild className="h-10 rounded-xl px-8 font-black uppercase text-xs tracking-widest border-2">
                            <Link href={route('tenant.dashboard', { tenant: plan.tenant_slug || tenant.slug })}>
                                Volver al Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
