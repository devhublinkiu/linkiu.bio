import { Button } from '@/Components/ui/button';
import { FieldError } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

export default function UpdatePasswordForm({
    className = '',
    onPermissionDenied,
}: {
    className?: string;
    onPermissionDenied: () => void;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { auth } = usePage<PageProps>().props;
    const permissions = auth.permissions || [];
    const isSuperAdminEnv = auth.user?.is_super_admin ||
        (permissions.some(p => p.startsWith('sa.')) && !auth.user?.tenant_id);

    const canUpdate = !isSuperAdminEnv || permissions.includes('*') || permissions.includes('sa.account.password.update');

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        if (!canUpdate) {
            onPermissionDenied();
            return;
        }

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Actualizar Contraseña</CardTitle>
                <CardDescription>
                    Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantenerse segura.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={updatePassword} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="current_password">Contraseña Actual</Label>

                        <Input
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            type="password"
                            autoComplete="current-password"
                        />

                        <FieldError>{errors.current_password}</FieldError>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Nueva Contraseña</Label>

                        <Input
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            autoComplete="new-password"
                        />

                        <FieldError>{errors.password}</FieldError>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>

                        <Input
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            type="password"
                            autoComplete="new-password"
                        />

                        <FieldError>{errors.password_confirmation}</FieldError>
                    </div>

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
