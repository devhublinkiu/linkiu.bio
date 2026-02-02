import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'; // Assuming Tabs component exists or using standard
import { User, Building2, CreditCard, Calendar, ArrowLeft, Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
    tenant: any; // Using any for speed, but ideally strictly typed matches Tenant model with relations
}

export default function Show({ tenant }: Props) {
    const owner = tenant.users?.find((u: any) => u.pivot?.role === 'owner');
    // We don't have subscriptions loaded yet in controller 'show' method fully, but let's assume we fix that or it's empty
    const subscription = null; // Placeholder until we load it

    return (
        <SuperAdminLayout header={`Detalle de Tienda: ${tenant.name}`}>
            <Head title={tenant.name} />

            <div className="space-y-6">
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:pl-2 transition-all">
                    <Link href={route('tenants.index')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al listado
                    </Link>
                </Button>

                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
                            <a
                                href={`https://linkiu.bio/${tenant.slug}`}
                                target="_blank"
                                className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-mono"
                            >
                                linkiu.bio/{tenant.slug} <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                            {tenant.category?.vertical?.name} / {tenant.category?.name}
                        </Badge>
                        <Badge className="bg-green-600">Activo</Badge>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Business Info */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-gray-500" />
                                    Información Fiscal y de Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Identificación</span>
                                    <div className="flex items-center gap-2 font-mono">
                                        <Badge variant="secondary">{tenant.doc_type}</Badge>
                                        <span>{tenant.doc_number}</span>
                                        {tenant.verification_digit && <span>- {tenant.verification_digit}</span>}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1 capitalize">Régimen {tenant.regime}</div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Ubicación Fiscal</span>
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <div>
                                            <p>{tenant.address}</p>
                                            <p>{tenant.city}, {tenant.state}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Contacto Comercial</span>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <a href={`mailto:${tenant.contact_email}`} className="hover:underline">{tenant.contact_email}</a>
                                        </div>
                                        {tenant.contact_phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span>{tenant.contact_phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-gray-500" />
                                    Información de Suscripción
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <p>Suscripción activa gestionada en el módulo de facturación.</p>
                                    <Button variant="link" asChild>
                                        <Link href={route('subscriptions.index', { search: tenant.id })}>
                                            Ver Historial de Pagos
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Owner Info */}
                    <div className="space-y-6">
                        <Card className="bg-blue-50/50 border-blue-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <ShieldCheck className="h-5 w-5" />
                                    Propietario (Admin)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {owner ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-xl">
                                                {owner.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold">{owner.name}</div>
                                                <div className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full inline-block">
                                                    Super Admin: {owner.is_super_admin ? 'Sí' : 'No'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-blue-100">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-blue-400" />
                                                <span className="truncate" title={owner.email}>{owner.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Badge variant="outline" className="border-blue-200 bg-white">
                                                    {owner.doc_type} {owner.doc_number}
                                                </Badge>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                                                <div>
                                                    <p>{owner.address}</p>
                                                    <p>{owner.city}, {owner.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-red-500">No se encontró propietario asignado.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
