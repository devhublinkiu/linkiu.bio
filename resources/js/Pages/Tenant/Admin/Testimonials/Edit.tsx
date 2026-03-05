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
interface TestimonialEdit {
    id: number;
    title: string;
    body: string | null;
    video_url: string | null;
    image_url: string | null;
    category: string | null;
    is_featured: boolean;
    short_quote: string | null;
    author: string | null;
    is_published: boolean;
    order: number;
}

interface Props {
    testimonial: TestimonialEdit;
}

export default function Edit({ testimonial }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        title: testimonial.title,
        body: testimonial.body ?? '',
        video_url: testimonial.video_url ?? '',
        category: testimonial.category ?? '',
        is_featured: testimonial.is_featured,
        short_quote: testimonial.short_quote ?? '',
        author: testimonial.author ?? '',
        is_published: testimonial.is_published,
        order: testimonial.order,
        image_file: null as File | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const currentImageUrl = testimonial.image_url;

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

        const updateUrl = route('tenant.admin.testimonials.update', [currentTenant?.slug, testimonial.id]);
        const options = {
            preserveScroll: true,
            onSuccess: () => toast.success('Testimonio actualizado'),
            onError: (errs: Record<string, string>) => {
                setErrors(errs);
                toast.error('Revisa los campos');
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
        <AdminLayout title="Editar testimonio">
            <Head title="Editar testimonio" />

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
                            Editar testimonio
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
                                placeholder="Una frase para destacar"
                                maxLength={500}
                            />
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image_file">Imagen</Label>
                            <p className="text-xs text-muted-foreground">Sube una nueva para reemplazar la actual.</p>
                            <Input
                                id="image_file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setField('image_file', file ?? null);
                                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                                    setImagePreview(file ? URL.createObjectURL(file) : null);
                                }}
                            />
                            {(imagePreview || currentImageUrl) && (
                                <div className="w-40 h-24 rounded-lg border overflow-hidden bg-muted">
                                    <img
                                        src={imagePreview ?? currentImageUrl ?? ''}
                                        alt="Vista previa"
                                        className="w-full h-full object-cover"
                                    />
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
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Input
                                id="category"
                                value={form.category}
                                onChange={(e) => setField('category', e.target.value)}
                                placeholder="Ej. Conversión, Sanidad"
                                maxLength={100}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="order">Orden</Label>
                            <Input
                                id="order"
                                type="number"
                                min={0}
                                value={form.order}
                                onChange={(e) => setField('order', parseInt(e.target.value, 10) || 0)}
                            />
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
                                Guardar cambios
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
