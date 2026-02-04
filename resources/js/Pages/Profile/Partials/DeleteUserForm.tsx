import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { FieldError } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

export default function DeleteUserForm({
    className = '',
    onPermissionDenied,
}: {
    className?: string;
    onPermissionDenied: () => void;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { auth } = usePage<PageProps>().props;
    const permissions = auth.permissions || [];
    const isSuperAdminEnv = auth.user?.is_super_admin ||
        (permissions.some(p => p.startsWith('sa.')) && !auth.user?.tenant_id);

    const canDelete = !isSuperAdminEnv || permissions.includes('*') || permissions.includes('sa.account.delete');

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        if (!canDelete) {
            onPermissionDenied();
            return;
        }
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Eliminar Cuenta</CardTitle>
                <CardDescription>
                    Una vez que se elimine tu cuenta, todos sus recursos y datos se eliminarán permanentemente. Antes de eliminar tu cuenta, descarga cualquier dato o información que desees conservar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="destructive" onClick={confirmUserDeletion}>
                    Eliminar Cuenta
                </Button>

                <Dialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                    <DialogContent>
                        <form onSubmit={deleteUser}>
                            <DialogHeader>
                                <DialogTitle>¿Seguro de que deseas eliminar tu cuenta?</DialogTitle>
                                <DialogDescription>
                                    Una vez que se elimine tu cuenta, todos sus recursos y
                                    datos se eliminarán permanentemente. Por favor, ingresa tu
                                    contraseña para confirmar que deseas eliminar permanentemente
                                    tu cuenta.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-6">
                                <Label htmlFor="password" title="Contraseña" className="sr-only">
                                    Contraseña
                                </Label>

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="mt-1 block w-3/4"
                                    autoFocus
                                    placeholder="Contraseña"
                                />

                                <FieldError>{errors.password}</FieldError>
                            </div>

                            <DialogFooter>
                                <Button variant="secondary" onClick={closeModal} type="button">
                                    Cancelar
                                </Button>

                                <Button variant="destructive" className="ms-3" disabled={processing} type="submit">
                                    Eliminar Cuenta
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
