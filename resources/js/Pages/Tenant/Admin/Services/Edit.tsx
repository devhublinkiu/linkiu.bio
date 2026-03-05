import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Switch } from '@/Components/ui/switch';
import { ChevronLeft, Briefcase, Loader2 } from 'lucide-react';
import type { ChurchServiceItem } from './Index';

interface Props {
    service: ChurchServiceItem;
}

export default function Edit({ service }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        name: service.name,
        description: service.description ?? '',
        audience: service.audience ?? '',
        service_type: service.service_type ?? '',
        schedule: service.schedule ?? '',
        frequency: service.frequency ?? '',
        duration: service.duration ?? '',
        location: service.location ?? '',
        modality: service.modality ?? '',
        image_file: null as File | null,
        leader: service.leader ?? '',
        contact_info: service.contact_info ?? '',
        external_url: service.external_url ?? '',
        order: service.order,
        is_active: service.is_active,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const currentImageUrl = service.image_url ?? null;

    const setField = (field: string, value: string | number | boolean | File | null) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        const payload: Record<string, unknown> = {
            name: form.name,
            description: form.description || null,
            audience: form.audience || null,
            service_type: form.service_type || null,
            schedule: form.schedule || null,
            frequency: form.frequency || null,
            duration: form.duration || null,
            location: form.location || null,
            modality: form.modality || null,
            leader: form.leader || null,
            contact_info: form.contact_info || null,
            external_url: form.external_url || null,
            order: form.order,
            is_active: form.is_active,
        };
        if (form.image_file) payload.image_file = form.image_file;
        const updateUrl = route('tenant.admin.services.update', [currentTenant?.slug, service.id]);
        const options = {
            preserveScroll: true,
            onSuccess: () => toast.success('Servicio actualizado correctamente'),
            onError: (errs: Record<string, string>) => {
                setErrors(errs);
                toast.error('Revisa los campos del formulario');
            },
            onFinish: () => setProcessing(false),
        };
        if (form.image_file) {
            router.post(updateUrl, { ...payload, _method: 'PUT' } as Record<string, string | number | boolean | File | null>, options);
        } else {
            router.put(updateUrl, payload as Record<string, string | number | boolean | File | null>, options);
        }
    };

    return (
        <AdminLayout title="Editar servicio">
            <Head title="Editar servicio" />

            <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <Link
                            href={route('tenant.admin.services.index', currentTenant?.slug)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a Mis Servicios
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-2">
                            <Briefcase className="size-6 text-primary" />
                            Editar servicio
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Modifica los datos del servicio.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => setField('name', e.target.value)}
                                placeholder="Ej. Culto dominical"
                                maxLength={255}
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => setField('description', e.target.value)}
                                placeholder="Qué se hace, a quién va dirigido..."
                                rows={4}
                                className={errors.description ? 'border-destructive' : ''}
                            />
                            {errors.description && <p className="text-destructive text-xs">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="audience">Público / A quién va dirigido</Label>
                            <Input
                                id="audience"
                                value={form.audience}
                                onChange={(e) => setField('audience', e.target.value)}
                                placeholder="Ej. Jóvenes 15-25, Toda la familia, Mujeres"
                                maxLength={255}
                                className={errors.audience ? 'border-destructive' : ''}
                            />
                            {errors.audience && <p className="text-destructive text-xs">{errors.audience}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service_type">Tipo de servicio</Label>
                            <Input
                                id="service_type"
                                value={form.service_type}
                                onChange={(e) => setField('service_type', e.target.value)}
                                placeholder="Ej. Culto de adoración, Estudio bíblico, Reunión de oración"
                                maxLength={255}
                                className={errors.service_type ? 'border-destructive' : ''}
                            />
                            {errors.service_type && <p className="text-destructive text-xs">{errors.service_type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schedule">Horario</Label>
                            <Input
                                id="schedule"
                                value={form.schedule}
                                onChange={(e) => setField('schedule', e.target.value)}
                                placeholder="Ej. Domingos 10:00 a. m."
                                maxLength={500}
                                className={errors.schedule ? 'border-destructive' : ''}
                            />
                            {errors.schedule && <p className="text-destructive text-xs">{errors.schedule}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frecuencia</Label>
                            <Input
                                id="frequency"
                                value={form.frequency}
                                onChange={(e) => setField('frequency', e.target.value)}
                                placeholder="Ej. Semanal, Quincenal, Mensual"
                                maxLength={100}
                                className={errors.frequency ? 'border-destructive' : ''}
                            />
                            {errors.frequency && <p className="text-destructive text-xs">{errors.frequency}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duración</Label>
                            <Input
                                id="duration"
                                value={form.duration}
                                onChange={(e) => setField('duration', e.target.value)}
                                placeholder="Ej. 1:30 h, 2 horas"
                                maxLength={100}
                                className={errors.duration ? 'border-destructive' : ''}
                            />
                            {errors.duration && <p className="text-destructive text-xs">{errors.duration}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Lugar</Label>
                            <Input
                                id="location"
                                value={form.location}
                                onChange={(e) => setField('location', e.target.value)}
                                placeholder="Ej. Auditorio principal"
                                maxLength={500}
                                className={errors.location ? 'border-destructive' : ''}
                            />
                            {errors.location && <p className="text-destructive text-xs">{errors.location}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="modality">Modalidad</Label>
                            <Input
                                id="modality"
                                value={form.modality}
                                onChange={(e) => setField('modality', e.target.value)}
                                placeholder="Ej. Presencial, En línea, Híbrido"
                                maxLength={100}
                                className={errors.modality ? 'border-destructive' : ''}
                            />
                            {errors.modality && <p className="text-destructive text-xs">{errors.modality}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_file">Imagen</Label>
                            <p className="text-xs text-muted-foreground">Se redimensionará a 200 × 120 px. Máx. 2 MB. Sube una nueva para reemplazar la actual.</p>
                            <Input
                                id="image_file"
                                type="file"
                                accept="image/*"
                                className={`cursor-pointer ${errors.image_file ? 'border-destructive' : ''}`}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setField('image_file', file ?? null);
                                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                                    setImagePreview(file ? URL.createObjectURL(file) : null);
                                }}
                            />
                            {(imagePreview || currentImageUrl) && (
                                <div className="w-[200px] h-[120px] rounded-lg border overflow-hidden bg-muted">
                                    <img
                                        src={imagePreview ?? currentImageUrl ?? ''}
                                        alt="Vista previa"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            {errors.image_file && <p className="text-destructive text-xs">{errors.image_file}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="leader">Líder / Responsable</Label>
                            <Input
                                id="leader"
                                value={form.leader}
                                onChange={(e) => setField('leader', e.target.value)}
                                placeholder="Ej. Pastor Juan Pérez, Ministerio de jóvenes"
                                maxLength={255}
                                className={errors.leader ? 'border-destructive' : ''}
                            />
                            {errors.leader && <p className="text-destructive text-xs">{errors.leader}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact_info">Contacto o más información</Label>
                            <Input
                                id="contact_info"
                                value={form.contact_info}
                                onChange={(e) => setField('contact_info', e.target.value)}
                                placeholder="Ej. WhatsApp 300 123 4567, pregunta en recepción"
                                maxLength={500}
                                className={errors.contact_info ? 'border-destructive' : ''}
                            />
                            {errors.contact_info && <p className="text-destructive text-xs">{errors.contact_info}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="external_url">Enlace externo</Label>
                            <Input
                                id="external_url"
                                type="url"
                                value={form.external_url}
                                onChange={(e) => setField('external_url', e.target.value)}
                                placeholder="https://... (transmisión en vivo, Zoom, etc.)"
                                className={errors.external_url ? 'border-destructive' : ''}
                            />
                            {errors.external_url && <p className="text-destructive text-xs">{errors.external_url}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Orden</Label>
                            <Input
                                id="order"
                                type="number"
                                min={0}
                                value={form.order}
                                onChange={(e) => setField('order', parseInt(e.target.value, 10) || 0)}
                                className={errors.order ? 'border-destructive' : ''}
                            />
                            {errors.order && <p className="text-destructive text-xs">{errors.order}</p>}
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="is_active">Activo</Label>
                                <p className="text-xs text-muted-foreground">Visible en tu enlace cuando publiques esta sección.</p>
                            </div>
                            <Switch
                                id="is_active"
                                checked={form.is_active}
                                onCheckedChange={(checked) => setField('is_active', checked)}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={processing} className="gap-2">
                                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                Guardar cambios
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link href={route('tenant.admin.services.index', currentTenant?.slug)}>Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
