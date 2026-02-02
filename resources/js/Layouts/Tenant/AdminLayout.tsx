import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { PageProps } from '@/types';
import AdminSidebar from '@/Components/Tenant/Admin/AdminSidebar';
import AdminNavbar from '@/Components/Tenant/Admin/AdminNavbar';
import AdminFooter from '@/Components/Tenant/Admin/AdminFooter';
import { Sheet, SheetContent } from '@/Components/ui/sheet';

interface Props {
    children: React.ReactNode;
    title?: React.ReactNode;
}

export default function AdminLayout({ children, title }: Props) {
    const { auth, flash, currentTenant } = usePage<PageProps & {
        auth: { notifications?: { unread_count: number, recent: any[] } },
        flash: { success?: string, error?: string, warning?: string },
        currentTenant: any
    }>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


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
        <div className="min-h-screen bg-slate-50/50 flex text-slate-900 font-sans antialiased">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 fixed inset-y-0 left-0 z-50">
                <AdminSidebar />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-72 border-r-0">
                    <AdminSidebar />
                </SheetContent>
            </Sheet>

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                {/* Navbar */}
                <AdminNavbar
                    title={title}
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <AdminFooter />
            </div>
        </div>
    );
}
