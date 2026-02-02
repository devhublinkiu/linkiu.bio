import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <SuperAdminLayout header="Panel General">
            <Head title="Super Admin" />
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <h1 className="text-2xl font-bold mb-4">Bienvenido, Super Admin</h1>
                    <p>Desde aquí puedes gestionar toda la plataforma Linkiu.bio.</p>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
