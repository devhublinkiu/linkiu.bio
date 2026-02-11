import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface Table {
    id: number;
    name: string;
    token: string;
}

interface Zone {
    id: number;
    name: string;
    tables: Table[];
}

interface Props {
    zones: Zone[];
}

export default function Print({ zones }: Props) {
    const { currentTenant } = usePage<PageProps>().props;

    const handlePrint = () => {
        window.print();
    };

    const getTableUrl = (token: string) => {
        // Construct the full URL for the client
        const baseUrl = window.location.origin;
        return `${baseUrl}/${currentTenant?.slug}?m=${token}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 print:bg-white print:p-0">
            <Head title="Imprimir QRs - Mesas" />

            {/* Top Bar - Hidden in Print */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between print:hidden">
                <Button variant="ghost" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                </Button>
                <div className="flex gap-4">
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" /> Imprimir QRs
                    </Button>
                </div>
            </div>

            {/* Printable Content */}
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm border print:shadow-none print:border-none">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">{currentTenant?.name}</h1>
                    <p className="text-slate-500 font-medium">Códigos QR para Pedidos en Mesa</p>
                    <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="space-y-16">
                    {zones.map((zone) => (
                        <div key={zone.id} className="break-inside-avoid">
                            <div className="flex items-center gap-3 mb-8 border-b pb-2 border-slate-100">
                                <MapPin className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Zona: {zone.name}</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {zone.tables.map((table) => (
                                    <div key={table.id} className="flex flex-col items-center p-6 border rounded-2xl bg-slate-50/30 border-slate-100 break-inside-avoid">
                                        <div className="bg-white p-4 rounded-xl shadow-sm mb-4 ring-1 ring-slate-100">
                                            <QRCodeSVG
                                                value={getTableUrl(table.token)}
                                                size={140}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Escanea para pedir</div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase">{table.name}</h3>
                                        </div>
                                        <div className="mt-4 text-[9px] text-slate-300 font-mono break-all line-clamp-1 max-w-[120px]">
                                            {table.token}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-dashed text-center">
                    <p className="text-xs text-slate-400">Generado automáticamente por Linkiu.bio - Gastronomía</p>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page {
                        margin: 1cm;
                        size: portrait;
                    }
                    body {
                        background: white !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            ` }} />
        </div>
    );
}
