import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/Components/ui/sheet";
import { Button } from "@/Components/ui/button";
import { Bell, CheckCircle2, ShoppingBag, CreditCard, ChevronRight, Check, Trash2, X } from "lucide-react";
import { router } from '@inertiajs/react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Notification {
    id: string;
    data: {
        message: string;
        type: string;
        url?: string;
        [key: string]: any;
    };
    created_at: string;
    read_at: string | null;
}

interface NotificationSidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    notifications: Notification[];
    onNotificationRead?: (id: string) => void;
    onAllRead?: () => void;
}

export default function NotificationSidebar({
    open,
    onOpenChange,
    notifications,
    onNotificationRead,
    onAllRead
}: NotificationSidebarProps) {
    const unreadCount = notifications.filter(n => !n.read_at).length;
    const hasReadNotifications = notifications.some(n => !!n.read_at);

    // Initial state matching props to allow local optimistic updates
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

    useEffect(() => {
        setLocalNotifications(notifications);
    }, [notifications]);

    const markAsRead = async (id: string) => {
        // Skip API call for temporary IDs
        if (id.includes('.') || !isNaN(parseFloat(id)) && isFinite(parseFloat(id)) && parseFloat(id) < 1) {
            if (onNotificationRead) onNotificationRead(id);
            return;
        }

        try {
            await axios.post(route('notifications.markRead', id));
            // Update local state immediately
            setLocalNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            if (onNotificationRead) onNotificationRead(id);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(route('notifications.markAllRead'));
            setLocalNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            if (onAllRead) onAllRead();
            toast.success('Todas las notificaciones marcadas como leídas');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        // Optimistic update
        setLocalNotifications(prev => prev.filter(n => n.id !== id));

        try {
            await axios.delete(route('notifications.destroy', id));
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Error al eliminar la notificación');
            // Revert changes if error (could fetch from server again, but keeping simple for now)
        }
    };

    const clearAllRead = async () => {
        // Optimistic update
        setLocalNotifications(prev => prev.filter(n => !n.read_at));

        try {
            await axios.delete(route('notifications.destroyAllRead'));
            toast.success('Notificaciones leídas eliminadas');
        } catch (error) {
            console.error('Error clearing read notifications:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read_at) {
            markAsRead(notification.id);
        }

        if (notification.data.url) {
            onOpenChange(false);
            router.visit(notification.data.url);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'tenant_created':
                return <ShoppingBag className="h-4 w-4 text-blue-500" />;
            case 'invoice_generated':
                return <CreditCard className="h-4 w-4 text-amber-500" />;
            case 'payment_reported':
                return <CreditCard className="h-4 w-4 text-green-500" />;
            case 'payment_status_updated':
                return <CreditCard className="h-4 w-4 text-primary" />;
            default:
                return <Bell className="h-4 w-4 text-slate-400" />;
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col border-l border-slate-200">
                <SheetHeader className="p-6 border-b border-slate-100 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Bell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <SheetTitle className="text-lg font-bold text-slate-900">Notificaciones</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Centro de notificaciones y avisos del sistema
                                </SheetDescription>
                                <p className="text-xs text-slate-500 font-medium">
                                    {unreadCount > 0
                                        ? `Tienes ${unreadCount} ${unreadCount === 1 ? 'nueva notificacion' : 'notificaciones nuevas'}`
                                        : 'Estás al día'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-primary hover:text-primary hover:bg-primary/5 font-bold text-xs gap-2 px-2 h-8"
                                    title="Marcar todo como leído"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Leer todo</span>
                                </Button>
                            )}
                            {hasReadNotifications && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllRead}
                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 font-bold text-xs gap-2 px-2 h-8"
                                    title="Eliminar leídas"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-1">
                    <div className="divide-y divide-slate-50">
                        {localNotifications.length > 0 ? (
                            localNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={cn(
                                        "p-5 transition-all cursor-pointer group hover:bg-slate-50 flex gap-4 items-start relative select-none",
                                        !notification.read_at && "bg-blue-50/30"
                                    )}
                                >
                                    {!notification.read_at && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                    )}

                                    <div className={cn(
                                        "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm border",
                                        !notification.read_at
                                            ? "bg-white border-blue-100"
                                            : "bg-slate-50 border-slate-100"
                                    )}>
                                        {getIcon(notification.data.type)}
                                    </div>

                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={cn(
                                                "text-sm leading-tight pr-6",
                                                !notification.read_at ? "font-bold text-slate-900" : "font-medium text-slate-600"
                                            )}>
                                                {notification.data.message}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                                                {new Date(notification.created_at).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {notification.data.url && (
                                                <>
                                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all uppercase tracking-wider">
                                                        Ver detalle <ChevronRight className="h-2.5 w-2.5" />
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons Container */}
                                    <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read_at ? (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-lg hover:bg-white hover:text-green-600 hover:shadow-sm"
                                                title="Marcar como leído"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                }}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600"
                                                title="Eliminar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="h-8 w-8 text-slate-200" />
                                </div>
                                <h3 className="text-slate-900 font-bold mb-1">Sin notificaciones</h3>
                                <p className="text-slate-500 text-sm">No tienes nada nuevo por aquí.</p>
                            </div>
                        )}
                    </div>
                </div>

                {localNotifications.length > 0 && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
                            Mostrando últimas {localNotifications.length} notificaciones
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
