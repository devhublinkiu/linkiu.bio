'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import React, { useEffect, useRef } from 'react';
import { Button } from '@/Components/ui/button';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo, ImagePlus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  /** Contenido HTML inicial (solo se usa al montar). */
  initialContent?: string;
  /** Se llama con el HTML cada vez que cambia el contenido. */
  onChange: (html: string) => void;
  /** Clase adicional para el contenedor. */
  className?: string;
  /** Placeholder cuando está vacío. */
  placeholder?: string;
  /** Deshabilitado. */
  disabled?: boolean;
  /** URL POST para subir imagen (ej. route('release-notes.upload-image')). Si se pasa, se muestra botón "Subir imagen". */
  uploadImageUrl?: string;
}

export function RichTextEditor({
  initialContent = '',
  onChange,
  className,
  placeholder = 'Escribe aquí…',
  disabled = false,
  uploadImageUrl,
}: RichTextEditorProps) {
  type EditorInstance = ReturnType<typeof useEditor>;
  const editorRef = useRef<EditorInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: initialContent || '',
    editable: !disabled,
    immediatelyRender: false,
    onCreate: ({ editor: e }) => {
      (editorRef as React.MutableRefObject<EditorInstance | null>).current = e;
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[200px] px-3 py-2 focus:outline-none',
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const file = Array.from(items).find((item) => item.type.startsWith('image/'));
        if (file?.getAsFile()) {
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            editorRef.current?.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file.getAsFile()!);
          event.preventDefault();
          return true;
        }
        return false;
      },
      handleDrop: (view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (file?.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            editorRef.current?.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file);
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });
  useEffect(() => {
    (editorRef as React.MutableRefObject<EditorInstance | null>).current = editor ?? null;
  }, [editor]);

  // Sincronizar editable cuando cambia disabled
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className={cn('rounded-md border bg-muted/30 min-h-[220px] flex items-center justify-center text-muted-foreground', className)}>
        Cargando editor…
      </div>
    );
  }

  return (
    <div className={cn('rounded-md border bg-background overflow-hidden', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrita"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Cursiva"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Cita"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('URL del enlace:', editor.getAttributes('link').href || '');
            if (url !== null) {
              if (url === '') {
                editor.chain().focus().unsetLink().run();
              } else {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }
          }}
          active={editor.isActive('link')}
          title="Enlace"
        >
          <span className="text-xs font-medium">Link</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('URL de la imagen:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Insertar imagen por URL"
        >
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        {uploadImageUrl && (
          <>
            <ToolbarButton
              onClick={() => fileInputRef.current?.click()}
              title="Subir imagen"
            >
              <Upload className="h-4 w-4" />
            </ToolbarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !uploadImageUrl) return;
                e.target.value = '';
                const formData = new FormData();
                formData.append('image', file);
                try {
                  const res = await fetch(uploadImageUrl, {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '', 'Accept': 'application/json' },
                    credentials: 'same-origin',
                  });
                  const data = await res.json();
                  if (data?.url) {
                    editorRef.current?.chain().focus().setImage({ src: data.url }).run();
                  }
                } catch (_) {}
              }}
            />
          </>
        )}
        <span className="w-px h-6 bg-border mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Deshacer">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rehacer">
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
      <style>{`
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
      `}</style>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('h-8 w-8', active && 'bg-muted')}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </Button>
  );
}
