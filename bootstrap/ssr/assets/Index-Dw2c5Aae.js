import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { usePage, useForm, Head, router } from "@inertiajs/react";
import { P as PermissionDeniedModal } from "./dropdown-menu-Dkgv2tnp.js";
import { S as SuperAdminLayout } from "./SuperAdminLayout-DVPOojgY.js";
import { useState, useRef } from "react";
import { B as Button } from "./button-BdX_X5dq.js";
import { I as Input } from "./input-B_4qRSOV.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BWhoZY6G.js";
import { S as Sheet, b as SheetContent, c as SheetHeader, d as SheetTitle } from "./sheet-BFMMArVC.js";
import { CreateFolderModal } from "./CreateFolderModal-BR6orvcK.js";
import { UploadModal } from "./UploadModal-ZCfYAnBR.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dk6SFJ_Z.js";
import { S as SharedPagination } from "./Pagination-DMFBFT5g.js";
import { FolderPlus, Upload, File, Archive, FileText, Music, Video, Image, FolderOpen, Trash2, Search, Check, Eye, Copy, HardDrive, Calendar, Download } from "lucide-react";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "./utils-B0hQsrDj.js";
import "clsx";
import "tailwind-merge";
import "vaul";
import "axios";
import "./dialog-QdU9y0pO.js";
import "@radix-ui/react-dialog";
import "./separator-DbxqJzR0.js";
import "@radix-ui/react-separator";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dropdown-menu";
import "./echo-DaX0krWj.js";
import "@ably/laravel-echo";
import "ably";
import "./ApplicationLogo-xMpxFOcX.js";
import "class-variance-authority";
import "@radix-ui/react-select";
import "@radix-ui/react-alert-dialog";
const typeIcons = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  archive: Archive,
  other: File
};
function Index({ files, stats, folders, filters }) {
  const { auth } = usePage().props;
  const permissions = auth.permissions || [];
  const hasPermission = (p) => permissions.includes("*") || permissions.includes(p);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const { data, setData, post, processing, reset } = useForm({
    files: [],
    folder: "uploads",
    description: ""
  });
  const folderForm = useForm({
    name: ""
  });
  useForm({
    folder: ""
  });
  const handleFileSelect = (e) => {
    if (e.target.files) {
      setData("files", Array.from(e.target.files));
    }
  };
  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    data.files.forEach((file) => {
      formData.append("files[]", file);
    });
    formData.append("folder", data.folder);
    if (data.description) {
      formData.append("description", data.description);
    }
    router.post(route("media.store"), formData, {
      onSuccess: () => {
        toast.success("Archivos subidos correctamente");
        setUploadDialogOpen(false);
        reset();
      },
      onError: () => {
        toast.error("Error al subir archivos");
      }
    });
  };
  const handleDeleteClick = (id) => {
    if (!hasPermission("sa.media.delete")) {
      setShowPermissionModal(true);
      return;
    }
    setItemToDelete({ id, type: "single" });
    setDeleteModalOpen(true);
  };
  const handleBulkDeleteClick = () => {
    if (selectedFiles.length === 0) return;
    if (!hasPermission("sa.media.delete")) {
      setShowPermissionModal(true);
      return;
    }
    setItemToDelete({ id: selectedFiles, type: "bulk" });
    setDeleteModalOpen(true);
  };
  const handleDeleteFolderClick = (folder) => {
    if (!hasPermission("sa.media.delete")) {
      setShowPermissionModal(true);
      return;
    }
    setItemToDelete({ id: folder, type: "folder" });
    setDeleteModalOpen(true);
  };
  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === "single") {
      router.delete(route("media.destroy", itemToDelete.id), {
        onSuccess: () => {
          toast.success("Archivo eliminado");
          setDeleteModalOpen(false);
          setItemToDelete(null);
          if (previewOpen) setPreviewOpen(false);
        },
        onError: () => toast.error("Error al eliminar")
      });
    } else if (itemToDelete.type === "folder") {
      router.post(route("media.folder.delete"), {
        folder: itemToDelete.id
      }, {
        onSuccess: () => {
          toast.success("Carpeta eliminada");
          setDeleteModalOpen(false);
          setItemToDelete(null);
        },
        onError: (errors) => {
          toast.error(errors?.error || "Error al eliminar carpeta");
        }
      });
    } else {
      router.post(route("media.bulk-delete"), {
        ids: itemToDelete.id
      }, {
        onSuccess: () => {
          toast.success("Archivos eliminados");
          setSelectedFiles([]);
          setDeleteModalOpen(false);
          setItemToDelete(null);
        },
        onError: () => toast.error("Error al eliminar")
      });
    }
  };
  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiada al portapapeles");
  };
  const toggleFileSelection = (id) => {
    setSelectedFiles(
      (prev) => prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };
  const openPreview = (file) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!hasPermission("sa.media.upload")) {
      setShowPermissionModal(true);
      return;
    }
    folderForm.post(route("media.create-folder"), {
      onSuccess: () => {
        toast.success("Carpeta creada correctamente");
        setFolderDialogOpen(false);
        folderForm.reset();
      },
      onError: () => {
        toast.error("Error al crear carpeta");
      }
    });
  };
  const handleMoveFile = (fileId, newFolder) => {
    if (!hasPermission("sa.media.upload")) {
      setShowPermissionModal(true);
      return;
    }
    router.post(route("media.move", fileId), {
      folder: newFolder
    }, {
      onSuccess: () => {
        toast.success("Archivo movido correctamente");
        setPreviewOpen(false);
      },
      onError: () => {
        toast.error("Error al mover archivo");
      }
    });
  };
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };
  return /* @__PURE__ */ jsxs(SuperAdminLayout, { header: "Gestión de Archivos", children: [
    /* @__PURE__ */ jsx(
      PermissionDeniedModal,
      {
        open: showPermissionModal,
        onOpenChange: setShowPermissionModal
      }
    ),
    /* @__PURE__ */ jsx(
      AlertDialog,
      {
        open: deleteModalOpen,
        onOpenChange: setDeleteModalOpen,
        children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx(AlertDialogTitle, { children: itemToDelete?.type === "folder" ? "¿Eliminar carpeta?" : itemToDelete?.type === "single" ? "¿Eliminar archivo?" : "¿Eliminar archivos seleccionados?" }),
            /* @__PURE__ */ jsx(AlertDialogDescription, { children: itemToDelete?.type === "folder" ? "Esta acción no se puede deshacer. La carpeta y TODO su contenido serán eliminados permanentemente." : itemToDelete?.type === "single" ? "Esta acción no se puede deshacer. El archivo será eliminado permanentemente." : `Se eliminarán ${selectedFiles.length} archivos permanentemente. Esta acción no se puede deshacer.` })
          ] }),
          /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancelar" }),
            /* @__PURE__ */ jsx(AlertDialogAction, { onClick: confirmDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Eliminar" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(Head, { title: "Gestión de Archivos" }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Gestión de Archivos" }),
          /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mt-1 text-sm", children: [
            stats.total,
            " archivos · ",
            formatBytes(stats.total_size)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2",
              onClick: () => {
                if (!hasPermission("sa.media.upload")) {
                  setShowPermissionModal(true);
                  return;
                }
                setFolderDialogOpen(true);
              },
              children: [
                /* @__PURE__ */ jsx(FolderPlus, { className: "w-4 h-4" }),
                "Nueva Carpeta"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            CreateFolderModal,
            {
              open: folderDialogOpen,
              onOpenChange: setFolderDialogOpen,
              form: folderForm,
              onSubmit: handleCreateFolder
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: "gap-2",
              onClick: () => {
                if (!hasPermission("sa.media.upload")) {
                  setShowPermissionModal(true);
                  return;
                }
                setUploadDialogOpen(true);
              },
              children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                "Subir Archivos"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            UploadModal,
            {
              open: uploadDialogOpen,
              onOpenChange: setUploadDialogOpen,
              data,
              setData,
              onSubmit: handleUpload,
              fileInputRef,
              processing,
              folders,
              onFileSelect: handleFileSelect
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: Object.entries(stats.by_type).map(([type, count]) => {
        const Icon = typeIcons[type] || File;
        return /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold tabular-nums leading-none mb-1", children: count }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wider", children: type })
          ] })
        ] }) }, type);
      }) }),
      filters.folder ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: () => router.get(route("media.index"), { ...filters, folder: void 0 }),
            className: "gap-2 text-gray-600 hover:text-gray-900",
            children: [
              /* @__PURE__ */ jsx(FolderOpen, { className: "w-4 h-4" }),
              "Carpetas"
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "/" }),
        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-gray-900 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(FolderOpen, { className: "w-4 h-4 text-primary" }),
          filters.folder
        ] })
      ] }) : (
        /* Folder Grid (Root View) */
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-4", children: folders.map((folder) => /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => router.get(route("media.index"), { ...filters, folder }),
            className: "group relative bg-card p-4 rounded-xl border border-border hover:border-primary transition-all cursor-pointer flex flex-col items-center gap-3",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon-xs",
                  variant: "destructive",
                  className: "rounded-full",
                  onClick: (e) => {
                    e.stopPropagation();
                    handleDeleteFolderClick(folder);
                  },
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "p-3 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ jsx(FolderOpen, { className: "w-8 h-8 text-muted-foreground group-hover:text-primary" }) }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground group-hover:text-primary truncate w-full text-center px-1", children: folder })
            ]
          },
          folder
        )) })
      ),
      /* @__PURE__ */ jsx("div", { className: "bg-card rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-[200px]", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: "Buscar archivos...",
              defaultValue: filters.search,
              onChange: (e) => {
                router.get(route("media.index"), {
                  ...filters,
                  search: e.target.value
                }, { preserveState: true });
              },
              className: "pl-10"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            value: filters.type || "all",
            onValueChange: (value) => {
              router.get(route("media.index"), {
                ...filters,
                type: value === "all" ? void 0 : value
              }, { preserveState: true });
            },
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[180px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Tipo de archivo" }) }),
              /* @__PURE__ */ jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "Todos los tipos" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "image", children: "Imágenes" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "video", children: "Videos" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "document", children: "Documentos" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "audio", children: "Audio" }),
                /* @__PURE__ */ jsx(SelectItem, { value: "archive", children: "ArchivosComprimidos" })
              ] })
            ]
          }
        ),
        selectedFiles.length > 0 && /* @__PURE__ */ jsxs(Button, { variant: "destructive", onClick: handleBulkDeleteClick, className: "gap-2", children: [
          /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
          "Eliminar (",
          selectedFiles.length,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-4", children: files.data.map((file) => {
        const Icon = typeIcons[file.type] || File;
        const isSelected = selectedFiles.includes(file.id);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `relative group bg-card rounded-xl border overflow-hidden transition-all ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/30"}`,
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleFileSelection(file.id),
                  className: `absolute top-2 left-2 z-10 w-5 h-5 rounded border transition-colors flex items-center justify-center ${isSelected ? "bg-primary border-primary" : "bg-card border-border hover:border-primary"}`,
                  children: isSelected && /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 text-primary-foreground" })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gray-100 flex items-center justify-center", children: file.type === "image" ? /* @__PURE__ */ jsx("img", { src: file.full_url, alt: file.name, loading: "lazy", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Icon, { className: "w-12 h-12 text-gray-400" }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-2.5", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-foreground truncate leading-tight", title: file.name, children: file.name }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium text-muted-foreground mt-0.5", children: file.size_human })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "secondary",
                    onClick: () => openPreview(file),
                    className: "gap-1",
                    children: /* @__PURE__ */ jsx(Eye, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "secondary",
                    onClick: () => copyUrl(file.full_url),
                    className: "gap-1",
                    children: /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "destructive",
                    onClick: () => handleDeleteClick(file.id),
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                  }
                )
              ] })
            ]
          },
          file.id
        );
      }) }),
      /* @__PURE__ */ jsx(SharedPagination, { links: files.links, className: "mt-8" })
    ] }),
    /* @__PURE__ */ jsx(Sheet, { open: previewOpen, onOpenChange: setPreviewOpen, children: /* @__PURE__ */ jsx(SheetContent, { className: "w-full sm:max-w-lg overflow-y-auto", children: previewFile && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { className: "text-lg font-bold truncate pr-8", children: previewFile.name }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-6", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-muted focus-visible:border-primary overflow-hidden", children: previewFile.type === "image" ? /* @__PURE__ */ jsx(
          "img",
          {
            src: previewFile.full_url,
            alt: previewFile.name,
            className: "w-full h-auto"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "aspect-video flex items-center justify-center", children: (() => {
          const Icon = typeIcons[previewFile.type] || File;
          return /* @__PURE__ */ jsx(Icon, { className: "w-20 h-20 text-muted-foreground" });
        })() }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-3", children: "Información del Archivo" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(File, { className: "w-4 h-4 text-muted-foreground mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70", children: "Tipo" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold capitalize", children: previewFile.type })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(HardDrive, { className: "w-4 h-4 text-muted-foreground mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70", children: "Tamaño" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: previewFile.size_human })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(FolderOpen, { className: "w-4 h-4 text-muted-foreground mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70", children: "Carpeta" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: previewFile.folder })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-muted-foreground mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70", children: "Subido" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: new Date(previewFile.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) })
                ] })
              ] }),
              previewFile.uploader && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-4 h-4 mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70", children: "Subido por" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: previewFile.uploader.name })
                ] })
              ] }),
              previewFile.metadata && Object.keys(previewFile.metadata).length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "w-4 h-4 mt-0.5" }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70", children: "Dimensiones" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold", children: [
                    previewFile.metadata.width,
                    " × ",
                    previewFile.metadata.height,
                    " px"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "URL Pública" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: previewFile.full_url,
                  readOnly: true,
                  className: "text-xs"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => copyUrl(previewFile.full_url),
                  children: /* @__PURE__ */ jsx(Copy, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Mover a Carpeta" }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(
              Select,
              {
                value: previewFile.folder,
                onValueChange: (value) => handleMoveFile(previewFile.id, value),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "flex-1", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Selecciona carpeta" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: folders.map((folder) => /* @__PURE__ */ jsx(SelectItem, { value: folder, children: folder }, folder)) })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Selecciona una carpeta para mover este archivo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-4 border-t", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "flex-1 gap-2",
                onClick: () => window.open(previewFile.full_url, "_blank"),
                children: [
                  /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
                  "Descargar"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "destructive",
                className: "flex-1 gap-2",
                onClick: () => {
                  handleDeleteClick(previewFile.id);
                },
                children: [
                  /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
                  "Eliminar"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  Index as default
};
