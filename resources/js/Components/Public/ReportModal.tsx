import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';

const CATEGORIES = [
    { value: 'problema_pedido', label: 'Problema con pedido' },
    { value: 'publicidad_enganosa', label: 'Publicidad engañosa' },
    { value: 'trato_indebido', label: 'Trato indebido' },
    { value: 'producto_servicio', label: 'Producto o servicio' },
    { value: 'otro', label: 'Otro' },
] as const;

interface ReportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenantSlug: string;
}

export default function ReportModal({ open, onOpenChange, tenantSlug }: ReportModalProps) {
    const [category, setCategory] = useState<string>('otro');
    const [message, setMessage] = useState('');
    const [reporterEmail, setReporterEmail] = useState('');
    const [reporterWhatsapp, setReporterWhatsapp] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const resetForm = () => {
        setCategory('otro');
        setMessage('');
        setReporterEmail('');
        setReporterWhatsapp('');
        setImage(null);
        setErrors({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!message.trim()) {
            setErrors({ message: 'Describe el problema (obligatorio).' });
            return;
        }

        setIsSubmitting(true);
        const url = route('tenant.report.store', { tenant: tenantSlug });

        const formData: Record<string, string | File | undefined> = {
            category,
            message: message.trim(),
            url_context: typeof window !== 'undefined' ? window.location.href : '',
        };
        if (reporterEmail.trim()) formData.reporter_email = reporterEmail.trim();
        if (reporterWhatsapp.trim()) formData.reporter_whatsapp = reporterWhatsapp.trim();
        if (image) formData.image = image;

        router.post(url, formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Gracias, hemos recibido tu reporte. Lo revisaremos a la brevedad.');
                onOpenChange(false);
                resetForm();
            },
            onError: (err) => {
                const next: Record<string, string> = {};
                if (typeof err === 'object' && err !== null) {
                    for (const [k, v] of Object.entries(err)) {
                        next[k] = Array.isArray(v) ? v[0] : String(v);
                    }
                }
                setErrors(next);
                toast.error('Revisa los campos e intenta de nuevo.');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reportar problema con este negocio</DialogTitle>
                    <DialogDescription>
                        Tu reporte es confidencial. Los datos de contacto son opcionales si prefieres ser anónimo.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="report-category">Categoría</Label>
                        <select
                            id="report-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={cn(
                                'h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
                            )}
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="report-message">Mensaje *</Label>
                        <Textarea
                            id="report-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe el problema..."
                            rows={4}
                            maxLength={2000}
                            className={errors.message ? 'border-destructive' : ''}
                        />
                        {errors.message && (
                            <p className="text-xs text-destructive">{errors.message}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="report-email">Correo (opcional)</Label>
                        <Input
                            id="report-email"
                            type="email"
                            value={reporterEmail}
                            onChange={(e) => setReporterEmail(e.target.value)}
                            placeholder="para poder contactarte"
                        />
                        {errors.reporter_email && (
                            <p className="text-xs text-destructive">{errors.reporter_email}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="report-whatsapp">WhatsApp (opcional)</Label>
                        <Input
                            id="report-whatsapp"
                            type="text"
                            value={reporterWhatsapp}
                            onChange={(e) => setReporterWhatsapp(e.target.value)}
                            placeholder="ej. 3001234567"
                        />
                        {errors.reporter_whatsapp && (
                            <p className="text-xs text-destructive">{errors.reporter_whatsapp}</p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="report-image">Evidencia con imagen (opcional)</Label>
                        <Input
                            id="report-image"
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                        />
                        {image && (
                            <p className="text-xs text-muted-foreground">{image.name}</p>
                        )}
                        {errors.image && (
                            <p className="text-xs text-destructive">{errors.image}</p>
                        )}
                    </div>
                    <DialogFooter showCloseButton={false}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
