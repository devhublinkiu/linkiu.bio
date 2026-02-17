import { usePage, Head } from '@inertiajs/react';
import { MediaManager } from '@/Components/Shared/MediaManager/MediaManagerModal';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { PageProps } from '@/types';

interface MediaIndexProps {
    api_route?: string;
}

export default function MediaIndex({ api_route }: MediaIndexProps) {
    usePage<PageProps>().props;

    return (
        <AdminLayout title="Mis Archivos">
            <Head title="Mis Archivos" />
            <div className="py-8 max-w-[1600px] mx-auto sm:px-6 lg:px-8 h-[calc(100vh-65px)] flex flex-col">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex-1 border border-slate-200">
                    <MediaManager apiRoute={api_route} className="h-full border-0" />
                </div>
            </div>
        </AdminLayout>
    );
}
