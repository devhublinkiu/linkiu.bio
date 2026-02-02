import { Head, router, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useState, useRef } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/Components/ui/sheet';
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
    const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [folderDialogOpen, setFolderDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este archivo?')) {
            router.delete(route('media.destroy', id), {
                onSuccess: () => toast.success('Archivo eliminado'),
                onError: () => toast.error('Error al eliminar'),
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedFiles.length === 0) return;

        if (confirm(`¿Eliminar ${selectedFiles.length} archivo(s)?`)) {
            router.post(route('media.bulk-delete'), {
                ids: selectedFiles,
            }, {
                onSuccess: () => {
                    toast.success('Archivos eliminados');
                    setSelectedFiles([]);
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
            <Head title="Gestión de Archivos" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Archivos</h1>
                        <p className="text-gray-600 mt-1">
                            {stats.total} archivos · {formatBytes(stats.total_size)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <FolderPlus className="w-4 h-4" />
                                    Nueva Carpeta
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Crear Nueva Carpeta</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateFolder} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Nombre de la carpeta</label>
                                        <Input
                                            value={folderForm.data.name}
                                            onChange={e => folderForm.setData('name', e.target.value)}
                                            placeholder="mi-carpeta"
                                            pattern="[a-zA-Z0-9_-]+"
                                            title="Solo letras, números, guiones y guiones bajos"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Solo letras, números, guiones (-) y guiones bajos (_)
                                        </p>
                                    </div>

                                    <Button type="submit" disabled={folderForm.processing || !folderForm.data.name} className="w-full">
                                        {folderForm.processing ? 'Creando...' : 'Crear Carpeta'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Upload className="w-4 h-4" />
                                    Subir Archivos
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Subir Archivos</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Archivos</label>
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            onChange={handleFileSelect}
                                            className="cursor-pointer"
                                        />
                                        {data.files.length > 0 && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                {data.files.length} archivo(s) seleccionado(s)
                                            </p>
                                        )}
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium mb-2">Carpeta</label>
                                        <select
                                            value={data.folder}
                                            onChange={e => setData('folder', e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        >
                                            <option value="uploads">uploads</option>
                                            {folders.filter(f => f !== 'uploads').map(folder => (
                                                <option key={folder} value={folder}>{folder}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Usa "Nueva Carpeta" para crear una carpeta nueva
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Descripción (opcional)</label>
                                        <Input
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            placeholder="Descripción del archivo"
                                        />
                                    </div>

                                    <Button type="submit" disabled={processing || data.files.length === 0} className="w-full">
                                        {processing ? 'Subiendo...' : 'Subir'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(stats.by_type).map(([type, count]) => {
                        const Icon = typeIcons[type as keyof typeof typeIcons] || File;
                        return (
                            <div key={type} className="bg-white rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Icon className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{count}</p>
                                        <p className="text-sm text-gray-600 capitalize">{type}</p>
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
                            <FolderOpen className="w-4 h-4 text-indigo-600" />
                            {filters.folder}
                        </span>
                    </div>
                ) : (
                    /* Folder Grid (Root View) */
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {folders.map(folder => (
                            <div
                                key={folder}
                                onClick={() => router.get(route('media.index'), { ...filters, folder })}
                                className="group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center gap-3"
                            >
                                <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                                    <FolderOpen className="w-8 h-8 text-indigo-600" />
                                </div>
                                <p className="font-medium text-gray-700 group-hover:text-indigo-700 truncate w-full text-center">
                                    {folder}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters Bar */}
                <div className="bg-white rounded-lg border p-4">
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

                        <select
                            value={filters.type || ''}
                            onChange={e => {
                                router.get(route('media.index'), {
                                    ...filters,
                                    type: e.target.value || undefined,
                                }, { preserveState: true });
                            }}
                            className="px-4 py-2 border rounded-lg min-w-[180px]"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="image">Imágenes</option>
                            <option value="video">Videos</option>
                            <option value="document">Documentos</option>
                            <option value="audio">Audio</option>
                            <option value="archive">Archivos</option>
                        </select>

                        {selectedFiles.length > 0 && (
                            <Button variant="destructive" onClick={handleBulkDelete} className="gap-2">
                                <Trash2 className="w-4 h-4" />
                                Eliminar ({selectedFiles.length})
                            </Button>
                        )}
                    </div>
                </div>

                {/* Files Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {files.data.map(file => {
                        const Icon = typeIcons[file.type as keyof typeof typeIcons] || File;
                        const isSelected = selectedFiles.includes(file.id);

                        return (
                            <div
                                key={file.id}
                                className={`relative group bg-white rounded-lg border-2 overflow-hidden transition-all ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {/* Selection Checkbox */}
                                <button
                                    onClick={() => toggleFileSelection(file.id)}
                                    className="absolute top-2 left-2 z-10 w-6 h-6 rounded bg-white border-2 border-gray-300 flex items-center justify-center hover:border-indigo-600"
                                >
                                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                                </button>

                                {/* Preview */}
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {file.type === 'image' ? (
                                        <img src={file.full_url} alt={file.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{file.size_human}</p>
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
                                        onClick={() => handleDelete(file.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {files.links && files.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {files.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.get(link.url)}
                                disabled={!link.url}
                                className={`px-4 py-2 rounded-lg ${link.active
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border hover:bg-gray-50 disabled:opacity-50'
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
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
                                <div className="rounded-lg border bg-gray-50 overflow-hidden">
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
                                                return <Icon className="w-20 h-20 text-gray-400" />;
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
                                                <File className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Tipo</p>
                                                    <p className="text-sm font-medium capitalize">{previewFile.type}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <HardDrive className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Tamaño</p>
                                                    <p className="text-sm font-medium">{previewFile.size_human}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <FolderOpen className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Carpeta</p>
                                                    <p className="text-sm font-medium">{previewFile.folder}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Subido</p>
                                                    <p className="text-sm font-medium">
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
                                                        <p className="text-xs text-gray-500">Subido por</p>
                                                        <p className="text-sm font-medium">{previewFile.uploader.name}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {previewFile.metadata && Object.keys(previewFile.metadata).length > 0 && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-4 h-4 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-500">Dimensiones</p>
                                                        <p className="text-sm font-medium">
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
                                            <select
                                                value={previewFile.folder}
                                                onChange={e => handleMoveFile(previewFile.id, e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                            >
                                                {folders.map(folder => (
                                                    <option key={folder} value={folder}>{folder}</option>
                                                ))}
                                            </select>
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
                                                handleDelete(previewFile.id);
                                                setPreviewOpen(false);
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
