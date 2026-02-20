import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { FieldError } from '@/Components/ui/field';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        sort_order: 0,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('release-note-categories.store'));
    };

    return (
        <SuperAdminLayout header="Crear categoría">
            <Head title="Crear categoría - Release Notes" />
            <div className="max-w-xl mx-auto py-6">
                <Button variant="ghost" className="mb-4 pl-0" asChild>
                    <Link href={route('release-note-categories.index')} className="flex items-center gap-2 text-muted-foreground hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al listado
                    </Link>
                </Button>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Nueva categoría</CardTitle>
                            <CardDescription>Nombre y slug (opcional; se genera desde el nombre si se deja vacío).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej. Producto, Plataforma, Registro de cambios"
                                />
                                <FieldError>{errors.name}</FieldError>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (opcional)</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="producto"
                                />
                                <FieldError>{errors.slug}</FieldError>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Orden</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value, 10) || 0)}
                                />
                                <FieldError>{errors.sort_order}</FieldError>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing}>
                                    Crear categoría
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('release-note-categories.index')}>Cancelar</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
