import AdminLayout from '@/Layouts/Tenant/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import {
    ChevronLeft,
    Send,
    LifeBuoy,
    HelpCircle,
    Info
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

interface Props {
    currentTenant: any;
}

export default function Create({ currentTenant }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.support.store', { tenant: currentTenant.slug }));
    };

    return (
        <AdminLayout
            title="Nuevo Ticket"
            breadcrumbs={[
                { label: 'Soporte y Ayuda', href: route('tenant.support.index', { tenant: currentTenant.slug }) },
                { label: 'Nuevo Ticket' }
            ]}
        >
            <Head title="Nuevo Ticket de Soporte" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="cursor-pointer">
                        <Link href={route('tenant.support.index', { tenant: currentTenant.slug })}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">¿En qué podemos ayudarte?</h1>
                        <p className="text-muted-foreground">Describe tu problema o solicitud y nuestro equipo te contactará lo antes posible.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm">
                            <form onSubmit={handleSubmit}>
                                <CardHeader>
                                    <CardTitle>Datos del ticket</CardTitle>
                                    <CardDescription>
                                        Por favor sé lo más detallado posible para brindarte una solución rápida.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Asunto</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                            placeholder="Ej: Problema con la carga de sliders"
                                            className={errors.subject ? 'border-red-500' : ''}
                                        />
                                        {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Categoría</Label>
                                            <Select
                                                value={data.category}
                                                onValueChange={val => setData('category', val)}
                                            >
                                                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Selecciona..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="technical">Problema Técnico</SelectItem>
                                                    <SelectItem value="billing">Facturación</SelectItem>
                                                    <SelectItem value="account">Mi Cuenta</SelectItem>
                                                    <SelectItem value="feature_request">Solicitud de Funcionalidad</SelectItem>
                                                    <SelectItem value="other">Otros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="priority">Prioridad</Label>
                                            <Select
                                                value={data.priority}
                                                onValueChange={val => setData('priority', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Media" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Baja</SelectItem>
                                                    <SelectItem value="medium">Media</SelectItem>
                                                    <SelectItem value="high">Alta</SelectItem>
                                                    <SelectItem value="urgent">Urgente</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensaje detallado</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            placeholder="Cuéntanos paso a paso qué está ocurriendo..."
                                            rows={6}
                                            className={errors.message ? 'border-red-500' : ''}
                                        />
                                        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-end bg-slate-50/50 rounded-b-xl border-t p-4">
                                    <Button type="submit" disabled={processing} className="gap-2 cursor-pointer">
                                        {processing ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar Ticket</>}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-blue-600 text-white border-none overflow-hidden">
                            <CardHeader>
                                <LifeBuoy className="h-8 w-8 mb-2 opacity-80" />
                                <CardTitle className="text-white">Centro de Ayuda</CardTitle>
                                <CardDescription className="text-blue-100">
                                    ¿Ya revisaste nuestra documentación?
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-blue-50/80 mb-4">
                                    Muchos problemas comunes tienen solución inmediata en nuestra base de conocimientos.
                                </p>
                                <Button variant="secondary" className="w-full text-blue-700 font-semibold cursor-pointer" asChild>
                                    <a href="#" target="_blank">Explorar documentación</a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Importante</AlertTitle>
                            <AlertDescription className="text-xs">
                                Te responderemos en un plazo máximo de 24 horas hábiles. Recibirás una notificación por correo electrónico.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
