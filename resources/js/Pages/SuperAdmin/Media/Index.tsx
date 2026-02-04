import { Head, router, useForm, usePage } from '@inertiajs/react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useState, useRef } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
import { CreateFolderModal } from './Modals/CreateFolderModal';
import { UploadModal } from './Modals/UploadModal';
import { DeleteConfirmationModal } from '@/Components/Shared/DeleteConfirmationModal';
import SharedPagination from '@/Components/Shared/Pagination';
import {
    Upload,
    Search,
    Filter,
    Image as ImageIcon,
    FileText,
    Video,
    Music,
    Archive,
    File,
    Trash2,
    Copy,
    Download,
    X,
    Check,
    FolderOpen,
    Eye,
    Calendar,
    HardDrive,
    FolderPlus
} from 'lucide-react';
import { toast } from 'sonner';

interface MediaFile {
    id: number;
    name: string;
    path: string;
    disk: string;
    mime_type: string;
    size: number;
    extension: string;
    type: string;
    folder: string;
    description?: string;
    metadata?: any;
    uploaded_by?: number;
    url?: string;
    full_url: string;
    size_human: string;
    type_icon: string;
    uploader?: {
        id: number;
        name: string;
        email: string;
    };
    created_at: string;
}

interface Props {
    files: {
        data: MediaFile[];
        links: any[];
        meta: any;
    };
    stats: {
        total: number;
        total_size: number;
        by_type: Record<string, number>;
    };
    folders: string[];
    filters: {
        type?: string;
        folder?: string;
        search?: string;
    };
}

const typeIcons = {
    image: ImageIcon,
    video: Video,
    audio: Music,
    document: FileText,
    archive: Archive,
    other: File,
};

export default function Index({ files, stats, folders, filters }: Props) {
    const { auth } = usePage<any>().props;
    const permissions = auth.permissions || [];
    const hasPermission = (p: string) => permissions.includes('*') || permissions.includes(p);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [folderDialogOpen, setFolderDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number | number[] | string; type: 'single' | 'bulk' | 'folder' } | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        files: [] as File[],
        folder: 'uploads',
        description: '',
    });

    const folderForm = useForm({
        name: '',
    });

    const moveForm = useForm({
        folder: '',
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('files', Array.from(e.target.files));
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        data.files.forEach(file => {
            formData.append('files[]', file);
        });
        formData.append('folder', data.folder);
        if (data.description) {
            formData.append('description', data.description);
        }

        router.post(route('media.store'), formData, {
            onSuccess: () => {
                toast.success('Archivos subidos correctamente');
                setUploadDialogOpen(false);
                reset();
            },
            onError: () => {
                toast.error('Error al subir archivos');
            },
        });
    };

    const handleDeleteClick = (id: number) => {
        if (!hasPermission('sa.media.delete')) {
            setShowPermissionModal(true);
            return;
        }
        setItemToDelete({ id, type: 'single' });
        setDeleteModalOpen(true);
    };

    const handleBulkDeleteClick = () => {
        if (selectedFiles.length === 0) return;

        if (!hasPermission('sa.media.delete')) {
            setShowPermissionModal(true);
            return;
        }
        setItemToDelete({ id: selectedFiles, type: 'bulk' });
        setDeleteModalOpen(true);
    };

    const handleDeleteFolderClick = (folder: string) => {
        if (!hasPermission('sa.media.delete')) {
            setShowPermissionModal(true);
            return;
        }
        setItemToDelete({ id: folder, type: 'folder' });
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'single') {
            router.delete(route('media.destroy', itemToDelete.id as number), {
                onSuccess: () => {
                    toast.success('Archivo eliminado');
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                    if (previewOpen) setPreviewOpen(false);
                },
                onError: () => toast.error('Error al eliminar'),
            });
        } else if (itemToDelete.type === 'folder') {
            router.post(route('media.folder.delete'), {
                folder: itemToDelete.id as string,
            }, {
                onSuccess: () => {
                    toast.success('Carpeta eliminada');
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                },
                onError: (errors) => {
                    toast.error(errors?.error || 'Error al eliminar carpeta');
                },
            });
        } else {
            router.post(route('media.bulk-delete'), {
                ids: itemToDelete.id as number[],
            }, {
                onSuccess: () => {
                    toast.success('Archivos eliminados');
                    setSelectedFiles([]);
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                },
                onError: () => toast.error('Error al eliminar'),
            });
        }
    };

    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copiada al portapapeles');
    };

    const toggleFileSelection = (id: number) => {
        setSelectedFiles(prev =>
            prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
        );
    };

    const openPreview = (file: MediaFile) => {
        setPreviewFile(file);
        setPreviewOpen(true);
    };

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!hasPermission('sa.media.upload')) {
            setShowPermissionModal(true);
            return;
        }
        folderForm.post(route('media.create-folder'), {
            onSuccess: () => {
                toast.success('Carpeta creada correctamente');
                setFolderDialogOpen(false);
                folderForm.reset();
            },
            onError: () => {
                toast.error('Error al crear carpeta');
            },
        });
    };

    const handleMoveFile = (fileId: number, newFolder: string) => {
        if (!hasPermission('sa.media.upload')) {
            setShowPermissionModal(true);
            return;
        }
        router.post(route('media.move', fileId), {
            folder: newFolder,
        }, {
            onSuccess: () => {
                toast.success('Archivo movido correctamente');
                setPreviewOpen(false);
            },
            onError: () => {
                toast.error('Error al mover archivo');
            },
        });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <SuperAdminLayout header="Gestión de Archivos">
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={confirmDelete}
                title={
                    itemToDelete?.type === 'folder' ? "¿Eliminar carpeta?" :
                        itemToDelete?.type === 'single' ? "¿Eliminar archivo?" :
                            "¿Eliminar archivos seleccionados?"
                }
                description={
                    itemToDelete?.type === 'folder'
                        ? "Esta acción no se puede deshacer. La carpeta y TODO su contenido serán eliminados permanentemente."
                        : itemToDelete?.type === 'single'
                            ? "Esta acción no se puede deshacer. El archivo será eliminado permanentemente."
                            : `Se eliminarán ${selectedFiles.length} archivos permanentemente. Esta acción no se puede deshacer.`
                }
            />
            <Head title="Gestión de Archivos" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Archivos</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {stats.total} archivos · {formatBytes(stats.total_size)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() => {
                                if (!hasPermission('sa.media.upload')) {
                                    setShowPermissionModal(true);
                                    return;
                                }
                                setFolderDialogOpen(true);
                            }}
                        >
                            <FolderPlus className="w-4 h-4" />
                            Nueva Carpeta
                        </Button>
                        <CreateFolderModal
                            open={folderDialogOpen}
                            onOpenChange={setFolderDialogOpen}
                            form={folderForm}
                            onSubmit={handleCreateFolder}
                        />

                        <Button
                            className="gap-2"
                            onClick={() => {
                                if (!hasPermission('sa.media.upload')) {
                                    setShowPermissionModal(true);
                                    return;
                                }
                                setUploadDialogOpen(true);
                            }}
                        >
                            <Upload className="w-4 h-4" />
                            Subir Archivos
                        </Button>
                        <UploadModal
                            open={uploadDialogOpen}
                            onOpenChange={setUploadDialogOpen}
                            data={data}
                            setData={setData}
                            onSubmit={handleUpload}
                            fileInputRef={fileInputRef}
                            processing={processing}
                            folders={folders}
                            onFileSelect={handleFileSelect}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(stats.by_type).map(([type, count]) => {
                        const Icon = typeIcons[type as keyof typeof typeIcons] || File;
                        return (
                            <div key={type} className="bg-card rounded-xl border p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-lg">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold tabular-nums leading-none mb-1">{count}</p>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{type}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Folder Navigation & Breadcrumbs */}
                {filters.folder ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.get(route('media.index'), { ...filters, folder: undefined })}
                            className="gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <FolderOpen className="w-4 h-4" />
                            Carpetas
                        </Button>
                        <span className="text-gray-400">/</span>
                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-primary" />
                            {filters.folder}
                        </span>
                    </div>
                ) : (
                    /* Folder Grid (Root View) */
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-4">
                        {folders.map(folder => (
                            <div
                                key={folder}
                                onClick={() => router.get(route('media.index'), { ...filters, folder })}
                                className="group relative bg-card p-4 rounded-xl border border-border hover:border-primary transition-all cursor-pointer flex flex-col items-center gap-3"
                            >
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        size="icon-xs"
                                        variant="destructive"
                                        className="rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFolderClick(folder);
                                        }}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors">
                                    <FolderOpen className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <p className="text-sm font-medium text-foreground group-hover:text-primary truncate w-full text-center px-1">
                                    {folder}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters Bar */}
                <div className="bg-card rounded-xl border p-4">
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar archivos..."
                                    defaultValue={filters.search}
                                    onChange={e => {
                                        router.get(route('media.index'), {
                                            ...filters,
                                            search: e.target.value,
                                        }, { preserveState: true });
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select
                            value={filters.type || 'all'}
                            onValueChange={(value) => {
                                router.get(route('media.index'), {
                                    ...filters,
                                    type: value === 'all' ? undefined : value,
                                }, { preserveState: true });
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tipo de archivo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                <SelectItem value="image">Imágenes</SelectItem>
                                <SelectItem value="video">Videos</SelectItem>
                                <SelectItem value="document">Documentos</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="archive">ArchivosComprimidos</SelectItem>
                            </SelectContent>
                        </Select>

                        {selectedFiles.length > 0 && (
                            <Button variant="destructive" onClick={handleBulkDeleteClick} className="gap-2">
                                <Trash2 className="w-4 h-4" />
                                Eliminar ({selectedFiles.length})
                            </Button>
                        )}
                    </div>
                </div>

                {/* Files Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-4">
                    {files.data.map(file => {
                        const Icon = typeIcons[file.type as keyof typeof typeIcons] || File;
                        const isSelected = selectedFiles.includes(file.id);

                        return (
                            <div
                                key={file.id}
                                className={`relative group bg-card rounded-xl border overflow-hidden transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground/30'
                                    }`}
                            >
                                {/* Selection Checkbox */}
                                <button
                                    onClick={() => toggleFileSelection(file.id)}
                                    className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border transition-colors flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-card border-border hover:border-primary'
                                        }`}
                                >
                                    {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                                </button>

                                {/* Preview */}
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {file.type === 'image' ? (
                                        <img src={file.full_url} alt={file.name} loading="lazy" className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-2.5">
                                    <p className="text-xs font-semibold text-foreground truncate leading-tight" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{file.size_human}</p>
                                </div>

                                {/* Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => openPreview(file)}
                                        className="gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => copyUrl(file.full_url)}
                                        className="gap-1"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteClick(file.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                <SharedPagination links={files.links} className="mt-8" />
            </div>

            {/* Sheets and Modals remain at the end */}
            <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                    {previewFile && (
                        <>
                            <SheetHeader>
                                <SheetTitle className="text-lg font-bold truncate pr-8">
                                    {previewFile.name}
                                </SheetTitle>
                            </SheetHeader>

                            <div className="mt-6 space-y-6">
                                {/* Preview */}
                                <div className="rounded-xl border bg-muted focus-visible:border-primary overflow-hidden">
                                    {previewFile.type === 'image' ? (
                                        <img
                                            src={previewFile.full_url}
                                            alt={previewFile.name}
                                            className="w-full h-auto"
                                        />
                                    ) : (
                                        <div className="aspect-video flex items-center justify-center">
                                            {(() => {
                                                const Icon = typeIcons[previewFile.type as keyof typeof typeIcons] || File;
                                                return <Icon className="w-20 h-20 text-muted-foreground" />;
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Información del Archivo</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <File className="w-4 h-4 text-muted-foreground mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Tipo</p>
                                                    <p className="text-sm font-semibold capitalize">{previewFile.type}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <HardDrive className="w-4 h-4 text-muted-foreground mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Tamaño</p>
                                                    <p className="text-sm font-semibold">{previewFile.size_human}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <FolderOpen className="w-4 h-4 text-muted-foreground mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Carpeta</p>
                                                    <p className="text-sm font-semibold">{previewFile.folder}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Subido</p>
                                                    <p className="text-sm font-semibold">
                                                        {new Date(previewFile.created_at).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {previewFile.uploader && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-4 h-4 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Subido por</p>
                                                        <p className="text-sm font-semibold">{previewFile.uploader.name}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {previewFile.metadata && Object.keys(previewFile.metadata).length > 0 && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-4 h-4 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Dimensiones</p>
                                                        <p className="text-sm font-semibold">
                                                            {previewFile.metadata.width} × {previewFile.metadata.height} px
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* URL */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">URL Pública</h3>
                                        <div className="flex gap-2">
                                            <Input
                                                value={previewFile.full_url}
                                                readOnly
                                                className="text-xs"
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => copyUrl(previewFile.full_url)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Move to Folder */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Mover a Carpeta</h3>
                                        <div className="flex gap-2">
                                            <Select
                                                value={previewFile.folder}
                                                onValueChange={(value) => handleMoveFile(previewFile.id, value)}
                                            >
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue placeholder="Selecciona carpeta" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {folders.map(folder => (
                                                        <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Selecciona una carpeta para mover este archivo
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            className="flex-1 gap-2"
                                            onClick={() => window.open(previewFile.full_url, '_blank')}
                                        >
                                            <Download className="w-4 h-4" />
                                            Descargar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1 gap-2"
                                            onClick={() => {
                                                handleDeleteClick(previewFile.id);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </SuperAdminLayout>
    );
}
