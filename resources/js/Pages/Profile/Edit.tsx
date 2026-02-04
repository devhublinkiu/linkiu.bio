import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useState } from 'react';
import { PermissionDeniedModal } from '@/Components/Shared/PermissionDeniedModal';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { auth } = usePage<PageProps>().props;

    // Detect SuperAdmin context: 
    // 1. is_super_admin flag is true
    // 2. OR user has global/system permissions (checking both prefixed 'sa.' and raw 'settings.view' etc) AND no tenant_id
    const isSuperAdminEnv = auth.user?.is_super_admin ||
        ((
            auth.permissions?.some(p => p.startsWith('sa.')) ||
            auth.permissions?.some(p => ['settings.view', 'users.view', 'roles.view'].includes(p))
        ) && !auth.user?.tenant_id);

    const Layout = isSuperAdminEnv ? SuperAdminLayout : AuthenticatedLayout;

    const [showPermissionModal, setShowPermissionModal] = useState(false);

    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                    Perfil
                </h2>
            }
        >
            <Head title="Perfil" />

            <PermissionDeniedModal
                open={showPermissionModal}
                onOpenChange={setShowPermissionModal}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                            onPermissionDenied={() => setShowPermissionModal(true)}
                        />

                        <UpdatePasswordForm
                            className="max-w-2xl"
                            onPermissionDenied={() => setShowPermissionModal(true)}
                        />

                        <DeleteUserForm
                            className="max-w-2xl"
                            onPermissionDenied={() => setShowPermissionModal(true)}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
