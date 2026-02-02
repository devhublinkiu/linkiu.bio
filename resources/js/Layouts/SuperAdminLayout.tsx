import { useState } from 'react';
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
    Check
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface SuperAdminLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
}

export default function SuperAdminLayout({ children, header }: SuperAdminLayoutProps) {
    const { auth, flash } = usePage<PageProps & {
        auth: {
            notifications: { unread_count: number, recent: any[] }
        },
        flash: { success?: string, error?: string }
    }>().props;
    const user = auth.user;
    const [unreadCount, setUnreadCount] = useState(auth.notifications?.unread_count || 0);
    const [recentNotifications, setRecentNotifications] = useState(auth.notifications?.recent || []);
    const [newTenantsCount, setNewTenantsCount] = useState(0);
    const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

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
                });
            console.log('[Echo] Listeners attached successfully');
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

    // Navigation Structure
    const navGroups = [
        {
            group: 'General',
            hideLabel: true,
            items: [
                { label: 'Dashboard', route: 'superadmin.dashboard', icon: LayoutDashboard },
            ]
        },
        {
            group: 'Tienda',
            items: [
                { label: 'Tiendas', route: 'tenants.index', icon: Store },
                { label: 'Categorías de negocio', route: 'categories.index', icon: Grid },
                { label: 'Planes', route: 'plans.index', icon: CreditCard },
                { label: 'Suscripciones', route: 'subscriptions.index', icon: Receipt },
                { label: 'Auditoría Pagos', route: 'payments.index', icon: Banknote },
            ]
        },
        {
            group: 'Contenido',
            items: [
                { label: 'Gestión de Archivos', route: 'media.index', icon: FolderOpen },
            ]
        },
        {
            group: 'Usuarios',
            items: [
                { label: 'Lista de usuarios', route: 'users.index', icon: Users },
            ]
        }
    ];

    const { props } = usePage<PageProps & {
        site_settings?: {
            app_name: string;
            logo_url: string | null;
        }
    }>();

    const siteSettings = props.site_settings;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            {/* Logo */}
            <div className="p-4 pl-8 pt-4 h-14 flex items-start border-b border-gray-50 justify-start">
                <Link href={route('superadmin.dashboard')} className="block">
                    {(siteSettings?.logo_url) ? (
                        <img
                            src={siteSettings.logo_url}
                            alt={siteSettings.app_name || 'Logo'}
                            className="h-8 w-auto object-contain max-w-[200px]"
                        />
                    ) : (
                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                            <div className="h-8 w-8 flex items-center justify-center bg-blue-600 p-1.5 rounded-lg">
                                <ShoppingBag className="h-5 w-5 text-white" />
                            </div>
                            <span>
                                {siteSettings?.app_name || 'Linkiu.bio'}
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Scrollable Nav */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                {navGroups.map((group, groupIdx) => (
                    <div key={groupIdx}>
                        {!group.hideLabel && (
                            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                {group.group}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = item.route !== '#' && route().current(item.route);
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.route === '#' ? '#' : route(item.route)}
                                        className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon className={`h-4 w-4 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                        {item.label}
                                        {item.label === 'Tiendas' && newTenantsCount > 0 && (
                                            <span className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-bounce">
                                                {newTenantsCount}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sidebar Footer info */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                        <AvatarImage src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`} className="object-cover" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">Super Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex text-gray-900 font-sans antialiased">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-4 z-50 bg-white shadow-sm border">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 border-r-0">
                    <SidebarContent />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
                {/* Navbar */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="md:hidden w-8"></div> {/* Spacer for mobile button */}
                        <div className="flex items-center text-sm font-medium text-gray-500">
                            <span className="hidden sm:inline">SuperLinkiu</span>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="text-gray-900">{header}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-gray-400 hover:text-gray-600"
                            onClick={() => setIsNotificationSidebarOpen(true)}
                        >
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
                            )}
                        </Button>

                        <NotificationSidebar
                            open={isNotificationSidebarOpen}
                            onOpenChange={setIsNotificationSidebarOpen}
                            notifications={recentNotifications}
                            onNotificationRead={handleNotificationRead}
                            onAllRead={handleAllRead}
                        />

                        {/* Separator */}
                        <div className="h-6 w-px bg-gray-200 mx-1"></div>

                        {/* Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="pl-2 pr-1 gap-2 rounded-full hover:bg-gray-100">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.profile_photo_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="object-cover" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Mi Cuenta</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={route('settings.index')} className="flex items-center w-full">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Configuración</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" asChild>
                                    <Link href={route('logout')} method="post" as="button" className="w-full">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8 overflow-auto">
                    {children}
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-100 bg-white p-6 text-center">
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 rounded-lg p-4 text-xs text-gray-500">
                        <span>&copy; 2026 <strong>Linkiu.bio</strong>. Todos los derechos reservados.</span>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                            <span>v1.0.0 (Beta)</span>
                            <span className="h-3 w-px bg-gray-300"></span>
                            <a href="#" className="hover:text-gray-900">Soporte</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
