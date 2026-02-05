import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { PageProps } from '@/types';
import AdminSidebar from '@/Components/Tenant/Admin/AdminSidebar';
import AdminNavbar from '@/Components/Tenant/Admin/AdminNavbar';
import AdminFooter from '@/Components/Tenant/Admin/AdminFooter';
import { SidebarProvider, SidebarInset } from '@/Components/ui/sidebar';

interface Props {
    children: React.ReactNode;
    title?: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function AdminLayout({ children, title, breadcrumbs }: Props) {
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

    return (
        <SidebarProvider>
            <AdminSidebar />

            <SidebarInset>
                {/* Navbar */}
                <AdminNavbar
                    title={title}
                    breadcrumbs={breadcrumbs}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
                    {/* Page Content */}
                    <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    <AdminFooter />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
