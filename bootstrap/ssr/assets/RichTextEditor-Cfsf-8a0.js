import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useRef, useEffect } from "react";
import { B as Button } from "./button-BdX_X5dq.js";
import { Bold, Italic, List, ListOrdered, Quote, ImagePlus, Upload, Undo, Redo } from "lucide-react";
import { c as cn } from "./utils-B0hQsrDj.js";
function RichTextEditor({
  initialContent = "",
  onChange,
  className,
  placeholder = "Escribe aquí…",
  disabled = false,
  uploadImageUrl
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false, allowBase64: true })
    ],
    content: initialContent || "",
    editable: !disabled,
    immediatelyRender: false,
    onCreate: ({ editor: e }) => {
      editorRef.current = e;
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-3 py-2 focus:outline-none"
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const file = Array.from(items).find((item) => item.type.startsWith("image/"));
        if (file?.getAsFile()) {
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result;
            editorRef.current?.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file.getAsFile());
          event.preventDefault();
          return true;
        }
        return false;
      },
      handleDrop: (view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (file?.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result;
            editorRef.current?.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file);
          event.preventDefault();
          return true;
        }
        return false;
      }
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    }
  });
  useEffect(() => {
    editorRef.current = editor ?? null;
  }, [editor]);
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);
  if (!editor) {
    return /* @__PURE__ */ jsx("div", { className: cn("rounded-md border bg-muted/30 min-h-[220px] flex items-center justify-center text-muted-foreground", className), children: "Cargando editor…" });
  }
  return /* @__PURE__ */ jsxs("div", { className: cn("rounded-md border bg-background overflow-hidden", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1", children: [
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => editor.chain().focus().toggleBold().run(),
          active: editor.isActive("bold"),
          title: "Negrita",
          children: /* @__PURE__ */ jsx(Bold, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => editor.chain().focus().toggleItalic().run(),
          active: editor.isActive("italic"),
          title: "Cursiva",
          children: /* @__PURE__ */ jsx(Italic, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          active: editor.isActive("bulletList"),
          title: "Lista con viñetas",
          children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          active: editor.isActive("orderedList"),
          title: "Lista numerada",
          children: /* @__PURE__ */ jsx(ListOrdered, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          active: editor.isActive("blockquote"),
          title: "Cita",
          children: /* @__PURE__ */ jsx(Quote, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => {
            const url = window.prompt("URL del enlace:", editor.getAttributes("link").href || "");
            if (url !== null) {
              if (url === "") {
                editor.chain().focus().unsetLink().run();
              } else {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }
          },
          active: editor.isActive("link"),
          title: "Enlace",
          children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Link" })
        }
      ),
      /* @__PURE__ */ jsx(
        ToolbarButton,
        {
          onClick: () => {
            const url = window.prompt("URL de la imagen:");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          },
          title: "Insertar imagen por URL",
          children: /* @__PURE__ */ jsx(ImagePlus, { className: "h-4 w-4" })
        }
      ),
      uploadImageUrl && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          ToolbarButton,
          {
            onClick: () => fileInputRef.current?.click(),
            title: "Subir imagen",
            children: /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/jpeg,image/png,image/gif,image/webp",
            className: "hidden",
            onChange: async (e) => {
              const file = e.target.files?.[0];
              if (!file || !uploadImageUrl) return;
              e.target.value = "";
              const formData = new FormData();
              formData.append("image", file);
              try {
                const res = await fetch(uploadImageUrl, {
                  method: "POST",
                  body: formData,
                  headers: { "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "", "Accept": "application/json" },
                  credentials: "same-origin"
                });
                const data = await res.json();
                if (data?.url) {
                  editorRef.current?.chain().focus().setImage({ src: data.url }).run();
                }
              } catch (_) {
              }
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsx("span", { className: "w-px h-6 bg-border mx-1" }),
      /* @__PURE__ */ jsx(ToolbarButton, { onClick: () => editor.chain().focus().undo().run(), disabled: !editor.can().undo(), title: "Deshacer", children: /* @__PURE__ */ jsx(Undo, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx(ToolbarButton, { onClick: () => editor.chain().focus().redo().run(), disabled: !editor.can().redo(), title: "Rehacer", children: /* @__PURE__ */ jsx(Redo, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx(EditorContent, { editor }),
    /* @__PURE__ */ jsx("style", { children: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          height: 0;
        }
        .tiptap {
          min-height: 200px;
        }
      ` })
  ] });
}
function ToolbarButton({
  children,
  onClick,
  active,
  disabled,
  title
}) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon",
      className: cn("h-8 w-8", active && "bg-muted"),
      onClick,
      disabled,
      title,
      children
    }
  );
}
export {
  RichTextEditor as R
};
