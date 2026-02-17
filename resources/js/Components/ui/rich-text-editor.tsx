'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    minHeight?: string;
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Escribe aquí...',
    className,
    disabled,
    minHeight = '200px',
}: RichTextEditorProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInternal = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (el.innerHTML !== value && !isInternal.current) {
            el.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        isInternal.current = true;
        onChange(el.innerHTML);
        isInternal.current = false;
    }, [onChange]);

    const exec = useCallback((cmd: string, value?: string) => {
        document.execCommand(cmd, false, value);
        ref.current?.focus();
        handleInput();
    }, [handleInput]);

    return (
        <div className={cn('rounded-lg border border-input bg-background', className)}>
            <div className="flex flex-wrap gap-1 border-b border-input p-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => exec('bold')}
                    disabled={disabled}
                    title="Negrita"
                >
                    <Bold className="size-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => exec('italic')}
                    disabled={disabled}
                    title="Cursiva"
                >
                    <Italic className="size-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => exec('insertUnorderedList')}
                    disabled={disabled}
                    title="Lista con viñetas"
                >
                    <List className="size-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => exec('insertOrderedList')}
                    disabled={disabled}
                    title="Lista numerada"
                >
                    <ListOrdered className="size-4" />
                </Button>
            </div>
            <div
                ref={ref}
                contentEditable={!disabled}
                data-placeholder={placeholder}
                className={cn(
                    'min-w-0 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
                    'empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground',
                    disabled && 'cursor-not-allowed opacity-60'
                )}
                style={{ minHeight }}
                onInput={handleInput}
                suppressContentEditableWarning
            />
        </div>
    );
}
