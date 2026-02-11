import { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { UserPlus, MoreHorizontal, Trash2, Shield, User, Mail, Building2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
import { toast } from 'sonner';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { PageProps } from '@/types';

interface Member {
    id: number;
    name: string;
    email: string;
    profile_photo_url: string;
    role_label: string;
    role_type: 'owner' | 'system' | 'custom' | 'legacy';
    pivot: {
        role_id: number | null;
        location_id: number | null;
        role: string;
        created_at: string;
    };
}

interface Role {
    id: number;
    name: string;
}
interface Props {
    members: Member[];
    roles: Role[];
    locations: any[];
    currentTenant: any;
}

export default function MembersIndex({ members, roles, locations, currentTenant }: Props) {
    const { currentUserRole } = usePage<PageProps>().props;
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const checkPermission = (permission: string) => {
        if (!currentUserRole) return false;
        return currentUserRole.is_owner ||
            currentUserRole.permissions.includes('*') ||
            currentUserRole.permissions.includes(permission);
    };

    const handleActionWithPermission = (permission: string, action: () => void) => {
        if (checkPermission(permission)) {
            action();
        } else {
            setShowPermissionModal(true);
        }
    };
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        name: '',
        password: '',
        role_id: '',
        location_id: '',
    });

    const updateForm = useForm({
        role_id: '',
    });

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        handleActionWithPermission('users.create', () => {
            post(route('tenant.members.store', { tenant: currentTenant?.slug }), {
                onSuccess: () => {
                    setIsInviteOpen(false);
                    reset();
                    toast.success('Miembro invitado correctamente');
                },
                onError: () => {
                    toast.error('Error al invitar miembro');
                }
            });
        });
    };

    const handleUpdatePivot = (memberId: number, field: 'role_id' | 'location_id', value: string) => {
        handleActionWithPermission('users.update', () => {
            router.put(route('tenant.members.update', { tenant: currentTenant?.slug, member: memberId }), {
                role_id: field === 'role_id' ? value : undefined,
                location_id: field === 'location_id' ? (value === 'all' ? null : value) : undefined,
            }, {
                onSuccess: () => toast.success('Usuario actualizado'),
                onError: () => toast.error('Error al actualizar')
            });
        });
    };

    const handleDelete = (memberId: number) => {
        handleActionWithPermission('users.delete', () => {
            router.delete(route('tenant.members.destroy', { tenant: currentTenant?.slug, member: memberId }), {
                onSuccess: () => {
                    toast.success('Miembro eliminado');
                    setMemberToDelete(null);
                },
                onError: () => toast.error('No se pudo eliminar al miembro')
            });
        });
    };

    const openInviteModal = () => {
        handleActionWithPermission('users.create', () => setIsInviteOpen(true));
    }

    return (
        <AdminLayout title="Equipo">
            <Head title="Equipo" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Equipo</h2>
                        <p className="text-slate-500">Gestiona los miembros de tu equipo y sus permisos.</p>
                    </div>
                    <Dialog open={isInviteOpen} onOpenChange={(open) => {
                        if (open) openInviteModal();
                        else setIsInviteOpen(false);
                    }}>
                        <Button className="cursor-pointer ring-0 hover:ring-0 focus:ring-0" onClick={openInviteModal}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Agregar Miembro
                        </Button>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Agregar Nuevo Miembro</DialogTitle>
                                <DialogDescription>
                                    Invita a un usuario existente por su correo electrónico para unirse a tu equipo.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleInvite} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            className="pl-9 ring-0 hover:ring-0 focus:ring-0"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                    </div>
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre (Solo para nuevos usuarios)</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="name"
                                            placeholder="Nombre Completo"
                                            className="pl-9 ring-0 hover:ring-0 focus:ring-0"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                    </div>
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña (Solo para nuevos usuarios)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="******"
                                        className="ring-0 hover:ring-0 focus:ring-0"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                    />
                                    <p className="text-[10px] text-slate-500">
                                        Si el usuario ya existe, estos campos se ignorarán.
                                    </p>
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol Asignado</Label>
                                    <Select
                                        onValueChange={(val) => setData('role_id', val)}
                                        value={data.role_id}
                                    >
                                        <SelectTrigger className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={String(role.id)} className="cursor-pointer">
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role_id && <p className="text-sm text-red-500">{errors.role_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Sede Asignada (Opcional)</Label>
                                    <Select
                                        onValueChange={(val) => setData('location_id', val)}
                                        value={data.location_id}
                                    >
                                        <SelectTrigger className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">
                                            <SelectValue placeholder="Global (Todas las sedes)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Global (Todas las sedes)</SelectItem>
                                            {locations.map((loc) => (
                                                <SelectItem key={loc.id} value={String(loc.id)} className="cursor-pointer">
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.location_id && <p className="text-sm text-red-500">{errors.location_id}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing} className="w-full cursor-pointer ring-0 hover:ring-0 focus:ring-0">
                                        {processing ? 'Procesando...' : 'Agregar Miembro'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[30%]">Usuario</TableHead>
                                <TableHead>Rol Actual</TableHead>
                                <TableHead>Sede Asignada</TableHead>
                                <TableHead>Fecha de Ingreso</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.profile_photo_url} />
                                                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-slate-900">{member.name}</div>
                                                <div className="text-xs text-slate-500">{member.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {member.role_type === 'owner' ? (
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Propietario
                                                </Badge>
                                            </div>
                                        ) : (
                                            <div
                                                onClickCapture={(e) => {
                                                    if (!checkPermission('users.update')) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        setShowPermissionModal(true);
                                                    }
                                                }}
                                            >
                                                <Select
                                                    defaultValue={member.pivot.role_id ? String(member.pivot.role_id) : undefined}
                                                    onValueChange={(val) => handleUpdatePivot(member.id, 'role_id', val)}
                                                    disabled={!checkPermission('users.update')}
                                                >
                                                    <SelectTrigger
                                                        className={`w-[160px] h-8 text-xs cursor-pointer ring-0 hover:ring-0 focus:ring-0 ${!checkPermission('users.update') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <SelectValue placeholder={member.role_label} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roles.map((role) => (
                                                            <SelectItem key={role.id} value={String(role.id)} className="cursor-pointer">
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {member.role_type === 'owner' ? (
                                            <Badge variant="outline" className="text-[10px] h-6 px-2 border-primary/20 bg-primary/5 text-primary">
                                                <Building2 className="w-3 h-3 mr-1" />
                                                Acceso Total
                                            </Badge>
                                        ) : (
                                            <div
                                                onClickCapture={(e) => {
                                                    if (!checkPermission('users.update')) {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        setShowPermissionModal(true);
                                                    }
                                                }}
                                            >
                                                <Select
                                                    defaultValue={member.pivot.location_id ? String(member.pivot.location_id) : "all"}
                                                    onValueChange={(val) => handleUpdatePivot(member.id, 'location_id', val)}
                                                    disabled={!checkPermission('users.update')}
                                                >
                                                    <SelectTrigger
                                                        className={`w-[180px] h-8 text-xs cursor-pointer ring-0 hover:ring-0 focus:ring-0 ${!checkPermission('users.update') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-3 h-3 text-primary" />
                                                            <SelectValue placeholder="Global" />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all" className="cursor-pointer">Global (Todas las sedes)</SelectItem>
                                                        {locations.map((loc) => (
                                                            <SelectItem key={loc.id} value={String(loc.id)} className="cursor-pointer">
                                                                {loc.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {new Date(member.pivot.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {member.role_type === 'owner' ? (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 cursor-not-allowed" disabled>
                                                <Trash2 className="h-4 w-4 text-slate-300" />
                                            </Button>
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer ring-0 hover:ring-0 focus:ring-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                                                        onSelect={() => handleActionWithPermission('users.delete', () => setMemberToDelete(member))}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar del Equipo
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Miembro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar a <span className="font-bold">{memberToDelete?.name}</span> del equipo? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer ring-0 hover:ring-0 focus:ring-0">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => memberToDelete && handleDelete(memberToDelete.id)}
                            variant="destructive"
                            className="cursor-pointer ring-0 hover:ring-0 focus:ring-0"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
