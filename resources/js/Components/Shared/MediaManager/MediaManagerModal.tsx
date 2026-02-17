import { useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Search, Upload, Image as ImageIcon, Trash2, Loader2, Folder, FolderPlus, ArrowLeft, Download } from "lucide-react";
import { usePage, router } from "@inertiajs/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/Components/ui/empty";

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
    const [fileToDelete, setFileToDelete] = useState<number | null>(null);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [paginationLinks, setPaginationLinks] = useState<{ url: string | null; label: string; active: boolean }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [creatingFolder, setCreatingFolder] = useState(false);

    const { auth, currentTenant, currentUserRole } = usePage().props;
    const isTenant = !!currentTenant;
    const routeParams = route().params as Record<string, string | undefined>;

    const getListUrl = useCallback(() => {
        if (apiRoute) return apiRoute;
        if (isTenant && routeParams.tenant) return route("tenant.media.list", routeParams.tenant);
        return route("media.list");
    }, [apiRoute, isTenant, routeParams.tenant]);

    const fetchFiles = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params: Record<string, string | number | boolean | undefined> = {};
            if (!isTenant) params.global = true;
            if (currentFolder) params.folder = currentFolder;
            if (page > 1) params.page = page;

            const response = await axios.get(getListUrl(), { params });
            const data = response.data?.data ?? response.data;
            const items = Array.isArray(data) ? data : [];
            setFiles(items);
            if (response.data?.links) setPaginationLinks(response.data.links);
            else setPaginationLinks([]);
            setCurrentPage(response.data?.meta?.current_page ?? 1);
            setLastPage(response.data?.meta?.last_page ?? 1);
        } catch (err) {
            console.error("Error fetching files:", err);
            toast.error("Error cargando archivos");
        } finally {
            setLoading(false);
        }
    }, [currentFolder, getListUrl, isTenant]);

    useEffect(() => {
        fetchFiles(1);
    }, [currentFolder, fetchFiles]);

    const handleCreateFolder = async (name: string) => {
        if (!name.trim()) return;
        setCreatingFolder(true);
        try {
            const routeName = isTenant ? "tenant.media.folder.create" : "media.folder.create";
            const params = isTenant ? { tenant: routeParams.tenant } : {};
            const endpoint = route(routeName, params as Record<string, string>);

            await axios.post(endpoint, { name: name.trim(), parent_folder: currentFolder });
            toast.success("Carpeta creada");
            setShowNewFolderModal(false);
            setNewFolderName("");
            fetchFiles(1);
        } catch (err) {
            const msg = (err as AxiosError<{ message?: string }>)?.response?.data?.message ?? "Error creando carpeta";
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
            const routeName = isTenant ? "tenant.media.store" : "media.store";
            const params = isTenant ? { tenant: routeParams.tenant } : {};
            const endpoint = route(routeName, params as Record<string, string>);

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
            fetchFiles(currentPage);
        } catch (err) {
            console.error(err);
            toast.error("Error al subir archivo");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (!fileList || fileList.length === 0) return;
        uploadFiles(fileList);
    };

    const handleDelete = async (id: number) => {
        try {
            const routeName = isTenant ? "tenant.media.destroy" : "media.destroy";
            const params = isTenant ? { tenant: routeParams.tenant, id } : { id };

            await axios.delete(route(routeName, params as Record<string, string | number>));
            toast.success("Eliminado");
            setFileToDelete(null);
            setFiles((prev) => prev.filter((f) => f.id !== id));
        } catch (err) {
            toast.error("Error al eliminar");
            setFileToDelete(null);
        }
    };

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

    // For Tenant context, use currentUserRole. For SuperAdmin context, use auth.permissions.
    const userPermissions = isTenant
        ? (currentUserRole?.permissions || [])
        : (auth.permissions || []);

    const isOwner = isTenant ? currentUserRole?.is_owner : auth.user?.is_super_admin;

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
                            if (canUpload) setShowNewFolderModal(true);
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
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
                                                if (onSelect) {
                                                    onSelect(file);
                                                } else if (isTenant && routeParams.tenant) {
                                                    router.visit(route('tenant.media.show', { tenant: routeParams.tenant, id: file.id }));
                                                }
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
                                                        title="Descargar"
                                                        asChild
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <a
                                                            href={isTenant && routeParams.tenant
                                                                ? route('tenant.media.download', { tenant: routeParams.tenant, id: file.id })
                                                                : file.url
                                                            }
                                                            {...(isTenant && routeParams.tenant ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                                                        >
                                                            <Download className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className={cn("h-6 w-6", !canDelete && "opacity-70")}
                                                    title="Eliminar"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (canDelete) setFileToDelete(file.id);
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
                    <Empty className="col-span-full border-0">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <ImageIcon className="size-8 text-slate-400" />
                            </EmptyMedia>
                            <EmptyTitle>Sin archivos</EmptyTitle>
                            <EmptyDescription>
                                {currentFolder ? "Esta carpeta está vacía." : "Sube tu primer archivo o crea una carpeta para organizar."}
                            </EmptyDescription>
                        </EmptyHeader>
                        <div className="flex flex-wrap gap-2 justify-center mt-2">
                            {canUpload && (
                                <>
                                    <Button size="sm" onClick={() => document.getElementById("manager-file-upload")?.click()} className="gap-1">
                                        <Upload className="w-4 h-4" />
                                        Subir archivo
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setShowNewFolderModal(true)} className="gap-1">
                                        <FolderPlus className="w-4 h-4" />
                                        Nueva carpeta
                                    </Button>
                                </>
                            )}
                        </div>
                    </Empty>
                )}
                {lastPage > 1 && (
                    <div className="col-span-full mt-4 flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => fetchFiles(currentPage - 1)}>
                            Anterior
                        </Button>
                        <span className="text-sm text-slate-600">Página {currentPage} de {lastPage}</span>
                        <Button variant="outline" size="sm" disabled={currentPage >= lastPage} onClick={() => fetchFiles(currentPage + 1)}>
                            Siguiente
                        </Button>
                    </div>
                )}
            </ScrollArea>

            <AlertDialog open={fileToDelete !== null} onOpenChange={(open) => !open && setFileToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar este elemento?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará el archivo o carpeta de forma permanente. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => fileToDelete != null && handleDelete(fileToDelete)}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Nueva carpeta</DialogTitle>
                        <DialogDescription>Escribe el nombre de la carpeta.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-folder-name">Nombre</Label>
                            <Input
                                id="new-folder-name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                placeholder="Ej: Marketing"
                                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder(newFolderName)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setShowNewFolderModal(false); setNewFolderName(""); }}>Cancelar</Button>
                        <Button disabled={!newFolderName.trim() || creatingFolder} onClick={() => handleCreateFolder(newFolderName)} className="gap-2">
                            {creatingFolder ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Crear
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
