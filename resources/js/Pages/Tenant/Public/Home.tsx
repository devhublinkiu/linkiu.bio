import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Home({ tenant }: PageProps<{ tenant: any }>) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <Head title={tenant.name} />
            <h1 className="text-6xl font-black tracking-tighter text-indigo-600">{tenant.name}</h1>
            <p className="mt-4 text-xl text-gray-600">Vertical: Dropshipping (Coming Soon)</p>
            <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border">
                <p>Bienvenido a la tienda de {tenant.name}.</p>
                <code className="block mt-4 bg-gray-100 p-2 rounded text-sm">Tenant ID: {tenant.slug}</code>
            </div>
        </div>
    );
}
