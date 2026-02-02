import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { LockKeyhole } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

export function PermissionDeniedModal({
    open,
    onOpenChange,
    title = "Acceso Restringido",
    description = "No tienes los permisos necesarios para realizar esta acción o acceder a esta sección. Contacta al administrador del equipo si crees que esto es un error."
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex flex-col items-center text-center gap-4 pt-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <LockKeyhole className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <DialogTitle className="text-xl text-center">{title}</DialogTitle>
                        <DialogDescription className="text-center">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="sm:justify-center pt-4">
                    <Button
                        variant="secondary"
                        className="min-w-[120px] font-bold"
                        onClick={() => onOpenChange(false)}
                    >
                        Entendido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
