import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Input } from "@/Components/ui/input";
import { Search, Upload, Image as ImageIcon, Trash2, Loader2, Folder, FolderPlus, ArrowLeft } from "lucide-react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/Components/ui/dialog";

export interface MediaFile {
    id: number;
    url: string;
    path: string;
    name?: string;
    alt_text?: string;
    mime_type: string;
    size: number;
    type?: string;
}

interface MediaManagerProps {
    onSelect?: (file: MediaFile) => void;
    multiple?: boolean;
    apiRoute?: string;
    className?: string; // To allow custom styling wrapper
}

import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

export function MediaManager({
    onSelect,
    multiple = false,
    apiRoute,
    className
}: MediaManagerProps) {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    // Folder State
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);

    // Upload State
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState(false);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const params: any = {};
            // Using route().current() is safe, but determining context via prefix is robust for our app structure
            const currentRoute = route().current();
            const isTenant = currentRoute?.startsWith('tenant.');

            if (!isTenant) params.global = true;

            if (currentFolder) params.folder = currentFolder;

            let url = apiRoute;

            // If apiRoute is not provided, determine it automatically
            if (!url) {
                if (isTenant && route().params.tenant) {
                    // Ensure we pass the tenant slug/id parameter
                    url = route('tenant.media.list', route().params.tenant);
                } else {
                    url = route('media.list');
                }
            }

            const response = await axios.get(url, { params });
            const allItems = response.data.data || response.data;
            setFiles(allItems);
        } catch (error) {
            console.error("Error fetching files:", error);
            toast.error("Error cargando archivos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [currentFolder]);

    const handleCreateFolder = async () => {
        const name = prompt("Nombre de la carpeta:");
        if (!name) return;

        setCreatingFolder(true);
        try {
            const isTenant = route().current()?.startsWith('tenant.');
            const routeName = isTenant ? 'tenant.media.folder.create' : 'media.folder.create';
            // @ts-ignore
            const params = isTenant ? { tenant: route().params.tenant } : {};

            const endpoint = route(routeName, params);

            await axios.post(endpoint, {
                name,
                parent_folder: currentFolder
            });
            toast.success("Carpeta creada");
            fetchFiles();
        } catch (error: any) {
            console.error("Folder creation error:", error);
            const msg = error.response?.data?.message || "Error creando carpeta";
            toast.error(msg);
        } finally {
            setCreatingFolder(false);
        }
    };

    const uploadFiles = async (fileList: FileList) => {
        const formData = new FormData();
        formData.append("file", fileList[0]);
        if (currentFolder) formData.append("folder", currentFolder);

        setUploading(true);
        try {
            const isTenant = route().current()?.startsWith('tenant.');
            const routeName = isTenant ? 'tenant.media.store' : 'media.store';
            // @ts-ignore
            const params = isTenant ? { tenant: route().params.tenant } : {};
            const endpoint = route(routeName, params);

            await axios.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    setUploadProgress(percentCompleted);
                },
            });
            toast.success("Archivo subido");
            fetchFiles();
        } catch (error) {
            console.error(error);
            toast.error("Error al subir archivo");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;
        uploadFiles(fileList);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este elemento?")) return;
        try {
            const isTenant = route().current()?.startsWith('tenant.');
            const routeName = isTenant ? 'tenant.media.destroy' : 'media.destroy';
            // @ts-ignore
            const params = isTenant ? { tenant: route().params.tenant, id } : { id };

            await axios.delete(route(routeName, params));
            toast.success("Eliminado");
            setFiles(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            toast.error("Error al eliminar");
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const fileList = e.dataTransfer.files;
        if (fileList && fileList.length > 0) {
            uploadFiles(fileList);
        }
    };

    const filteredFiles = files.filter(f =>
        f.name?.toLowerCase().includes(search.toLowerCase()) ||
        f.alt_text?.toLowerCase().includes(search.toLowerCase())
    );

    const { auth, currentTenant } = usePage<any>().props;
    const isTenant = !!currentTenant;

    // For Tenant context, use currentUserRole. For SuperAdmin context, use auth.permissions.
    const userPermissions = isTenant
        ? (auth.currentUserRole?.permissions || [])
        : (auth.permissions || []);

    const isOwner = isTenant ? auth.currentUserRole?.is_owner : auth.user?.is_super_admin;

    const canUpload = isOwner || userPermissions.includes('*') || (isTenant ? userPermissions.includes('media.upload') : userPermissions.includes('sa.media.upload'));
    const canDelete = isOwner || userPermissions.includes('*') || (isTenant ? userPermissions.includes('media.delete') : userPermissions.includes('sa.media.delete'));

    return (
        <div
            className={cn("flex flex-col h-full bg-white relative rounded-xl border border-slate-200 overflow-hidden", className)}
            onDragOver={(e) => {
                e.preventDefault();
                if (canUpload) setIsDragging(true);
            }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => {
                if (canUpload) handleDrop(e);
                else e.preventDefault();
            }}
        >
            {isDragging && canUpload && (
                <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
                        <Upload className="w-12 h-12 text-primary mb-2" />
                        <h3 className="text-lg font-bold text-primary">Soltar para subir aquí</h3>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="p-4 flex flex-wrap gap-4 items-center border-b bg-white">
                <PermissionDeniedModal
                    open={showPermissionModal}
                    onOpenChange={setShowPermissionModal}
                />

                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    {currentFolder && (
                        <Button variant="ghost" size="sm" onClick={() => setCurrentFolder(null)} className="gap-1">
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </Button>
                    )}

                    <Button variant="outline" size="sm" onClick={() => fetchFiles()} title="Recargar">
                        <Loader2 className={cn("h-4 w-4", loading && "animate-spin")} />
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            if (canUpload) handleCreateFolder();
                            else setShowPermissionModal(true);
                        }}
                        disabled={creatingFolder}
                        className="gap-2"
                    >
                        <FolderPlus className="w-4 h-4" />
                        Nueva Carpeta
                    </Button>

                    <Input
                        type="file"
                        className="hidden"
                        id="manager-file-upload"
                        onChange={handleFileUpload}
                        accept="image/*"
                        disabled={uploading}
                    />
                    <Button
                        disabled={uploading}
                        onClick={() => {
                            if (canUpload) document.getElementById('manager-file-upload')?.click();
                            else setShowPermissionModal(true);
                        }}
                        className="gap-2"
                        size="sm"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Subir
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <ScrollArea className="flex-1 p-4 bg-slate-50/30">
                {/* ... existing loading and empty state check ... */}
                {loading && files.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredFiles.map((file) => {
                            const isFolder = file.type === 'folder';
                            return (
                                <div key={file.id} className="flex flex-col gap-1 group">
                                    <div
                                        className={cn(
                                            "relative aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer transition-all shadow-sm flex flex-col items-center justify-center",
                                            isFolder
                                                ? "bg-amber-50/50 border-amber-100 hover:bg-amber-100/50" // No ring for folders
                                                : "hover:bg-slate-50" // Simple hover for files
                                        )}
                                        onClick={() => {
                                            if (isFolder) {
                                                setCurrentFolder(file.name || null);
                                            } else {
                                                if (onSelect) onSelect(file);
                                            }
                                        }}
                                    >
                                        {isFolder ? (
                                            <>
                                                <Folder className="w-16 h-16 text-amber-400 mb-2" fill="currentColor" fillOpacity={0.2} />
                                                <span className="font-medium text-slate-700 truncate w-full text-center px-2">{file.name}</span>
                                            </>
                                        ) : (
                                            <img
                                                src={file.url}
                                                alt={file.alt_text || "File"}
                                                className="w-full h-full object-cover"
                                            />
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                                            {!isFolder && (
                                                <span className="text-xs text-white truncate max-w-[70%] font-medium drop-shadow-sm px-1 pb-0.5">
                                                    {file.name}
                                                </span>
                                            )}
                                            <div className="flex gap-1 ml-auto">
                                                {!isFolder && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-white hover:bg-white/20 hover:text-white"
                                                        title="Ver detalles"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(file.url, '_blank');
                                                        }}
                                                    >
                                                        <ImageIcon className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className={cn("h-6 w-6", !canDelete && "opacity-70")}
                                                    title="Eliminar"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (canDelete) handleDelete(file.id);
                                                        else setShowPermissionModal(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {!isFolder && (
                                        <div className="px-1">
                                            <p className="text-xs text-slate-600 truncate font-medium" title={file.name}>{file.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{file.size ? (file.size / 1024).toFixed(1) + ' KB' : ''}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {!loading && filteredFiles.length === 0 && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <div className="bg-slate-100 p-4 rounded-full">
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                        </div>
                        <p>Carpeta vacía</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

// Wrapper for Dialog usage
interface MediaManagerModalProps extends MediaManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MediaManagerModal({
    open,
    onOpenChange,
    ...props
}: MediaManagerModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white">
                <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Mis Archivos
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Gestor de archivos multimedia para seleccionar y subir imágenes.
                    </DialogDescription>
                </div>
                <div className="flex-1 min-h-0">
                    <MediaManager
                        {...props}
                        className="border-0 rounded-none h-full"
                        onSelect={(file) => {
                            if (props.onSelect) props.onSelect(file);
                            // onOpenChange(false); // Optional: close on select? User implied close.
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
