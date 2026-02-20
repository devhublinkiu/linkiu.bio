import { useRef, useState } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { ArrowLeft, Upload } from 'lucide-react';
import { FieldError } from '@/Components/ui/field';
import { RichTextEditor } from '@/Components/Shared/RichTextEditor';

const TYPES = [
    { value: 'new', label: 'Nuevo' },
    { value: 'fix', label: 'Corrección' },
    { value: 'improvement', label: 'Mejora' },
    { value: 'security', label: 'Seguridad' },
    { value: 'performance', label: 'Rendimiento' },
];

const ICON_OPTIONS = [
    { value: 'none', label: 'Sin icono' },
    { value: 'CalendarRange', label: 'CalendarRange' },
    { value: 'Sparkles', label: 'Sparkles' },
    { value: 'Package', label: 'Package' },
    { value: 'Wrench', label: 'Wrench' },
    { value: 'Shield', label: 'Shield' },
    { value: 'Zap', label: 'Zap' },
];

interface Category {
    id: number;
    name: string;
}

interface Release {
    id: number;
    release_note_category_id: number;
    title: string;
    slug: string;
    type: string;
    icon_name: string | null;
    cover_path: string | null;
    hero_path: string | null;
    snippet: string | null;
    body: string | null;
    published_at: string | null;
    status: string;
    is_featured: boolean;
    cover_url: string | null;
}

interface Props {
    release: Release;
    categories: Category[];
}

export default function Edit({ release, categories }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [initialBody] = useState(() => release.body ?? '');
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        release_note_category_id: release.release_note_category_id.toString(),
        title: release.title,
        slug: release.slug,
        type: release.type,
        icon_name: release.icon_name || '',
        cover_path: release.cover_path || '',
        cover_preview: release.cover_url,
        cover: null as File | null,
        hero_path: release.hero_path || '',
        snippet: release.snippet || '',
        body: release.body || '',
        published_at: release.published_at ? release.published_at.slice(0, 10) : '',
        status: release.status,
        is_featured: release.is_featured,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('release-notes.update', release.id));
    };

    return (
        <SuperAdminLayout header="Editar Release Note">
            <Head title="Editar Release Note" />
            <div className="max-w-3xl mx-auto py-6">
                <Button variant="ghost" className="mb-4 pl-0" asChild>
                    <Link href={route('release-notes.index')} className="flex items-center gap-2 text-muted-foreground hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al listado
                    </Link>
                </Button>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contenido</CardTitle>
                            <CardDescription>Título, categoría, tipo y resumen.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Categoría</Label>
                                    <Select value={data.release_note_category_id} onValueChange={(v) => setData('release_note_category_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.release_note_category_id}</FieldError>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tipo</Label>
                                    <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TYPES.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.type}</FieldError>
                                </div>
                                <div className="space-y-2">
                                    <Label>Icono</Label>
                                    <Select value={data.icon_name === '' ? 'none' : data.icon_name} onValueChange={(v) => setData('icon_name', v === 'none' ? '' : v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Icono (Lucide)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ICON_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.icon_name}</FieldError>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <FieldError>{errors.title}</FieldError>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                />
                                <FieldError>{errors.slug}</FieldError>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="snippet">Resumen / Snippet</Label>
                                <Textarea
                                    id="snippet"
                                    value={data.snippet}
                                    onChange={(e) => setData('snippet', e.target.value)}
                                    rows={3}
                                />
                                <FieldError>{errors.snippet}</FieldError>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Imagen y cuerpo</CardTitle>
                            <CardDescription>Portada y cuerpo en HTML o texto.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Imagen de portada (cover)</Label>
                                <div className="flex flex-wrap gap-3 items-start">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Abrir ventana de carga
                                    </Button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setData('cover', file);
                                                setData('cover_preview', URL.createObjectURL(file));
                                                setData('cover_path', '');
                                            }
                                            e.target.value = '';
                                        }}
                                    />
                                    {data.cover_preview && (
                                        <div className="relative">
                                            <img src={data.cover_preview} alt="Vista previa" className="h-24 w-32 object-cover rounded border" />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-muted"
                                                onClick={() => {
                                                    setData('cover', null);
                                                    setData('cover_preview', null);
                                                    setData('cover_path', '');
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <FieldError>{errors.cover_path}</FieldError>
                            </div>
                            <div className="space-y-2">
                                <Label>Cuerpo</Label>
                                <RichTextEditor
                                    initialContent={initialBody}
                                    onChange={(html) => setData('body', html)}
                                    placeholder="Contenido del release…"
                                    uploadImageUrl={route('release-notes.upload-image')}
                                />
                                <FieldError>{errors.body}</FieldError>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Publicación</CardTitle>
                            <CardDescription>Fecha, estado y destacado.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="published_at">Fecha de publicación</Label>
                                    <Input
                                        id="published_at"
                                        type="date"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                    />
                                    <FieldError>{errors.published_at}</FieldError>
                                </div>
                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Borrador</SelectItem>
                                            <SelectItem value="published">Publicado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FieldError>{errors.status}</FieldError>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onCheckedChange={(v) => setData('is_featured', v)}
                                />
                                <Label htmlFor="is_featured">Marcar como destacado</Label>
                            </div>
                            <FieldError>{errors.is_featured}</FieldError>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>Guardar cambios</Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('release-notes.index')}>Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
