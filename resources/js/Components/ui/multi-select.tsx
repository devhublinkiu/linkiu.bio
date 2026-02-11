"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

export type Option = {
    label: string;
    value: string;
};

interface MultiSelectProps {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select options...",
    className,
    disabled = false
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const handleRemove = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(selected.filter((item) => item !== value));
    };

    const selectedLabels = selected
        .map((value) => options.find((opt) => opt.value === value))
        .filter(Boolean) as Option[];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between h-auto min-h-10 px-3 py-2 hover:bg-background",
                        className
                    )}
                    disabled={disabled}
                >
                    <div className="flex flex-wrap gap-1 items-center w-full">
                        {selectedLabels.length > 0 ? (
                            selectedLabels.map((option) => (
                                <Badge
                                    key={option.value}
                                    variant="secondary"
                                    className="mr-1 mb-1 font-normal"
                                >
                                    {option.label}
                                    <span
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                        onClick={(e) => handleRemove(option.value, e)}
                                    >
                                        <X className="h-3 w-3" />
                                    </span>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground font-normal">
                                {placeholder}
                            </span>
                        )}
                        <span className="flex-1 min-w-[5px]"></span>
                        {/* Spacer to push chevron to end if needed, though justify-between on button usually handles it */}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="max-h-64 overflow-y-auto">
                    <div className="p-1">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No se encontraron resultados.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                        selected.includes(option.value) && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <div
                                        className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            selected.includes(option.value)
                                                ? "bg-primary text-primary-foreground"
                                                : "opacity-50 [&_svg]:invisible"
                                        )}
                                    >
                                        <Check className={cn("h-4 w-4")} />
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {selected.length > 0 && (
                    <div className="p-2 border-t">
                        <Button
                            variant="ghost"
                            className="w-full h-8 text-xs justify-center"
                            onClick={() => onChange([])}
                        >
                            Limpiar Selección
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
