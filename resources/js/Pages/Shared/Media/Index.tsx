import { usePage, Head } from '@inertiajs/react';
import { MediaManager } from "@/Components/Shared/MediaManager/MediaManagerModal";
import SuperAdminLayout from "@/Layouts/SuperAdminLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Keep as fallback? Or maybe AdminLayout IS the authenticated layout for admins?
import AdminLayout from "@/Layouts/Tenant/AdminLayout";

export default function MediaIndex({ auth, api_route }: { auth: any, api_route?: string }) {
    const { currentTenant } = usePage<any>().props;
    const isTenant = !!currentTenant;

    // AuthenticatedLayout seems to be for customers? AdminLayout for tenant admins.
    const Layout = isTenant ? AdminLayout : SuperAdminLayout as any;

    return (
        <Layout header="Mis Archivos" title="Mis Archivos">
            <Head title="Mis Archivos" />
            <div className="py-8 max-w-[1600px] mx-auto sm:px-6 lg:px-8 h-[calc(100vh-65px)] flex flex-col">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex-1 border border-slate-200">
                    <MediaManager apiRoute={api_route} className="h-full border-0" />
                </div>
            </div>
        </Layout>
    );
}
