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
import { ChevronLeft, Quote, Loader2 } from 'lucide-react';

export default function Create() {
    const { currentTenant } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        title: '',
        body: '',
        video_url: '',
        category: '',
        is_featured: false,
        short_quote: '',
        author: '',
        is_published: false,
        order: 0,
        image_file: null as File | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
            body: form.body || null,
            video_url: form.video_url || null,
            category: form.category || null,
            is_featured: form.is_featured,
            short_quote: form.short_quote || null,
            author: form.author || null,
            is_published: form.is_published,
            order: form.order,
        };
        if (form.image_file) payload.image_file = form.image_file;

        router.post(route('tenant.admin.testimonials.store', currentTenant?.slug), payload as Record<string, string | number | boolean | File | null>, {
            preserveScroll: true,
            onSuccess: () => toast.success('Testimonio creado correctamente'),
            onError: (errs) => {
                setErrors(errs as Record<string, string>);
                toast.error('Revisa los campos');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Nuevo testimonio">
            <Head title="Nuevo testimonio" />

            <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <Link
                            href={route('tenant.admin.testimonials.index', currentTenant?.slug)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a Testimonios
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-2">
                            <Quote className="size-6 text-primary" />
                            Nuevo testimonio
                        </h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={form.title}
                                onChange={(e) => setField('title', e.target.value)}
                                placeholder="Ej. Cómo Dios transformó mi familia"
                                maxLength={255}
                                className={errors.title ? 'border-destructive' : ''}
                            />
                            {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="body">Texto del testimonio</Label>
                            <Textarea
                                id="body"
                                value={form.body}
                                onChange={(e) => setField('body', e.target.value)}
                                placeholder="Cuenta la historia..."
                                rows={5}
                                className={errors.body ? 'border-destructive' : ''}
                            />
                            {errors.body && <p className="text-destructive text-xs">{errors.body}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="short_quote">Cita corta</Label>
                            <Input
                                id="short_quote"
                                value={form.short_quote}
                                onChange={(e) => setField('short_quote', e.target.value)}
                                placeholder="Una frase para destacar (máx. 500 caracteres)"
                                maxLength={500}
                                className={errors.short_quote ? 'border-destructive' : ''}
                            />
                            {errors.short_quote && <p className="text-destructive text-xs">{errors.short_quote}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="video_url">Enlace del video (YouTube)</Label>
                            <Input
                                id="video_url"
                                type="url"
                                value={form.video_url}
                                onChange={(e) => setField('video_url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {errors.video_url && <p className="text-destructive text-xs">{errors.video_url}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_file">Imagen</Label>
                            <p className="text-xs text-muted-foreground">Opcional. Se usará en el listado. Máx. 2 MB.</p>
                            <Input
                                id="image_file"
                                type="file"
                                accept="image/*"
                                className={errors.image_file ? 'border-destructive' : ''}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setField('image_file', file ?? null);
                                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                                    setImagePreview(file ? URL.createObjectURL(file) : null);
                                }}
                            />
                            {errors.image_file && <p className="text-destructive text-xs">{errors.image_file}</p>}
                            {imagePreview && (
                                <div className="w-40 h-24 rounded-lg border overflow-hidden bg-muted">
                                    <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="author">Autor</Label>
                            <Input
                                id="author"
                                value={form.author}
                                onChange={(e) => setField('author', e.target.value)}
                                placeholder="Nombre o anónimo"
                                maxLength={255}
                                className={errors.author ? 'border-destructive' : ''}
                            />
                            {errors.author && <p className="text-destructive text-xs">{errors.author}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Input
                                id="category"
                                value={form.category}
                                onChange={(e) => setField('category', e.target.value)}
                                placeholder="Ej. Conversión, Sanidad, Familia"
                                maxLength={100}
                                className={errors.category ? 'border-destructive' : ''}
                            />
                            {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
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
                                <Label htmlFor="is_featured">Destacado</Label>
                                <p className="text-xs text-muted-foreground">Mostrar en sección destacada</p>
                            </div>
                            <Switch id="is_featured" checked={form.is_featured} onCheckedChange={(c) => setField('is_featured', c)} />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="is_published">Publicado</Label>
                                <p className="text-xs text-muted-foreground">Visible en tu enlace público</p>
                            </div>
                            <Switch id="is_published" checked={form.is_published} onCheckedChange={(c) => setField('is_published', c)} />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={processing} className="gap-2">
                                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                Crear testimonio
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('tenant.admin.testimonials.index', currentTenant?.slug)}>Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
