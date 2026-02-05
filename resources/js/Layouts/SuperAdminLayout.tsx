import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Store,
    Grid,
    Users,
    CreditCard,
    Receipt,
    Menu,
    LogOut,
    Bell,
    Settings,
    User,
    ShoppingBag,
    Banknote,
    FolderOpen,
    Check,
    ShieldCheck,
    Lock,
    Image,
    Inbox,
    ClipboardList
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb"
import { NavUser } from "@/Components/nav-user"
import { Badge } from '@/Components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import NotificationSidebar from '@/Components/NotificationSidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/Components/ui/sidebar';
import { SuperAdminSidebar } from '@/Components/SuperAdminSidebar';
import { Separator } from '@/Components/ui/separator';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface SuperAdminLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

interface NavItem {
    label: string;
    route: string;
    icon: any;
    permission?: string;
    count?: number;
}

export default function SuperAdminLayout({ children, header, breadcrumbs }: SuperAdminLayoutProps) {
    const { auth, flash, site_settings } = usePage<PageProps & {
        auth: {
            notifications: { unread_count: number, recent: any[] },
            permissions: string[]
        },
        flash: { success?: string, error?: string },
        site_settings?: {
            app_name: string;
            logo_url: string | null;
        }
    }>().props;
    const user = auth.user;
    const permissions = auth.permissions || [];

    const [unreadCount, setUnreadCount] = useState(auth.notifications?.unread_count || 0);
    const [recentNotifications, setRecentNotifications] = useState(auth.notifications?.recent || []);
    const [newTenantsCount, setNewTenantsCount] = useState(0);
    const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    useEffect(() => {
        // Synchronize with inertia props if they change
        if (auth.notifications) {
            setUnreadCount(auth.notifications.unread_count);
            setRecentNotifications(auth.notifications.recent);
        }
    }, [auth.notifications]);

    const handleNotificationRead = (id: string) => {
        setRecentNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleAllRead = () => {
        setRecentNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
        setUnreadCount(0);
    };

    // Permission Checker
    const checkPermission = (permission?: string) => {
        if (!permission) return true;
        return permissions.includes('*') || permissions.includes(permission);
    };

    const handleNavigation = (e: React.MouseEvent, permission?: string) => {
        if (permission && !checkPermission(permission)) {
            e.preventDefault();
            setShowPermissionModal(true);
        }
    };

    useEffect(() => {
        // @ts-ignore
        if (window.Echo) {
            console.log('[Echo] Subscribing to superadmin-updates channel...');
            // @ts-ignore
            window.Echo.channel('superadmin-updates')
                .listen('.tenant.created', (e: any) => {
                    console.log('[Echo] Received .tenant.created event:', e);
                    toast.info(`¡Nueva tienda registrada!`, {
                        description: e.message
                    });
                    setNewTenantsCount(prev => prev + 1);
                    setUnreadCount(prev => prev + 1);

                    // Add to recent list (real-time)
                    const newNotification = {
                        id: Math.random().toString(), // Temp ID for list key
                        data: {
                            ...e, // Spread all properties (message, owner_email, plan_name, etc.)
                            type: 'tenant_created',
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                })
                .listen('.ticket.created', (e: any) => {
                    console.log('[Echo] Received .ticket.created event:', e);
                    toast.info('¡Nuevo ticket de soporte!', {
                        description: e.message,
                        action: {
                            label: 'Ver',
                            onClick: () => window.location.href = e.url
                        }
                    });
                    setUnreadCount(prev => prev + 1);

                    const newNotification = {
                        id: Math.random().toString(),
                        data: {
                            ...e,
                            type: 'ticket_created',
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                })
                .listen('.ticket.replied', (e: any) => {
                    console.log('[Echo] Received .ticket.replied event:', e);
                    toast.info('Nueva respuesta en ticket', {
                        description: e.message,
                        action: {
                            label: 'Ver',
                            onClick: () => window.location.href = e.url
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
                })
                .listen('.ticket.assigned', (e: any) => {
                    console.log('[Echo] Received .ticket.assigned event:', e);
                    toast.success('Ticket asignado', {
                        description: e.message,
                        action: {
                            label: 'Ver',
                            onClick: () => window.location.href = e.url
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
                })
                .listen('.payment.reported', (e: any) => {
                    console.log('[Echo] Received .payment.reported event:', e);
                    toast.success(`¡Nuevo pago reportado!`, {
                        description: e.message
                    });
                    setUnreadCount(prev => prev + 1);

                    const newNotification = {
                        id: Math.random().toString(),
                        data: {
                            message: e.message,
                            type: 'payment_reported',
                            url: e.url
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                })
                .listen('.icon.requested', (e: any) => {
                    console.log('[Echo] Received .icon.requested event:', e);
                    toast.info(`¡Nueva solicitud de icono!`, {
                        description: e.message
                    });
                    setUnreadCount(prev => prev + 1);

                    const newNotification = {
                        id: Math.random().toString(),
                        data: {
                            message: e.message,
                            type: 'icon_requested',
                            url: e.url
                        },
                        created_at: new Date().toISOString(),
                        read_at: null
                    };
                    setRecentNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
                });


            // Debug Connection
            console.log('[Echo] Listeners attached to superadmin-updates');
            // @ts-ignore
            if (window.Echo.connector.ably.connection.state === 'connected') {
                console.log('[Echo] Status: Connected');
            } else {
                console.log('[Echo] Status:', window.Echo.connector.ably.connection.state);
                // @ts-ignore
                window.Echo.connector.ably.connection.on('connected', () => console.log('[Echo] Connected!'));
            }

            // Debug: spy on all messages on this channel
            // @ts-ignore
            if (window.Echo.connector.ably.channels.get('superadmin-updates')) {
                // @ts-ignore
                window.Echo.connector.ably.channels.get('superadmin-updates').subscribe((msg) => {
                    console.log('[Ably Raw] Message received:', msg.name, msg.data);
                });
            }
        } else {
            console.warn('[Echo] window.Echo not available');
        }
    }, []);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <SidebarProvider>
            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <SuperAdminSidebar user={user} logo={{ url: site_settings?.logo_url || null, name: site_settings?.app_name || 'Linkiu' }} />

            <SidebarInset>
                {/* Navbar */}
                <header className="bg-background/80 backdrop-blur-md rounded-t-3xl border-b border-border h-12 flex items-center justify-between px-4 sticky top-0 z-30 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 md:hidden" />
                        {/*<Separator orientation="vertical" className="mr-2 h-4" />*/}
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink asChild>
                                        <Link href={route('superadmin.dashboard')}>SuperLinkiu</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                {breadcrumbs ? (
                                    breadcrumbs.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <BreadcrumbItem>
                                                {item.href ? (
                                                    <BreadcrumbLink asChild>
                                                        <Link href={item.href}>{item.label}</Link>
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>
                                            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{header}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-muted-foreground hover:text-foreground"
                            onClick={() => setIsNotificationSidebarOpen(true)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full animate-pulse ring-2 ring-background" />
                            )}
                        </Button>

                        <NotificationSidebar
                            open={isNotificationSidebarOpen}
                            onOpenChange={setIsNotificationSidebarOpen}
                            notifications={recentNotifications}
                            onNotificationRead={handleNotificationRead}
                            onAllRead={handleAllRead}
                        />

                        {/* Note: User menu is now in the Sidebar Footer */}
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 md:px-8 overflow-auto">
                    {children}
                </div>

                {/* Footer */}
                <footer className="border-t border-border bg-background px-6 py-2 text-center rounded-b-3xl">
                    <div className="flex flex-col md:flex-row justify-between items-center p-4 text-xs text-muted-foreground">
                        <span>&copy; 2026 <strong>Linkiu.bio</strong>. Todos los derechos reservados.</span>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                            <span>v1.0.0 (Beta)</span>
                            <span className="h-3 w-px bg-border"></span>
                            <a href="#" className="hover:text-foreground">Soporte</a>
                        </div>
                    </div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    );
}
