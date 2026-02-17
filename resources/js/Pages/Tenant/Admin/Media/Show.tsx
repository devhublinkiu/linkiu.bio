import React from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ChevronLeft, Image as ImageIcon, FileText, HardDrive, Calendar, ExternalLink } from 'lucide-react';

interface MediaShowProps {
    media: {
        id: number;
        name: string;
        path: string | null;
        url: string | null;
        full_url?: string | null;
        disk: string;
        mime_type: string | null;
        size: number | null;
        size_human?: string;
        extension: string | null;
        type: string;
        folder: string | null;
        alt_text: string | null;
        description: string | null;
        metadata: Record<string, unknown> | null;
        uploaded_by: number | null;
        created_at: string;
    };
}

export default function Show({ media }: MediaShowProps) {
    const { currentTenant } = usePage<PageProps>().props;
    const isImage = media.type === 'image';
    const displayUrl = media.url ?? media.full_url ?? (media.path ? `/media/${media.path}` : null);
    const dimensions = media.metadata && typeof media.metadata === 'object'
        ? { width: (media.metadata as { width?: number }).width, height: (media.metadata as { height?: number }).height }
        : null;

    return (
        <AdminLayout title={media.name}>
            <Head title={media.name} />
            <div className="py-6 max-w-4xl mx-auto sm:px-6 lg:px-8">
                <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
                    <Link href={route('tenant.media.index', { tenant: currentTenant?.slug ?? '' })}>
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Volver a Mis Archivos
                    </Link>
                </Button>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardContent className="p-0 flex items-center justify-center bg-slate-50 min-h-[320px] rounded-b-lg">
                            {isImage && displayUrl ? (
                                <img
                                    src={displayUrl}
                                    alt={media.alt_text ?? media.name}
                                    className="max-w-full max-h-[400px] w-auto h-auto object-contain rounded-lg"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400 py-12">
                                    <ImageIcon className="w-16 h-16" />
                                    <span className="text-sm">Vista previa no disponible</span>
                                    {displayUrl && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={displayUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                Abrir archivo
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Información</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Nombre</p>
                                <p className="font-medium truncate" title={media.name}>{media.name}</p>
                            </div>
                            {media.alt_text && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Texto alternativo</p>
                                    <p className="text-sm">{media.alt_text}</p>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <HardDrive className="w-4 h-4 text-slate-400" />
                                    <span>{media.size_human ?? (media.size ? `${(media.size / 1024).toFixed(1)} KB` : '—')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="w-4 h-4 text-slate-400" />
                                    <span>{media.extension ?? media.type ?? '—'}</span>
                                </div>
                                {dimensions && (dimensions.width || dimensions.height) && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <ImageIcon className="w-4 h-4 text-slate-400" />
                                        <span>{dimensions.width ?? '?'} × {dimensions.height ?? '?'} px</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{new Date(media.created_at).toLocaleDateString('es')}</span>
                                </div>
                            </div>
                            {media.description && (
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Descripción</p>
                                    <p className="text-sm">{media.description}</p>
                                </div>
                            )}
                            {displayUrl && (
                                <Button variant="outline" size="sm" asChild>
                                    <a href={displayUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        Abrir en nueva pestaña
                                    </a>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
