import { Button } from '@/Components/ui/button';
import { FieldError } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    onPermissionDenied,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    onPermissionDenied: () => void;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const permissions = auth.permissions || [];
    const isSuperAdminEnv = auth.user?.is_super_admin ||
        (permissions.some(p => p.startsWith('sa.')) && !auth.user?.tenant_id);

    const canUpdate = !isSuperAdminEnv || permissions.includes('*') || permissions.includes('sa.account.update');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!canUpdate) {
            onPermissionDenied();
            return;
        }

        patch(route('profile.update'));
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>
                    Actualiza la información de perfil y correo electrónico de tu cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>

                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                            autoComplete="name"
                        />

                        <FieldError>{errors.name}</FieldError>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo Electrónico</Label>

                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />

                        <FieldError>{errors.email}</FieldError>
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Tu dirección de correo electrónico no está verificada.
                                <Link
                                    href={route('verification.send')}
                                    method="post"
                                    as="button"
                                    className="rounded-md text-sm text-primary underline hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    Haz clic aquí para reenviar el correo de verificación.
                                </Link>
                            </p>

                            {status === 'verification-link-sent' && (
                                <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                    Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Guardar</Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-muted-foreground">
                                Guardado.
                            </p>
                        </Transition>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
