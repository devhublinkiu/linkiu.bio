import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Search, Plus, User, Check, X, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { toast } from 'sonner';
import axios from 'axios';

interface Customer {
    id: number;
    name: string;
    phone?: string;
    identification_number?: string;
    email?: string;
    address?: string;
    notes?: string;
    created_at?: string;
}

interface CustomerSelectorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (customer: Customer | null) => void;
    // Optional: if you want to show pre-selected
    // selectedCustomer?: Customer | null; 
}

export default function CustomerSelectorModal({ open, onOpenChange, onSelect }: CustomerSelectorModalProps) {
    const [mode, setMode] = useState<'search' | 'create'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    // Create Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        document: '',
        email: '',
        address: '',
        notes: ''
    });

    // Debounced Search
    useEffect(() => {
        if (open && mode === 'search') {
            const delayDebounceFn = setTimeout(() => {
                if (searchQuery.length > 0) {
                    fetchCustomers();
                } else {
                    setCustomers([]);
                }
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchQuery, mode, open]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('tenant.admin.pos.customers.index'), {
                params: { search: searchQuery }
            });
            setCustomers(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Error buscando clientes');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWrapper = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(route('tenant.admin.pos.customers.store'), {
                name: formData.name,
                phone: formData.phone,
                identification_number: formData.document,
                email: formData.email,
                address: formData.address,
                notes: formData.notes
            });

            const newCustomer = response.data;
            toast.success('Cliente creado correctamente');
            onSelect(newCustomer);

            // Do NOT close automatically if we want to keep flow, 
            // but usually selecting closes it.
            // onOpenChange(false); // Handled by parent if onSelect triggers it? 
            // Better to let index handle closing or close here:
            // Actually Index.tsx: onSelect={(customer) => { setSelectedCustomer(customer); setShowCustomerModal(false); }}
            // So we don't strictly need to close here, but usually we do to be safe or if logic is local.
            // But checking Index.tsx logic, it closes it.

            // Reset form
            setFormData({ name: '', phone: '', document: '', email: '', address: '', notes: '' });
            setMode('search');
        } catch (error) {
            console.error(error);
            toast.error('Error creando cliente. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCustomer = (customer: Customer) => {
        onSelect(customer);
    };

    const handleClearSelection = () => {
        onSelect(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-white border-0 shadow-2xl">
                <DialogHeader className="p-4 border-b border-slate-100 flex-shrink-0 bg-slate-50">
                    <DialogTitle className="flex items-center justify-between">
                        <span className="font-bold text-lg text-slate-900">
                            {mode === 'search' ? 'Seleccionar Cliente' : 'Nuevo Cliente'}
                        </span>
                        {mode === 'search' ? (
                            <Button size="sm" onClick={() => setMode('create')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1">
                                <Plus className="w-4 h-4" /> Nuevo
                            </Button>
                        ) : (
                            <Button size="sm" variant="ghost" onClick={() => setMode('search')} className="text-slate-500 hover:text-slate-900 gap-1">
                                <Search className="w-4 h-4" /> Buscar
                            </Button>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {mode === 'search' ? (
                        <>
                            <div className="p-4 border-b border-slate-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        placeholder="Buscar por nombre, teléfono o documento..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-12 text-base"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-2 space-y-1">
                                    {customers.length === 0 && searchQuery.length > 0 && !loading && (
                                        <div className="text-center py-10 text-slate-400">
                                            <p>No se encontraron clientes.</p>
                                            <Button variant="link" onClick={() => setMode('create')} className="text-indigo-600">Crear nuevo</Button>
                                        </div>
                                    )}

                                    {customers.length === 0 && searchQuery.length === 0 && (
                                        <div className="text-center py-10 text-slate-400">
                                            <User className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                            <p>Busca un cliente para empezar</p>
                                        </div>
                                    )}

                                    {loading ? (
                                        <div className="flex justify-center p-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                        </div>
                                    ) : (
                                        customers.map(customer => (
                                            <button
                                                key={customer.id}
                                                onClick={() => handleSelectCustomer(customer)}
                                                className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-700 group-hover:text-indigo-900">{customer.name}</div>
                                                        <div className="text-xs text-slate-400 flex gap-2">
                                                            {customer.phone && <span>{customer.phone}</span>}
                                                            {customer.identification_number && <span>• {customer.identification_number}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Check className="w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="create-customer-form" onSubmit={handleCreateWrapper} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo *</Label>
                                    <Input
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="h-11"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="h-11"
                                            placeholder="300 123 4567"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="document">Documento / NIT</Label>
                                        <Input
                                            id="document"
                                            value={formData.document}
                                            onChange={e => setFormData({ ...formData, document: e.target.value })}
                                            className="h-11"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email (Facturación)</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="h-11"
                                        placeholder="cliente@email.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección (Delivery)</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="resize-none"
                                        placeholder="Calle 123... (Opcional)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notas Internas</Label>
                                    <Input
                                        id="notes"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="h-11"
                                        placeholder="Preferencias, alergias, etc."
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <DialogFooter className={`p-4 border-t border-slate-100 bg-slate-50 ${mode === 'create' ? 'justify-between' : 'justify-end'}`}>
                    {mode === 'create' ? (
                        <>
                            <Button type="button" variant="ghost" onClick={() => setMode('search')}>
                                Cancelar
                            </Button>
                            <Button type="submit" form="create-customer-form" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 w-32">
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Guardar
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
