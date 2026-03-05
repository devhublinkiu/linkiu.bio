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
import { ChevronLeft, Users, Loader2 } from 'lucide-react';

export default function Create() {
    const { currentTenant } = usePage<PageProps>().props;
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        name: '',
        role: '',
        photo_file: null as File | null,
        bio: '',
        email: '',
        phone: '',
        whatsapp: '',
        order: 0,
        is_published: true,
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
            role: form.role || null,
            bio: form.bio || null,
            email: form.email || null,
            phone: form.phone || null,
            whatsapp: form.whatsapp || null,
            order: form.order,
            is_published: form.is_published,
        };
        if (form.photo_file) payload.photo_file = form.photo_file;
        router.post(route('tenant.admin.collaborators.store', currentTenant?.slug), payload as Record<string, string | number | boolean | File | null>, {
            preserveScroll: true,
            onSuccess: () => toast.success('Colaborador creado correctamente'),
            onError: (errs) => {
                setErrors(errs as Record<string, string>);
                toast.error('Revisa los campos del formulario');
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Nuevo colaborador">
            <Head title="Nuevo colaborador" />

            <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div>
                        <Link
                            href={route('tenant.admin.collaborators.index', currentTenant?.slug)}
                            className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" /> Volver a Colaboradores
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-2">
                            <Users className="size-6 text-primary" />
                            Nuevo colaborador
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Nombre, cargo, foto y biografía para la página Nuestro equipo.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={form.name}
                                onChange={(e) => setField('name', e.target.value)}
                                placeholder="Ej. Juan Pérez"
                                maxLength={255}
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Cargo / ministerio</Label>
                            <Input
                                id="role"
                                value={form.role}
                                onChange={(e) => setField('role', e.target.value)}
                                placeholder="Ej. Pastor principal, Líder de alabanza"
                                maxLength={255}
                                className={errors.role ? 'border-destructive' : ''}
                            />
                            {errors.role && <p className="text-destructive text-xs">{errors.role}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photo_file">Foto</Label>
                            <p className="text-xs text-muted-foreground">Se usará como foto de perfil (cuadrada). Máx. 2 MB.</p>
                            <Input
                                id="photo_file"
                                type="file"
                                accept="image/*"
                                className={`cursor-pointer ${errors.photo_file ? 'border-destructive' : ''}`}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    setField('photo_file', file ?? null);
                                    if (photoPreview) URL.revokeObjectURL(photoPreview);
                                    setPhotoPreview(file ? URL.createObjectURL(file) : null);
                                }}
                            />
                            {photoPreview && (
                                <div className="w-24 h-24 rounded-full border overflow-hidden bg-muted">
                                    <img src={photoPreview} alt="Vista previa" className="w-full h-full object-cover" />
                                </div>
                            )}
                            {errors.photo_file && <p className="text-destructive text-xs">{errors.photo_file}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Biografía</Label>
                            <Textarea
                                id="bio"
                                value={form.bio}
                                onChange={(e) => setField('bio', e.target.value)}
                                placeholder="Breve descripción o ministerio"
                                rows={4}
                                maxLength={2000}
                                className={errors.bio ? 'border-destructive' : ''}
                            />
                            {errors.bio && <p className="text-destructive text-xs">{errors.bio}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setField('email', e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    maxLength={255}
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    value={form.phone}
                                    onChange={(e) => setField('phone', e.target.value)}
                                    placeholder="+57 300 123 4567"
                                    maxLength={64}
                                    className={errors.phone ? 'border-destructive' : ''}
                                />
                                {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input
                                id="whatsapp"
                                value={form.whatsapp}
                                onChange={(e) => setField('whatsapp', e.target.value)}
                                placeholder="Número con código de país (ej. 573001234567)"
                                maxLength={64}
                                className={errors.whatsapp ? 'border-destructive' : ''}
                            />
                            {errors.whatsapp && <p className="text-destructive text-xs">{errors.whatsapp}</p>}
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
                            <p className="text-xs text-muted-foreground">Menor número aparece primero.</p>
                            {errors.order && <p className="text-destructive text-xs">{errors.order}</p>}
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <Label htmlFor="is_published">Publicado</Label>
                                <p className="text-xs text-muted-foreground">Visible en la web (Nuestro equipo)</p>
                            </div>
                            <Switch
                                id="is_published"
                                checked={form.is_published}
                                onCheckedChange={(v) => setField('is_published', v)}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={processing} className="gap-2">
                                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                Crear colaborador
                            </Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('tenant.admin.collaborators.index', currentTenant?.slug)}>Cancelar</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
