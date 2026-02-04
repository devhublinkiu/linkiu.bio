import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: any; // Using inertia form types ideally
    onSubmit: (e: React.FormEvent) => void;
}

export function CreateFolderModal({ open, onOpenChange, form, onSubmit }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Nueva Carpeta</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold tracking-tight">Nombre de la carpeta</label>
                        <Input
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="mi-carpeta"
                            pattern="[a-zA-Z0-9_-]+"
                            title="Solo letras, números, guiones y guiones bajos"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Solo letras, números, guiones (-) y guiones bajos (_)
                        </p>
                    </div>

                    <Button type="submit" disabled={form.processing || !form.data.name} className="w-full">
                        {form.processing ? 'Creando...' : 'Crear Carpeta'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
