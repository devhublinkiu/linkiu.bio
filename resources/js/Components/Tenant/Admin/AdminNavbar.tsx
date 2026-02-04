import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import {
    Bell,
    Menu,
    Search,
    User,
    Settings,
    LogOut,
    ExternalLink,
    ChevronDown,
    Bug,
    LifeBuoy,
    Headphones,
    CheckCircle2,
    Shield
} from 'lucide-react';
import { PageProps } from '@/types';
import NotificationSidebar from '@/Components/NotificationSidebar';
import { toast } from 'sonner';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

interface AdminNavbarProps {
    title?: React.ReactNode;
    onMenuClick?: () => void;
}

interface Props {
    notifications: {
        unread_count: number;
        recent: any[];
    };
    currentUserRole?: {
        label: string;
        is_owner: boolean;
        permissions: string[];
    };
}

export default function AdminNavbar({ title, onMenuClick }: AdminNavbarProps) {
    const { auth, currentTenant, currentUserRole } = usePage<PageProps & { currentTenant: any } & Props>().props;
    const user = auth?.user;
    const url = usePage().url;

    const roleLabel = currentUserRole?.label || 'Miembro';
    const isOwner = currentUserRole?.is_owner;

    // Permission Logic
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    const canAccess = (permission: string) => {
        if (!currentUserRole) return false;
        if (currentUserRole.is_owner) return true;
        // Check for specific permission or wildcard
        return currentUserRole.permissions.includes(permission) || currentUserRole.permissions.includes('*');
    };

    const handleRestrictedClick = (e: React.MouseEvent, permission: string) => {
        if (!canAccess(permission)) {
            e.preventDefault();
            setShowPermissionModal(true);
        }
    };

    const [baseUrl, setBaseUrl] = useState('');
    useEffect(() => {
        setBaseUrl(window.location.host);
    }, []);

    const storeUrl = currentTenant ? `${baseUrl}/${currentTenant.slug}` : baseUrl;

    const [unreadCount, setUnreadCount] = useState(auth?.notifications?.unread_count || 0);
    const [recentNotifications, setRecentNotifications] = useState(auth?.notifications?.recent || []);
    const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

    useEffect(() => {
        if (auth?.notifications) {
            setUnreadCount(auth.notifications.unread_count);
            setRecentNotifications(auth.notifications.recent);
        }
    }, [auth?.notifications]);

    useEffect(() => {
        // @ts-ignore
        if (window.Echo && currentTenant?.id) {
            // @ts-ignore
            window.Echo.channel(`tenant-updates.${currentTenant.id}`)
                .listen('.invoice.generated', (e: any) => {
                    toast.info(`¡Nueva factura generada!`, {
                        description: e.message
                    });
                    setUnreadCount(prev => prev + 1);

                    const newNotification = {
                        id: Math.random().toString(),
                        data: {
                            message: e.message,
                            type: 'invoice_generated',
                            url: e.url
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                })
                .listen('.payment.status_updated', (e: any) => {
                    const isPaid = e.status === 'paid';
                    if (isPaid) {
                        toast.success('¡Pago Aprobado!', { description: e.message });
                    } else {
                        toast.error('Pago Rechazado', { description: e.message });
                    }
                    setUnreadCount(prev => prev + 1);

                    const newNotification = {
                        id: Math.random().toString(),
                        data: {
                            message: e.message,
                            type: 'payment_status_updated',
                            url: e.url // Link to invoice
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                })
                .listen('.icon.status_updated', (e: any) => {
                    const isApproved = e.status === 'approved';
                    if (isApproved) {
                        toast.success('¡Icono Aprobado!', { description: e.message });
                    } else {
                        toast.error('Icono Rechazado', { description: e.message });
                    }
                    setUnreadCount(prev => prev + 1);

                    const newNotification = {
                        id: Math.random().toString(),
                        data: {
                            message: e.message,
                            type: 'icon_status_updated',
                            url: e.url
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                });
        }
    }, [currentTenant?.id]);

    const handleNotificationRead = (id: string) => {
        setRecentNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleAllRead = () => {
        setRecentNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        setUnreadCount(0);
    };

    // Helper to generate breadcrumbs from URL
    const generateBreadcrumbs = () => {
        const pathSegments = url.split('?')[0].split('/').filter(Boolean);
        const adminIndex = pathSegments.indexOf('admin');
        const relevantSegments = adminIndex !== -1 ? pathSegments.slice(adminIndex + 1) : pathSegments.slice(1);

        const breadcrumbs = [
            { label: 'Panel', href: route('tenant.dashboard', { tenant: currentTenant?.slug }) }
        ];

        const segmentTranslations: Record<string, string> = {
            'dashboard': 'Inicio',
            'products': 'Productos',
            'orders': 'Pedidos',
            'customers': 'Clientes',
            'analytics': 'Estadísticas',
            'settings': 'Configuración',
            'profile': 'Perfil',
            'subscription': 'Suscripción',
            'invoices': 'Facturas',
            'create': 'Nuevo',
            'edit': 'Editar',
        };

        relevantSegments.forEach((segment) => {
            const label = segmentTranslations[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            breadcrumbs.push({
                label: label,
                href: '#'
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 transition-all duration-300">
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
                {/* Left side: Navigation & Title */}
                <div className="flex items-center gap-4 min-w-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden h-10 w-10 text-slate-500 hover:bg-slate-100 transition-colors"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    <div className="flex flex-col min-w-0">
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((crumb, index) => (
                                    <Fragment key={index}>
                                        <BreadcrumbItem>
                                            {index < breadcrumbs.length - 1 ? (
                                                <BreadcrumbLink
                                                    href={crumb.href}
                                                    className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                                                >
                                                    {crumb.label}
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage className="text-base font-bold text-slate-900 truncate tracking-tight">
                                                    {title || crumb.label}
                                                </BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 && (
                                            <BreadcrumbSeparator className="text-slate-300" />
                                        )}
                                    </Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>

                {/* Right side: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* View Shop Button */}
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="hidden md:flex h-10 border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 px-4 gap-2 font-bold"
                    >
                        <a href={currentTenant ? `//${storeUrl}` : '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            Ver Tienda
                        </a>
                    </Button>

                    {/* Help Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden sm:flex h-10 gap-2 text-slate-600 hover:bg-slate-100 font-bold px-3 transition-colors"
                            >
                                <LifeBuoy className="w-4 h-4 text-slate-400" />
                                Ayuda
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-slate-100">
                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer gap-3 font-medium text-slate-600 focus:text-slate-900">
                                <Bug className="w-4 h-4 text-rose-500" />
                                Reportar error
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer gap-3 font-medium text-slate-600 focus:text-slate-900">
                                <LifeBuoy className="w-4 h-4 text-amber-500" />
                                Tutoriales
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer gap-3 font-bold text-primary focus:text-primary focus:bg-primary/5">
                                <Headphones className="w-4 h-4" />
                                Hablar con asesor
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                    {/* Notifications */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all relative"
                            onClick={() => setIsNotificationSidebarOpen(true)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white animate-pulse" />
                            )}
                        </Button>
                    </div>

                    <NotificationSidebar
                        open={isNotificationSidebarOpen}
                        onOpenChange={setIsNotificationSidebarOpen}
                        notifications={recentNotifications}
                        onNotificationRead={handleNotificationRead}
                        onAllRead={handleAllRead}
                    />

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto w-auto p-1 pr-3 rounded-full hover:bg-slate-100 transition-all flex items-center gap-3">
                                <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                                    <AvatarImage src={user?.profile_photo_url} />
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                        {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:flex flex-col items-start leading-none">
                                    <span className="text-sm font-bold text-slate-700">{user?.name || 'Admin'}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{roleLabel}</span>
                                </div>
                                <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2 shadow-2xl shadow-slate-200 border-slate-100 rounded-2xl">
                            <DropdownMenuLabel className="font-normal p-3">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name || 'Administrador'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email || ''}
                                    </p>
                                    <div className="pt-1">
                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal bg-slate-50 text-slate-500 border-slate-200">
                                            {roleLabel}
                                        </Badge>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <div className="p-1 space-y-0.5">
                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer focus:bg-slate-50" asChild>
                                    <Link href={currentTenant ? route('tenant.profile.edit', { tenant: currentTenant.slug }) : '#'}>
                                        <User className="mr-3 h-4 w-4 text-slate-400" />
                                        <span className="font-medium text-slate-700">Mi Perfil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer focus:bg-slate-50" asChild>
                                    <Link
                                        href={currentTenant ? route('tenant.settings.edit', { tenant: currentTenant.slug }) : '#'}
                                        onClick={(e) => handleRestrictedClick(e, 'settings.view')}
                                    >
                                        <Settings className="mr-3 h-4 w-4 text-slate-400" />
                                        <span className="font-medium text-slate-700">Configuración</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer focus:bg-slate-50" asChild>
                                    <Link
                                        href={currentTenant ? route('tenant.roles.index', { tenant: currentTenant.slug }) : '#'}
                                        onClick={(e) => handleRestrictedClick(e, 'roles.view')}
                                    >
                                        <Shield className="mr-3 h-4 w-4 text-slate-400" />
                                        <span className="font-medium text-slate-700">Roles y Permisos</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg py-2 cursor-pointer focus:bg-slate-50" asChild>
                                    <Link
                                        href={currentTenant ? route('tenant.members.index', { tenant: currentTenant.slug }) : '#'}
                                        onClick={(e) => handleRestrictedClick(e, 'users.view')}
                                    >
                                        <User className="mr-3 h-4 w-4 text-slate-400" />
                                        <span className="font-medium text-slate-700">Equipo</span>
                                    </Link>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <div className="p-1">
                                <DropdownMenuItem
                                    className="rounded-lg py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-bold"
                                    asChild
                                >
                                    <Link href={currentTenant ? route('tenant.logout', { tenant: currentTenant.slug }) : '#'} method="post" as="button" className="w-full text-left">
                                        <LogOut className="mr-3 h-4 w-4" />
                                        Cerrar Sesión
                                    </Link>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header >
    );
}
