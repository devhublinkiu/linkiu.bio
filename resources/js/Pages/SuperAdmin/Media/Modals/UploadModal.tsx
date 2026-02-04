import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: any;
    setData: (key: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    processing: boolean;
    folders: string[];
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadModal({
    open,
    onOpenChange,
    data,
    setData,
    onSubmit,
    fileInputRef,
    processing,
    folders,
    onFileSelect
}: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Subir Archivos</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold tracking-tight">Archivos</label>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={onFileSelect}
                            className="cursor-pointer file:font-semibold file:text-primary"
                        />
                        {data.files.length > 0 && (
                            <p className="text-xs font-medium text-muted-foreground mt-2 bg-muted p-2 rounded-md">
                                {data.files.length} archivo(s) seleccionado(s)
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold tracking-tight">Carpeta</label>
                        <Select
                            value={data.folder}
                            onValueChange={(value) => setData('folder', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona carpeta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uploads">uploads</SelectItem>
                                {folders.filter(f => f !== 'uploads').map(folder => (
                                    <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Usa "Nueva Carpeta" para crear una carpeta nueva
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold tracking-tight">Descripción (opcional)</label>
                        <Input
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Descripción del archivo"
                        />
                    </div>

                    <Button type="submit" disabled={processing || data.files.length === 0} className="w-full">
                        {processing ? 'Subiendo...' : 'Subir'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
