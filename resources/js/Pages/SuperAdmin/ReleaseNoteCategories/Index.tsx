import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
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

interface Category {
    id: number;
    name: string;
    slug: string | null;
    sort_order: number;
}

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const handleDelete = (id: number) => {
        router.delete(route('release-note-categories.destroy', id));
    };

    return (
        <SuperAdminLayout header="Categorías de Release Notes">
            <Head title="Categorías - Release Notes" />
            <div className="max-w-4xl mx-auto py-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Categorías</h2>
                        <p className="text-muted-foreground">
                            Gestiona las categorías para las release notes.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('release-note-categories.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Crear categoría
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado</CardTitle>
                        <CardDescription>
                            {categories.length} categoría(s).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Orden</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className="font-medium">{cat.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{cat.slug || '-'}</TableCell>
                                        <TableCell>{cat.sort_order}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('release-note-categories.edit', cat.id)}>
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
                                                            <AlertDialogTitle>¿Eliminar esta categoría?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                No se puede eliminar si tiene release notes asociados.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(cat.id)} className="bg-red-600 hover:bg-red-700">
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-[280px]">
                                            <Empty className="h-full">
                                                <EmptyHeader>
                                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                        <Plus className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    <EmptyTitle>No hay categorías</EmptyTitle>
                                                    <EmptyDescription>
                                                        Crea al menos una categoría para poder crear release notes.
                                                    </EmptyDescription>
                                                </EmptyContent>
                                                <div className="mt-6">
                                                    <Button asChild>
                                                        <Link href={route('release-note-categories.create')}>Crear primera categoría</Link>
                                                    </Button>
                                                </div>
                                            </Empty>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="mt-4">
                    <Button variant="outline" asChild>
                        <Link href="/superlinkiu/release-notes">Volver a Release Notes</Link>
                    </Button>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
