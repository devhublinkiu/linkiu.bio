import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';

export default function Dashboard() {
    return (
        <SuperAdminLayout header="Panel General">
            <Head title="Super Admin" />
            <Card>
                <CardHeader>
                    <CardTitle>Bienvenido, Super Admin</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Desde aquí puedes gestionar toda la plataforma Linkiu.bio.</p>
                </CardContent>
            </Card>
        </SuperAdminLayout>
    );
}
