import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { PageProps } from '@/types';
import AdminSidebar from '@/Components/Tenant/Admin/AdminSidebar';
import AdminNavbar from '@/Components/Tenant/Admin/AdminNavbar';
import AdminFooter from '@/Components/Tenant/Admin/AdminFooter';
import { SidebarProvider, SidebarInset } from '@/Components/ui/sidebar';
import { Toaster } from '@/Components/ui/sonner';
import { cn } from '@/lib/utils';

interface Props {
    children: React.ReactNode;
    title?: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    maxwidth?: string;
    hideSidebar?: boolean;
    hideFooter?: boolean;
    hideNavbar?: boolean;
}

export default function AdminLayout({
    children,
    title,
    breadcrumbs,
    maxwidth = 'max-w-7xl',
    hideSidebar = false,
    hideFooter = false,
    hideNavbar = false
}: Props) {
    const { auth, flash, currentTenant } = usePage<PageProps & {
        auth: { notifications?: { unread_count: number, recent: any[] } },
        flash: { success?: string, error?: string, warning?: string },
        currentTenant: any
    }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast.warning(flash.warning, { duration: 8000 });
        }
    }, [flash]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Echo && currentTenant?.id) {
            window.Echo.channel(`tenant.${currentTenant.id}.reservations`)
                .listen('.reservation.created', (e: any) => {
                    toast.info(e.message, {
                        description: 'Nueva reserva recibida',
                        duration: 10000,
                        action: {
                            label: 'Ver Reservas',
                            onClick: () => router.get(route('tenant.admin.reservations.index', { tenant: currentTenant.slug }))
                        }
                    });
                });
        }

        return () => {
            try {
                if (typeof window !== 'undefined' && window.Echo && currentTenant?.id) {
                    const echo = window.Echo as any;
                    if (echo.connector?.ably?.connection?.state === 'connected') {
                        echo.leave(`tenant.${currentTenant.id}.reservations`);
                    }
                }
            } catch (error) {
                // Silent catch
            }
        };
    }, [currentTenant?.id]);

    return (
        <SidebarProvider>
            {!hideSidebar && <AdminSidebar />}

            <SidebarInset>
                {/* Navbar */}
                {!hideNavbar && (
                    <AdminNavbar
                        title={title}
                        breadcrumbs={breadcrumbs}
                    />
                )}

                {/* Main Content Area */}
                <div className={cn(
                    "flex-1 flex flex-col min-h-screen",
                    !hideSidebar && "bg-slate-50/50"
                )}>
                    {/* Page Content */}
                    <main className={cn(
                        "flex-1 overflow-x-hidden",
                        hideSidebar ? "p-0" : "p-4 sm:p-8"
                    )}>
                        <div className={cn(
                            hideSidebar ? "w-full" : (maxwidth + " mx-auto"),
                            "animate-in fade-in slide-in-from-bottom-4 duration-700"
                        )}>
                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    {!hideFooter && <AdminFooter />}
                </div>
            </SidebarInset>
            <Toaster position="bottom-center" />
        </SidebarProvider>
    );
}
