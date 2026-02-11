
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Camera, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { toast } from 'sonner';
import axios from 'axios';

interface Props {
    token: string;
    tenant: any; // Using any to accept full model with slug
}

export default function MagicUpload({ token, tenant }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            await axios.post(route('tenant.magic.store', { tenant: tenant.slug, token }), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(true);
            toast.success('¡Comprobante enviado exitosamente!');
        } catch (error) {
            console.error(error);
            toast.error('Error al subir el comprobante. Intenta nuevamente.');
        } finally {
            setUploading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <Head title="Comprobante Enviado" />
                <Card className="w-full max-w-sm text-center border-none shadow-lg">
                    <CardContent className="pt-10 pb-10 space-y-4">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">¡Recibido!</h2>
                        <p className="text-slate-600">
                            Tu comprobante ha sido enviado a la caja.
                            <br />
                            Ya puedes cerrar esta ventana.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title={`Cargar Comprobante - ${tenant.name}`} />

            <div className="mb-6 text-center">
                {tenant.logo_url && (
                    <img src={tenant.logo_url} alt={tenant.name} className="h-12 w-auto mx-auto mb-2 object-contain" />
                )}
                <h1 className="text-lg font-bold text-slate-900">{tenant.name}</h1>
            </div>

            <Card className="w-full max-w-sm border-none shadow-lg overflow-hidden">
                <CardHeader className="bg-white border-b pb-4">
                    <CardTitle className="text-center text-xl">Adjuntar Comprobante</CardTitle>
                    <CardDescription className="text-center">
                        Toma una foto o selecciona el pantallazo de tu transferencia.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div
                        className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 min-h-[250px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden"
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-contain absolute inset-0" />
                        ) : (
                            <div className="text-center p-6 space-y-2">
                                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-2">
                                    <Camera className="w-6 h-6" />
                                </div>
                                <p className="font-medium text-slate-800">Tocar para subir foto</p>
                                <p className="text-xs text-slate-500">Soporta JPG, PNG, WebP (Max 10MB)</p>
                            </div>
                        )}

                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {preview && (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setPreview(null);
                                    setFile(null);
                                }}
                                disabled={uploading}
                            >
                                Cambiar
                            </Button>
                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Confirmar Envío'
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <p className="mt-8 text-xs text-slate-400">
                Powered by Linkiu POS
            </p>
        </div>
    );
}
