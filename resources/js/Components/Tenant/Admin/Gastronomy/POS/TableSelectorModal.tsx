import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Users, Armchair } from 'lucide-react';

import { Table } from '@/types/pos';

interface TableSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (table: Table) => void;
    tables: Table[];
    reservations?: any[];
    currentTableId?: number;
}

export default function TableSelectorModal({ isOpen, onClose, onSelect, tables, reservations = [], currentTableId }: TableSelectorModalProps) {

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'occupied': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200';
            case 'reserved': return 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200';
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'occupied': return 'Ocupada';
            case 'reserved': return 'Reservada';
            default: return 'Disponible';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Seleccionar Mesa</DialogTitle>
                    <DialogDescription>
                        Elige una mesa para asignar al pedido.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[400px] pr-4">
                    {tables.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Armchair className="w-12 h-12 mb-2 opacity-20" />
                            <p>No hay mesas configuradas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                            {tables.map((table) => (
                                <button
                                    key={table.id}
                                    onClick={() => {
                                        onSelect(table);
                                        onClose();
                                    }}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all min-h-[100px] ${table.id === currentTableId
                                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-2'
                                        : `border-transparent ${getStatusColor(table.status)}`
                                        }`}
                                >
                                    <span className="text-xl font-black block leading-none mb-1">{table.name}</span>
                                    <span className="text-[10px] font-bold uppercase mt-1">
                                        {table.status === 'reserved' && (reservations || []).find(r => r.table_id === table.id)?.customer_name
                                            ? (reservations || []).find(r => r.table_id === table.id)?.customer_name
                                            : getStatusLabel(table.status)
                                        }
                                    </span>
                                    <div className="flex items-center gap-1 text-xs font-semibold opacity-70 mt-2">
                                        <Users className="w-3 h-3" />
                                        <span>{table.capacity || 4}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
