import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from "react";
import { B as Button } from "./button-BdX_X5dq.js";
import { S as ScrollArea } from "./scroll-area-iVmBTZv4.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { L as Label } from "./label-L_u-fyc1.js";
import { Upload, Search, ArrowLeft, Loader2, FolderPlus, Folder, Download, Trash2, Image } from "lucide-react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";
import { c as cn } from "./utils-B0hQsrDj.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-QdU9y0pO.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { E as Empty, a as EmptyHeader, e as EmptyMedia, c as EmptyTitle, d as EmptyDescription } from "./empty-CTOMHEXK.js";
import { P as PermissionDeniedModal } from "./dropdown-menu-B2I3vWlQ.js";
function MediaManager({
  onSelect,
  multiple = false,
  apiRoute,
  className
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const { auth, currentTenant, currentUserRole } = usePage().props;
  const isTenant = !!currentTenant;
  const routeParams = route().params;
  const getListUrl = useCallback(() => {
    if (apiRoute) return apiRoute;
    if (isTenant && routeParams.tenant) return route("tenant.media.list", routeParams.tenant);
    return route("media.list");
  }, [apiRoute, isTenant, routeParams.tenant]);
  const fetchFiles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {};
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
  const handleCreateFolder = async (name) => {
    if (!name.trim()) return;
    setCreatingFolder(true);
    try {
      const routeName = isTenant ? "tenant.media.folder.create" : "media.folder.create";
      const params = isTenant ? { tenant: routeParams.tenant } : {};
      const endpoint = route(routeName, params);
      await axios.post(endpoint, { name: name.trim(), parent_folder: currentFolder });
      toast.success("Carpeta creada");
      setShowNewFolderModal(false);
      setNewFolderName("");
      fetchFiles(1);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Error creando carpeta";
      toast.error(msg);
    } finally {
      setCreatingFolder(false);
    }
  };
  const uploadFiles = async (fileList) => {
    const formData = new FormData();
    formData.append("file", fileList[0]);
    if (currentFolder) formData.append("folder", currentFolder);
    setUploading(true);
    try {
      const routeName = isTenant ? "tenant.media.store" : "media.store";
      const params = isTenant ? { tenant: routeParams.tenant } : {};
      const endpoint = route(routeName, params);
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            progressEvent.loaded * 100 / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        }
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
  const handleFileUpload = async (event) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    uploadFiles(fileList);
  };
  const handleDelete = async (id) => {
    try {
      const routeName = isTenant ? "tenant.media.destroy" : "media.destroy";
      const params = isTenant ? { tenant: routeParams.tenant, id } : { id };
      await axios.delete(route(routeName, params));
      toast.success("Eliminado");
      setFileToDelete(null);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      toast.error("Error al eliminar");
      setFileToDelete(null);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const fileList = e.dataTransfer.files;
    if (fileList && fileList.length > 0) {
      uploadFiles(fileList);
    }
  };
  const filteredFiles = files.filter(
    (f) => f.name?.toLowerCase().includes(search.toLowerCase()) || f.alt_text?.toLowerCase().includes(search.toLowerCase())
  );
  const userPermissions = isTenant ? currentUserRole?.permissions || [] : auth.permissions || [];
  const isOwner = isTenant ? currentUserRole?.is_owner : auth.user?.is_super_admin;
  const canUpload = isOwner || userPermissions.includes("*") || (isTenant ? userPermissions.includes("media.upload") : userPermissions.includes("sa.media.upload"));
  const canDelete = isOwner || userPermissions.includes("*") || (isTenant ? userPermissions.includes("media.delete") : userPermissions.includes("sa.media.delete"));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("flex flex-col h-full bg-white relative rounded-xl border border-slate-200 overflow-hidden", className),
      onDragOver: (e) => {
        e.preventDefault();
        if (canUpload) setIsDragging(true);
      },
      onDragLeave: (e) => {
        e.preventDefault();
        setIsDragging(false);
      },
      onDrop: (e) => {
        if (canUpload) handleDrop(e);
        else e.preventDefault();
      },
      children: [
        isDragging && canUpload && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center backdrop-blur-[1px]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg flex flex-col items-center", children: [
          /* @__PURE__ */ jsx(Upload, { className: "w-12 h-12 text-primary mb-2" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-primary", children: "Soltar para subir aquí" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-wrap gap-4 items-center border-b bg-white", children: [
          /* @__PURE__ */ jsx(
            PermissionDeniedModal,
            {
              open: showPermissionModal,
              onOpenChange: setShowPermissionModal
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Buscar...",
                className: "pl-9 bg-white",
                value: search,
                onChange: (e) => setSearch(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
            currentFolder && /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setCurrentFolder(null), className: "gap-1", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Volver"
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: () => fetchFiles(), title: "Recargar", children: /* @__PURE__ */ jsx(Loader2, { className: cn("h-4 w-4", loading && "animate-spin") }) }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "secondary",
                size: "sm",
                onClick: () => {
                  if (canUpload) setShowNewFolderModal(true);
                  else setShowPermissionModal(true);
                },
                disabled: creatingFolder,
                className: "gap-2",
                children: [
                  /* @__PURE__ */ jsx(FolderPlus, { className: "w-4 h-4" }),
                  "Nueva Carpeta"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                type: "file",
                className: "hidden",
                id: "manager-file-upload",
                onChange: handleFileUpload,
                accept: "image/*",
                disabled: uploading
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                disabled: uploading,
                onClick: () => {
                  if (canUpload) document.getElementById("manager-file-upload")?.click();
                  else setShowPermissionModal(true);
                },
                className: "gap-2",
                size: "sm",
                children: [
                  uploading ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                  "Subir"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(ScrollArea, { className: "flex-1 p-4 bg-slate-50/30", children: [
          loading && files.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-40", children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4", children: filteredFiles.map((file) => {
            const isFolder = file.type === "folder";
            return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 group", children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: cn(
                    "relative aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer transition-all shadow-sm flex flex-col items-center justify-center",
                    isFolder ? "bg-amber-50/50 border-amber-100 hover:bg-amber-100/50" : "hover:bg-slate-50"
                    // Simple hover for files
                  ),
                  onClick: () => {
                    if (isFolder) {
                      setCurrentFolder(file.name || null);
                    } else {
                      if (onSelect) {
                        onSelect(file);
                      } else if (isTenant && routeParams.tenant) {
                        router.visit(route("tenant.media.show", { tenant: routeParams.tenant, id: file.id }));
                      }
                    }
                  },
                  children: [
                    isFolder ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Folder, { className: "w-16 h-16 text-amber-400 mb-2", fill: "currentColor", fillOpacity: 0.2 }),
                      /* @__PURE__ */ jsx("span", { className: "font-medium text-slate-700 truncate w-full text-center px-2", children: file.name })
                    ] }) : /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: file.url,
                        alt: file.alt_text || "File",
                        className: "w-full h-full object-cover"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end", children: [
                      !isFolder && /* @__PURE__ */ jsx("span", { className: "text-xs text-white truncate max-w-[70%] font-medium drop-shadow-sm px-1 pb-0.5", children: file.name }),
                      /* @__PURE__ */ jsxs("div", { className: "flex gap-1 ml-auto", children: [
                        !isFolder && /* @__PURE__ */ jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "icon",
                            className: "h-6 w-6 text-white hover:bg-white/20 hover:text-white",
                            title: "Descargar",
                            asChild: true,
                            onClick: (e) => e.stopPropagation(),
                            children: /* @__PURE__ */ jsx(
                              "a",
                              {
                                href: isTenant && routeParams.tenant ? route("tenant.media.download", { tenant: routeParams.tenant, id: file.id }) : file.url,
                                ...isTenant && routeParams.tenant ? {} : { target: "_blank", rel: "noopener noreferrer" },
                                children: /* @__PURE__ */ jsx(Download, { className: "h-3 w-3" })
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Button,
                          {
                            variant: "destructive",
                            size: "icon",
                            className: cn("h-6 w-6", !canDelete && "opacity-70"),
                            title: "Eliminar",
                            onClick: (e) => {
                              e.stopPropagation();
                              if (canDelete) setFileToDelete(file.id);
                              else setShowPermissionModal(true);
                            },
                            children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              ),
              !isFolder && /* @__PURE__ */ jsxs("div", { className: "px-1", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 truncate font-medium", title: file.name, children: file.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 truncate", children: file.size ? (file.size / 1024).toFixed(1) + " KB" : "" })
              ] })
            ] }, file.id);
          }) }),
          !loading && filteredFiles.length === 0 && /* @__PURE__ */ jsxs(Empty, { className: "col-span-full border-0", children: [
            /* @__PURE__ */ jsxs(EmptyHeader, { children: [
              /* @__PURE__ */ jsx(EmptyMedia, { variant: "icon", children: /* @__PURE__ */ jsx(Image, { className: "size-8 text-slate-400" }) }),
              /* @__PURE__ */ jsx(EmptyTitle, { children: "Sin archivos" }),
              /* @__PURE__ */ jsx(EmptyDescription, { children: currentFolder ? "Esta carpeta está vacía." : "Sube tu primer archivo o crea una carpeta para organizar." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 justify-center mt-2", children: canUpload && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: () => document.getElementById("manager-file-upload")?.click(), className: "gap-1", children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                "Subir archivo"
              ] }),
              /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => setShowNewFolderModal(true), className: "gap-1", children: [
                /* @__PURE__ */ jsx(FolderPlus, { className: "w-4 h-4" }),
                "Nueva carpeta"
              ] })
            ] }) })
          ] }),
          lastPage > 1 && /* @__PURE__ */ jsxs("div", { className: "col-span-full mt-4 flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: currentPage <= 1, onClick: () => fetchFiles(currentPage - 1), children: "Anterior" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-slate-600", children: [
              "Página ",
              currentPage,
              " de ",
              lastPage
            ] }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", disabled: currentPage >= lastPage, onClick: () => fetchFiles(currentPage + 1), children: "Siguiente" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(AlertDialog, { open: fileToDelete !== null, onOpenChange: (open) => !open && setFileToDelete(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx(AlertDialogTitle, { children: "¿Eliminar este elemento?" }),
            /* @__PURE__ */ jsx(AlertDialogDescription, { children: "Se eliminará el archivo o carpeta de forma permanente. Esta acción no se puede deshacer." })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
            /* @__PURE__ */ jsx(AlertDialogAction, { variant: "destructive", onClick: () => fileToDelete != null && handleDelete(fileToDelete), children: "Eliminar" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Dialog, { open: showNewFolderModal, onOpenChange: setShowNewFolderModal, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[400px]", children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: "Nueva carpeta" }),
            /* @__PURE__ */ jsx(DialogDescription, { children: "Escribe el nombre de la carpeta." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "new-folder-name", children: "Nombre" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "new-folder-name",
                value: newFolderName,
                onChange: (e) => setNewFolderName(e.target.value),
                placeholder: "Ej: Marketing",
                onKeyDown: (e) => e.key === "Enter" && handleCreateFolder(newFolderName)
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => {
              setShowNewFolderModal(false);
              setNewFolderName("");
            }, children: "Cancelar" }),
            /* @__PURE__ */ jsxs(Button, { disabled: !newFolderName.trim() || creatingFolder, onClick: () => handleCreateFolder(newFolderName), className: "gap-2", children: [
              creatingFolder ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : null,
              "Crear"
            ] })
          ] })
        ] }) })
      ]
    }
  );
}
function MediaManagerModal({
  open,
  onOpenChange,
  ...props
}) {
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-b flex items-center justify-between bg-slate-50/50", children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "text-xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Image, { className: "w-5 h-5 text-primary" }),
        "Mis Archivos"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { className: "sr-only", children: "Gestor de archivos multimedia para seleccionar y subir imágenes." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0", children: /* @__PURE__ */ jsx(
      MediaManager,
      {
        ...props,
        className: "border-0 rounded-none h-full",
        onSelect: (file) => {
          if (props.onSelect) props.onSelect(file);
        }
      }
    ) })
  ] }) });
}
export {
  MediaManagerModal as M,
  MediaManager as a
};
