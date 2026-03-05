import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Settings, ChevronLeft, RefreshCw, Loader2 } from 'lucide-react';

interface YoutubeConfig {
    youtube_channel_id: string | null;
    last_synced_at: string | null;
}

interface Props {
    youtube_config: YoutubeConfig;
}

export default function Config({ youtube_config }: Props) {
    const { currentTenant } = usePage<PageProps>().props;
    const [syncing, setSyncing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        youtube_channel_id: youtube_config.youtube_channel_id ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('tenant.admin.sermons.update-config', currentTenant?.slug), {
            preserveScroll: true,
            onSuccess: () => toast.success('Canal guardado correctamente'),
            onError: () => toast.error('Revisa el ID del canal'),
        });
    };

    const handleSync = () => {
        setSyncing(true);
        router.post(route('tenant.admin.sermons.sync', currentTenant?.slug), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Sincronización completada'),
            onError: (errors) => {
                const msg = (errors as Record<string, string>)?.sync ?? 'Error al sincronizar. Revisa el canal y YOUTUBE_API_KEY en .env';
                toast.error(msg);
            },
            onFinish: () => setSyncing(false),
        });
    };

    return (
        <AdminLayout title="Configurar Predicas">
            <Head title="Configurar Predicas - Canal de YouTube" />

            <div className="max-w-xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route('tenant.admin.sermons.index', currentTenant?.slug)}
                        className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                        <ChevronLeft className="size-4" />
                        Volver a Predicas
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 mt-2">
                        <Settings className="size-6 text-primary" />
                        Configurar Predicas
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Vincula tu canal de YouTube para sincronizar vídeos y transmisiones en vivo.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6 rounded-xl border bg-card p-6">
                    <div className="space-y-2">
                        <Label htmlFor="youtube_channel_id">ID del canal de YouTube</Label>
                        <Input
                            id="youtube_channel_id"
                            value={data.youtube_channel_id}
                            onChange={(e) => setData('youtube_channel_id', e.target.value)}
                            placeholder="Ej: UCxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            className={errors.youtube_channel_id ? 'border-destructive' : ''}
                        />
                        {errors.youtube_channel_id && (
                            <p className="text-destructive text-xs">{errors.youtube_channel_id}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Encuentra el ID en la URL de tu canal (youtube.com/channel/<strong>UCxxxx</strong>) o en la
                            configuración del canal en YouTube Studio.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing} className="gap-2">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Guardar canal
                        </Button>
                        <Link href={route('tenant.admin.sermons.index', currentTenant?.slug)}>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                    </div>
                </form>

                {youtube_config.last_synced_at && (
                    <p className="text-xs text-muted-foreground mt-4">
                        Última sincronización: {new Date(youtube_config.last_synced_at).toLocaleString('es')}
                    </p>
                )}

                {data.youtube_channel_id && (
                    <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <h2 className="font-semibold text-slate-900 mb-2">Sincronizar ahora</h2>
                        <p className="text-sm text-muted-foreground mb-3">
                            Importa los vídeos y transmisiones del canal a Predicas.
                        </p>
                        <Button
                            variant="outline"
                            className="gap-2"
                            disabled={syncing}
                            onClick={handleSync}
                        >
                            {syncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                            Sincronizar con YouTube
                        </Button>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
