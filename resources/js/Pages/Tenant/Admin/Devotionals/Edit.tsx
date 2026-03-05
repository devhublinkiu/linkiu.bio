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
import { RichTextEditor } from '@/Components/Shared/RichTextEditor';
import { ChevronLeft, BookOpen, Loader2 } from 'lucide-react';
interface DevotionalEdit {
    id: number;
    title: string;
    scripture_reference: string | null;
    scripture_text: string | null;
    body: string;
    prayer: string | null;
    author: string | null;
    date: string;
    reflection_question: string | null;
    cover_image: string | null;
    video_url: string | null;
    external_link: string | null;
    excerpt: string | null;
    order: number;
    is_published: boolean;
}

interface Props {
    devotional: DevotionalEdit;
}

export default function Edit({ devotional }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dateStr = typeof devotional.date === 'string' && devotional.date.length >= 10
        ? devotional.date.slice(0, 10)
        : new Date().toISOString().slice(0, 10);
    const [form, setForm] = useState({
        title: devotional.title,
        scripture_reference: devotional.scripture_reference ?? '',
        scripture_text: devotional.scripture_text ?? '',
        body: devotional.body,
        prayer: devotional.prayer ?? '',
        author: devotional.author ?? '',
        date: dateStr,
        reflection_question: devotional.reflection_question ?? '',
        cover_image_file: null as File | null,
        video_url: devotional.video_url ?? '',
        external_link: devotional.external_link ?? '',
        excerpt: devotional.excerpt ?? '',
        order: devotional.order,
        is_published: devotional.is_published,
    });
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const currentCoverUrl = devotional.cover_image ?? null;

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
            scripture_reference: form.scripture_reference || null,
            scripture_text: form.scripture_text || null,
            body: form.body,
            prayer: form.prayer || null,
            author: form.author || null,
            date: form.date,
            reflection_question: form.reflection_question || null,
            video_url: form.video_url || null,
            external_link: form.external_link || null,
            excerpt: form.excerpt || null,
            order: form.order,
            is_published: form.is_published,
        };
        if (form.cover_image_file) payload.cover_image_file = form.cover_image_file;
        const updateUrl = route('tenant.admin.devotionals.update', [currentTenant?.slug, devotional.id]);
        const options = {
            preserveScroll: true,
            onSuccess: () => toast.success('Devocional actualizado correctamente'),
            onError: (errs: Record<string, string>) => {
                setErrors(errs);
                toast.error('Revisa los campos del formulario');
            },
            onFinish: () => setProcessing(false),
        };
        if (form.cover_image_file) {
            router.post(updateUrl, { ...payload, _method: 'PUT' } as Record<string, string | number | boolean | File | null>, options);
        } else {
            router.put(updateUrl, payload as Record<string, string | number | boolean | File | null>, options);
        }
    };

    return (
        <AdminLayout title="Editar devocional">
            <Head title="Editar devocional" />

            <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <Link
                            href={route('tenant.admin.devotionals.index', currentTenant?.slug)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a Devocionales
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-2">
                            <BookOpen className="size-6 text-primary" />
                            Editar devocional
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Modifica título, versículo, reflexión, portada, video o enlace.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título *</Label>
                            <Input
                                id="title"
                                value={form.title}
                                onChange={(e) => setField('title', e.target.value)}
                                placeholder="Ej. Un tiempo para prepararse"
                                maxLength={255}
                                className={errors.title ? 'border-destructive' : ''}
                            />
                            {errors.title && <p className="text-destructive text-xs">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scripture_reference">Referencia bíblica</Label>
                            <Input
                                id="scripture_reference"
                                value={form.scripture_reference}
                                onChange={(e) => setField('scripture_reference', e.target.value)}
                                placeholder="Ej. 1 Reyes 17:5-7"
                                maxLength={255}
                                className={errors.scripture_reference ? 'border-destructive' : ''}
                            />
                            {errors.scripture_reference && <p className="text-destructive text-xs">{errors.scripture_reference}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="scripture_text">Texto del versículo</Label>
                            <Textarea
                                id="scripture_text"
                                value={form.scripture_text}
                                onChange={(e) => setField('scripture_text', e.target.value)}
                                placeholder="Pega aquí el texto del pasaje (opcional)"
                                rows={2}
                                className={errors.scripture_text ? 'border-destructive' : ''}
                            />
                            {errors.scripture_text && <p className="text-destructive text-xs">{errors.scripture_text}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="body">Reflexión / Mensaje *</Label>
                            <RichTextEditor
                                initialContent={form.body}
                                onChange={(html) => setField('body', html)}
                                placeholder="Reflexión o mensaje principal del devocional. Puedes usar negrita, listas, citas e imágenes."
                                uploadImageUrl={currentTenant?.slug ? route('tenant.admin.devotionals.upload-image', currentTenant.slug) : undefined}
                                className={errors.body ? 'border-destructive' : ''}
                            />
                            {errors.body && <p className="text-destructive text-xs">{errors.body}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prayer">Oración</Label>
                            <Textarea
                                id="prayer"
                                value={form.prayer}
                                onChange={(e) => setField('prayer', e.target.value)}
                                placeholder="Oración de cierre (opcional)"
                                rows={3}
                                className={errors.prayer ? 'border-destructive' : ''}
                            />
                            {errors.prayer && <p className="text-destructive text-xs">{errors.prayer}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="author">Autor</Label>
                            <Input
                                id="author"
                                value={form.author}
                                onChange={(e) => setField('author', e.target.value)}
                                placeholder="Ej. Pastor Juan Pérez"
                                maxLength={255}
                                className={errors.author ? 'border-destructive' : ''}
                            />
                            {errors.author && <p className="text-destructive text-xs">{errors.author}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Fecha del devocional *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={form.date}
                                onChange={(e) => setField('date', e.target.value)}
                                className={errors.date ? 'border-destructive' : ''}
                            />
                            {errors.date && <p className="text-destructive text-xs">{errors.date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reflection_question">Pregunta de reflexión</Label>
                            <Input
                                id="reflection_question"
                                value={form.reflection_question}
                                onChange={(e) => setField('reflection_question', e.target.value)}
                                placeholder="Ej. ¿Cómo puedes prepararte espiritualmente?"
                                maxLength={500}
                                className={errors.reflection_question ? 'border-destructive' : ''}
                            />
                            {errors.reflection_question && <p className="text-destructive text-xs">{errors.reflection_question}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cover_image_file">Imagen de portada</Label>
                            <p className="text-xs text-muted-foreground">Sube una nueva imagen para reemplazar la actual. Máx. 2 MB.</p>
                            <Input
                                id="cover_image_file"
                                type="file"
                                accept="image/*"
                                className={`cursor-pointer ${errors.cover_image_file ? 'border-destructive' : ''}`}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setField('cover_image_file', file ?? null);
                                    if (coverPreview) URL.revokeObjectURL(coverPreview);
                                    setCoverPreview(file ? URL.createObjectURL(file) : null);
                                }}
                            />
                            {(coverPreview || currentCoverUrl) && (
                                <div className="w-full max-w-[400px] aspect-[1200/630] rounded-lg border overflow-hidden bg-muted">
                                    <img
                                        src={coverPreview ?? currentCoverUrl ?? ''}
                                        alt="Portada"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            {errors.cover_image_file && <p className="text-destructive text-xs">{errors.cover_image_file}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="video_url">Video (YouTube o Vimeo)</Label>
                            <Input
                                id="video_url"
                                value={form.video_url}
                                onChange={(e) => setField('video_url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
                                className={errors.video_url ? 'border-destructive' : ''}
                            />
                            <p className="text-xs text-muted-foreground">URL del video; en la vista pública se mostrará incrustado.</p>
                            {errors.video_url && <p className="text-destructive text-xs">{errors.video_url}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="external_link">Enlace externo</Label>
                            <Input
                                id="external_link"
                                type="url"
                                value={form.external_link}
                                onChange={(e) => setField('external_link', e.target.value)}
                                placeholder="https://... (artículo u otro recurso)"
                                className={errors.external_link ? 'border-destructive' : ''}
                            />
                            {errors.external_link && <p className="text-destructive text-xs">{errors.external_link}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Resumen (para listados)</Label>
                            <Input
                                id="excerpt"
                                value={form.excerpt}
                                onChange={(e) => setField('excerpt', e.target.value)}
                                placeholder="Texto corto para tarjetas o vista previa"
                                maxLength={500}
                                className={errors.excerpt ? 'border-destructive' : ''}
                            />
                            {errors.excerpt && <p className="text-destructive text-xs">{errors.excerpt}</p>}
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
                                <Label htmlFor="is_published">Publicado</Label>
                                <p className="text-xs text-muted-foreground">Visible en la vista pública cuando esté activa.</p>
                            </div>
                            <Switch
                                id="is_published"
                                checked={form.is_published}
                                onCheckedChange={(checked) => setField('is_published', checked)}
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
                                onClick={() => router.visit(route('tenant.admin.devotionals.index', currentTenant?.slug))}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
