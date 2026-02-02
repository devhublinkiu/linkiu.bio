import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { MediaManagerModal, MediaFile } from "@/Components/Shared/MediaManager/MediaManagerModal";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaInputProps {
    value?: string | null;
    onChange: (url: string | null, file?: MediaFile) => void;
    label?: string;
    className?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    onDisabledClick?: () => void;
}

export function MediaInput({ value, onChange, label, className, placeholder = "Seleccionar imagen", error, disabled, onDisabledClick }: MediaInputProps) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        if (disabled) {
            onDisabledClick?.();
            return;
        }
        setOpen(true);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

            <div className="flex gap-4 items-start">
                <div
                    className={cn(
                        "relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group",
                        value && "border-solid border-gray-200",
                        error && "border-red-300 bg-red-50",
                        disabled && "opacity-80 hover:bg-gray-50 cursor-pointer" // Keep pointer to indicate interactivity (intercepted)
                    )}
                    onClick={handleOpen}
                >
                    {value ? (
                        <>
                            <img src={value} alt="Selected" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-medium">Cambiar</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400 text-center p-2">
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-[10px] uppercase font-medium">Seleccionar</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleOpen}
                        className="w-full justify-start gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {value ? "Cambiar Imagen" : placeholder}
                    </Button>

                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onChange(null)}
                            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <X className="w-4 h-4" />
                            Eliminar
                        </Button>
                    )}

                    <p className="text-xs text-gray-500">
                        Sube una imagen o selecciona una de tu biblioteca.
                    </p>
                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                </div>
            </div>

            <MediaManagerModal
                open={open}
                onOpenChange={setOpen}
                onSelect={(file: MediaFile) => {
                    onChange(file.url, file);
                    setOpen(false);
                }}
            />
        </div>
    );
}
