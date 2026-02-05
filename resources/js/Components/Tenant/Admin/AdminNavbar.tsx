import { Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect, Fragment } from 'react';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
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
import { SidebarTrigger } from '@/Components/ui/sidebar';
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
import { Separator } from '@/Components/ui/separator';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

interface AdminNavbarProps {
    title?: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
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

export default function AdminNavbar({ title, breadcrumbs }: AdminNavbarProps) {
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
                })
                .listen('.ticket.replied', (e: any) => {
                    // Only show if it's a staff reply (support responding to tenant)
                    if (e.is_staff) {
                        toast.info('Nueva respuesta de soporte', {
                            description: e.message,
                            action: {
                                label: 'Ver',
                                onClick: () => window.location.href = route('tenant.support.show', {
                                    tenant: currentTenant.slug,
                                    support: e.ticket_id
                                })
                            }
                        });
                        setUnreadCount(prev => prev + 1);

                        const newNotification = {
                            id: Math.random().toString(),
                            data: {
                                ...e,
                                type: 'ticket_replied',
                            },
                            created_at: new Date().toISOString(),
                            read_at: null
                        };
                        setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                    }
                })
                .listen('.ticket.assigned', (e: any) => {
                    console.log('[Echo] Received .ticket.assigned event:', e);
                    toast.success('Ticket asignado', {
                        description: e.message,
                        action: {
                            label: 'Ver',
                            onClick: () => window.location.href = route('tenant.support.show', {
                                tenant: currentTenant.slug,
                                support: e.ticket_id
                            })
                        }
                    });
                    setUnreadCount(prev => prev + 1);

                    const newNotification = {
                        id: Math.random().toString(),
                        data: {
                            ...e,
                            type: 'ticket_assigned',
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

    return (
        <header className="h-14 bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 transition-all duration-300">
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4">
                {/* Left side: Navigation & Title */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1 md:hidden" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink asChild>
                                    <Link href={route('tenant.dashboard', { tenant: currentTenant.slug })}>
                                        Panel
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            {breadcrumbs ? (
                                breadcrumbs.map((item, index) => (
                                    <Fragment key={index}>
                                        <BreadcrumbItem>
                                            {item.href ? (
                                                <BreadcrumbLink asChild>
                                                    <Link href={item.href}>{item.label}</Link>
                                                </BreadcrumbLink>
                                            ) : (
                                                <BreadcrumbPage>
                                                    {item.label}
                                                </BreadcrumbPage>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 && (
                                            <BreadcrumbSeparator />
                                        )}
                                    </Fragment>
                                ))
                            ) : (
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Right side: Actions & Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* View Shop Button */}
                    <Button asChild>
                        <a href={currentTenant ? `//${storeUrl}` : '#'} target="_blank" rel="noopener noreferrer">
                            <ExternalLink />
                            Ver Tienda
                        </a>
                    </Button>

                    {/* Help Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer ring-0 focus:ring-0 focus:outline-none">
                            <Button variant="ghost">
                                <LifeBuoy />
                                Ayuda
                                <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer ring-0 focus:ring-0 focus:outline-none">
                                <Bug className="w-4 h-4 text-rose-500" />
                                Reportar error
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer ring-0 focus:ring-0 focus:outline-none">
                                <LifeBuoy className="w-4 h-4 text-amber-500" />
                                Tutoriales
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer ring-0 focus:ring-0 focus:outline-none">
                                <Headphones className="w-4 h-4" />
                                Hablar con asesor
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Separator orientation="vertical" className="h-6 hidden sm:block" />

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-muted-foreground hover:text-foreground"
                        onClick={() => setIsNotificationSidebarOpen(true)}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                        )}
                    </Button>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="outline-none ring-0">
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.profile_photo_url} alt={user?.name} />
                                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal border-b pb-3">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm font-semibold leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                    <Badge variant="outline" className="w-fit text-[10px] py-0">
                                        {currentUserRole?.label || 'Linkiu Member'}
                                    </Badge>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuGroup className="py-1">
                                <DropdownMenuItem asChild className="cursor-pointer ring-0 focus:ring-0 focus:outline-none">
                                    <Link
                                        href={currentTenant ? route('tenant.profile.edit', { tenant: currentTenant.slug }) : '#'}
                                        onClick={(e) => handleRestrictedClick(e, 'profile.view')}
                                    >
                                        <User className="mr-3 h-4 w-4 text-slate-400" />
                                        <span>Mi Perfil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer ring-0 focus:ring-0 focus:outline-none">
                                    <Link
                                        href={currentTenant ? route('tenant.settings.edit', { tenant: currentTenant.slug }) : '#'}
                                        onClick={(e) => handleRestrictedClick(e, 'settings.view')}
                                    >
                                        <Settings className="mr-3 h-4 w-4 text-slate-400" />
                                        <span>Configuración</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer ring-0 focus:ring-0 focus:outline-none">
                                    <Link
                                        href={currentTenant ? route('tenant.roles.index', { tenant: currentTenant.slug }) : '#'}
                                        onClick={(e) => handleRestrictedClick(e, 'roles.view')}
                                    >
                                        <Shield className="mr-3 h-4 w-4 text-slate-400" />
                                        <span>Roles y Permisos</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer ring-0 focus:ring-0 focus:outline-none text-destructive focus:text-destructive"
                                >
                                    <Link href={currentTenant ? route('tenant.logout', { tenant: currentTenant.slug }) : '#'} method="post" as="button" className="w-full text-left">
                                        <LogOut className="mr-3 h-4 w-4" />
                                        Cerrar Sesión
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <NotificationSidebar
                open={isNotificationSidebarOpen}
                onOpenChange={setIsNotificationSidebarOpen}
                notifications={recentNotifications}
                onNotificationRead={handleNotificationRead}
                onAllRead={handleAllRead}
            />
        </header>
    );
}
