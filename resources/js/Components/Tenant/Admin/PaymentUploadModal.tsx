import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { Loader2, Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    invoice: any;
}

export default function PaymentUploadModal({ isOpen, onClose, invoice }: Props) {
    const { auth, currentTenant } = usePage<any>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        invoice_id: invoice?.id,
        proof: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("proof", file);

            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.proof) {
            toast.error("Por favor selecciona un archivo");
            return;
        }

        if (!currentTenant?.slug) {
            toast.error("Error de sesión: No se pudo identificar la tienda");
            return;
        }

        post(route('tenant.invoices.store', { tenant: currentTenant.slug }), {
            onSuccess: () => {
                toast.success("Comprobante enviado correctamente");
                reset();
                setPreview(null);
                onClose();
            },
            onError: (err) => {
                console.error(err);
                toast.error("Error al subir el comprobante");
            }
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        setPreview(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md border-primary/10 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Subir Comprobante
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">
                        Carga el recibo de transferencia para la Factura #{invoice?.id}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                            />

                            {preview ? (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                    <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreview(null);
                                            setData("proof", null);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : data.proof ? (
                                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl w-full border border-slate-100">
                                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-700 truncate">{data.proof.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF Seleccionado</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setData("proof", null);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <Upload className="w-7 h-7" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-700">Haz clic para seleccionar</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Soporta JPG, PNG o PDF (Máximo 4MB)</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {errors.proof && (
                            <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.proof}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pb-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            className="font-bold text-slate-500 order-2 sm:order-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            disabled={processing || !data.proof}
                            className="font-bold shadow-lg shadow-primary/20 order-1 sm:order-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Enviar Comprobante
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function AlertCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}
