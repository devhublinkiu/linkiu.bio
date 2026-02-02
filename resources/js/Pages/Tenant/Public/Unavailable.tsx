import { Head } from '@inertiajs/react';
import { Store, ShieldAlert } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function Unavailable() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Head title="Tienda no disponible" />

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
                <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Store className="h-10 w-10 text-amber-500" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-3">
                    Esta tienda no está disponible
                </h1>

                <p className="text-slate-500 mb-8 leading-relaxed">
                    La tienda que intentas visitar no está visible al público en este momento.
                    Podría estar en mantenimiento o configurándose.
                </p>

                <div className="pt-6 border-t border-slate-100">
                    <p className="text-sm text-slate-400 mb-4">¿Eres el dueño de este negocio?</p>
                    <Button
                        onClick={() => window.location.href = '/tenant/admin/login'}
                        variant="outline"
                        className="w-full"
                    >
                        Ingresar al Panel Administrativo
                    </Button>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                    Powered by <span className="font-bold text-slate-600">Linkiu</span>
                </p>
            </div>
        </div>
    );
}
