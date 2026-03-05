import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
} from '@/Components/ui/empty';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Plus, Edit, Trash2, Quote } from 'lucide-react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SharedPagination from '@/Components/Shared/Pagination';

export interface ChurchTestimonialItem {
    id: number;
    title: string;
    author: string | null;
    category: string | null;
    short_quote: string | null;
    is_featured: boolean;
    is_published: boolean;
    image_url: string | null;
    video_url: string | null;
    order: number;
    created_at: string;
}

type PaginationLink = { url: string | null; label: string; active: boolean };

interface Props {
    testimonials: {
        data: ChurchTestimonialItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function TestimonialsIndex({ testimonials }: Props) {
    const { currentTenant, currentUserRole } = usePage<PageProps>().props;
    const [toDelete, setToDelete] = useState<ChurchTestimonialItem | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const hasPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner === true
            || currentUserRole.permissions?.includes('*') === true
            || currentUserRole.permissions?.includes(permission) === true;
    };

    const withPermission = (permission: string, fn: () => void) => {
        if (hasPermission(permission)) fn();
        else setShowPermissionModal(true);
    };

    const handleDelete = () => {
        if (!toDelete) return;
        router.delete(route('tenant.admin.testimonials.destroy', [currentTenant?.slug, toDelete.id]), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Testimonio eliminado');
                setToDelete(null);
            },
            onError: () => toast.error('No se pudo eliminar'),
        });
    };

    return (
        <AdminLayout title="Testimonios">
            <Head title="Testimonios" />

            <PermissionDeniedModal open={showPermissionModal} onOpenChange={setShowPermissionModal} />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Testimonios</h1>
                    <p className="text-sm text-muted-foreground">
                        Historias, videos y citas de tu comunidad.
                    </p>
                </div>
                <Button
                    onClick={() => withPermission('testimonials.create', () => router.visit(route('tenant.admin.testimonials.create', currentTenant?.slug)))}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" /> Nuevo testimonio
                </Button>
            </div>

            {testimonials.data.length === 0 ? (
                <Card>
                    <CardContent className="py-16">
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Quote className="h-5 w-5" />
                                </EmptyMedia>
                                <EmptyTitle>No hay testimonios</EmptyTitle>
                                <EmptyDescription>
                                    Añade testimonios en video o texto para compartir lo que Dios está haciendo.
                                </EmptyDescription>
                            </EmptyHeader>
                            <Button
                                onClick={() => withPermission('testimonials.create', () => router.visit(route('tenant.admin.testimonials.create', currentTenant?.slug)))}
                                className="gap-2 mt-4"
                            >
                                <Plus className="w-4 h-4" /> Crear primer testimonio
                            </Button>
                        </Empty>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Imagen</TableHead>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Autor</TableHead>
                                        <TableHead>Categoría</TableHead>
                                        <TableHead className="text-center">Destacado</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {testimonials.data.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell>
                                                <div className="w-14 h-10 rounded overflow-hidden bg-muted border">
                                                    {t.image_url ? (
                                                        <img src={t.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : t.video_url ? (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                                            <span className="text-[10px] text-slate-500">Video</span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Quote className="w-5 h-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">{t.title}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{t.author || '—'}</TableCell>
                                            <TableCell>
                                                {t.category ? <Badge variant="secondary" className="text-xs">{t.category}</Badge> : '—'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {t.is_featured ? <Badge variant="default">Destacado</Badge> : '—'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {t.is_published ? (
                                                    <Badge variant="default" className="bg-green-600">Publicado</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Borrador</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button size="icon" variant="ghost" asChild>
                                                        <Link href={route('tenant.admin.testimonials.edit', [currentTenant?.slug, t.id])} aria-label="Editar">
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => withPermission('testimonials.delete', () => setToDelete(t))}
                                                        aria-label="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    <SharedPagination links={testimonials.links} className="mt-4" />
                </>
            )}

            <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar testimonio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará &quot;{toDelete?.title}&quot;. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
