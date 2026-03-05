import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { ChevronLeft, Headphones, Loader2, Upload } from 'lucide-react';

export default function Create() {
    const { currentTenant } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        title: '',
        audio_file: null as File | null,
        duration_seconds: 0,
        sort_order: 0,
        is_published: true,
    });
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
            title: form.title,
            duration_seconds: form.duration_seconds,
            sort_order: form.sort_order,
            is_published: form.is_published,
        };
        if (form.audio_file) payload.audio_file = form.audio_file;
        router.post(route('tenant.admin.audio-dosis.store', currentTenant?.slug), payload as Record<string, string | number | boolean | File | null>, {
            preserveScroll: true,
            forceFormData: !!form.audio_file,
            onSuccess: () => toast.success('Episodio creado correctamente'),
            onError: (errs) => {
                setErrors(errs as Record<string, string>);
                toast.error('Revisa los campos del formulario');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Nuevo episodio">
            <Head title="Nuevo episodio" />

            <div className="max-w-xl mx-auto">
                <div>
                    <Link
                        href={route('tenant.admin.audio-dosis.index', currentTenant?.slug)}
                        className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> Volver a Audio Dosis
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-2">
                        <Headphones className="size-6 text-primary" />
                        Nuevo episodio
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Título, archivo de audio y duración. Formatos: MP3, WAV, OGG, M4A (máx. 100 MB).
                    </p>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-6 rounded-xl border bg-card p-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                            placeholder="Ej: Mensaje del domingo"
                            className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Archivo de audio *</Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".mp3,.mpeg,.wav,.ogg,.m4a,audio/mpeg,audio/wav,audio/ogg,audio/mp4"
                            className="hidden"
                            onChange={(e) => setField('audio_file', e.target.files?.[0] ?? null)}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="size-4" />
                            {form.audio_file ? form.audio_file.name : 'Seleccionar archivo (MP3, WAV, OGG, M4A)'}
                        </Button>
                        {errors.audio_file && <p className="text-destructive text-xs">{errors.audio_file}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration_seconds">Duración (segundos) *</Label>
                            <Input
                                id="duration_seconds"
                                type="number"
                                min={0}
                                value={form.duration_seconds === 0 ? '' : form.duration_seconds}
                                onChange={(e) => setField('duration_seconds', parseInt(e.target.value, 10) || 0)}
                                placeholder="Ej: 900"
                                className={errors.duration_seconds ? 'border-destructive' : ''}
                            />
                            {errors.duration_seconds && <p className="text-destructive text-xs">{errors.duration_seconds}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sort_order">Orden</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={form.sort_order}
                                onChange={(e) => setField('sort_order', parseInt(e.target.value, 10) || 0)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            id="is_published"
                            checked={form.is_published}
                            onCheckedChange={(v) => setField('is_published', v)}
                        />
                        <Label htmlFor="is_published">Publicado (visible en la página pública)</Label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Crear episodio
                        </Button>
                        <Link href={route('tenant.admin.audio-dosis.index', currentTenant?.slug)}>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
