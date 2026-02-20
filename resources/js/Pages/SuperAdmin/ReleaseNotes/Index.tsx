import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Plus, Pencil, Trash2, Search, FolderPlus } from 'lucide-react';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/Components/ui/empty';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import Pagination from '@/Components/Shared/Pagination';
import { useState } from 'react';

const TYPE_LABELS: Record<string, string> = {
    new: 'Nuevo',
    fix: 'Corrección',
    improvement: 'Mejora',
    security: 'Seguridad',
    performance: 'Rendimiento',
};

interface Category {
    id: number;
    name: string;
}

interface Release {
    id: number;
    title: string;
    slug: string;
    type: string;
    status: string;
    published_at: string | null;
    is_featured: boolean;
    cover_url: string | null;
    release_note_category?: Category & { name: string };
}

interface Props {
    releases: { data: Release[]; links: any[] };
    categories: Category[];
    filters: { search?: string; category_id?: string };
}

export default function Index({ releases, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const releasesList = releases.data || releases;
    const releasesLinks = releases.links || [];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('release-notes.index'), { search, category_id: filters.category_id }, { preserveState: true, replace: true });
    };

    const handleCategoryFilter = (value: string) => {
        router.get(route('release-notes.index'), { search, category_id: value || undefined }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        router.delete(route('release-notes.destroy', id));
    };

    const formatDate = (d: string | null) => {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <SuperAdminLayout header="Release Notes">
            <Head title="Release Notes" />
            <div className="max-w-7xl mx-auto py-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Release Notes</h2>
                        <p className="text-muted-foreground">Novedades y changelog para la página pública.</p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button variant="outline" asChild>
                            <Link href={route('release-note-categories.index')}>
                                <FolderPlus className="mr-2 h-4 w-4" />
                                Crear categoría
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('release-notes.create')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo release
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle>Listado</CardTitle>
                                <CardDescription>Mostrando {releasesList.length} entrada(s).</CardDescription>
                            </div>
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1 sm:max-w-sm">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por título..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Button type="submit" variant="secondary">Buscar</Button>
                            </form>
                            {categories.length > 0 && (
                                <Select value={filters.category_id || 'all'} onValueChange={handleCategoryFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las categorías</SelectItem>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {releasesList.map((r: Release) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {r.cover_url && (
                                                    <img src={r.cover_url} alt="" className="h-10 w-14 object-cover rounded" />
                                                )}
                                                <span>{r.title}</span>
                                                {r.is_featured && (
                                                    <Badge variant="secondary" className="text-xs">Destacado</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{r.release_note_category?.name ?? '-'}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{TYPE_LABELS[r.type] ?? r.type}</Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{formatDate(r.published_at)}</TableCell>
                                        <TableCell>
                                            {r.status === 'published' ? (
                                                <Badge className="bg-green-600">Publicado</Badge>
                                            ) : (
                                                <Badge variant="secondary">Borrador</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('release-notes.edit', r.id)}>
                                                        <Pencil className="h-4 w-4 text-blue-600" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Eliminar este release note?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(r.id)} className="bg-red-600 hover:bg-red-700">
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {releasesList.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-[300px]">
                                            <Empty className="h-full">
                                                <EmptyHeader>
                                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                        <Plus className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    <EmptyTitle>No hay release notes</EmptyTitle>
                                                    <EmptyDescription>
                                                        Crea el primero o gestiona las categorías desde el botón «Crear categoría».
                                                    </EmptyDescription>
                                                </EmptyContent>
                                                <div className="mt-6 flex gap-2">
                                                    <Button asChild>
                                                        <Link href={route('release-notes.create')}>Crear release note</Link>
                                                    </Button>
                                                    <Button variant="outline" asChild>
                                                        <Link href={route('release-note-categories.index')}>Ir a categorías</Link>
                                                    </Button>
                                                </div>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {releasesLinks.length > 0 && (
                            <div className="mt-4 flex justify-end">
                                <Pagination links={releasesLinks} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
