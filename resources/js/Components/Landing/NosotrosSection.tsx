import { Link } from '@inertiajs/react';
import { DotPattern } from '@/Components/ui/dot-pattern';
import { Link2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NosotrosSection() {
    return (
        <section id="nosotros" className="relative z-10 overflow-hidden py-16 sm:py-24">
            <DotPattern
                className={cn(
                    'absolute inset-0 text-slate-400/40 dark:text-slate-600/30',
                    '[mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,white,transparent)]'
                )}
            />
            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
                    {/* Columna izquierda: tarjetas. Móvil: una debajo de otra. Desktop: superpuestas */}
                    <div className="relative flex flex-col items-center justify-center min-h-0 lg:min-h-[380px]">
                        {/* Móvil: columna con gap. Desktop: posiciones absolutas */}
                        {/* Tarjeta principal */}
                        <div className="relative w-full max-w-[280px] rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-slate-900/50 lg:max-w-[280px]">
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tu negocio</h3>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">Un solo enlace</span>
                            </div>
                            <div className="mt-4 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/80 px-3 py-2 dark:border-violet-800 dark:bg-violet-900/20">
                                <Link2 className="h-8 w-8 shrink-0 text-violet-600 dark:text-violet-400" />
                                <div>
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Todo integrado</p>
                                    <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Catálogo, pedidos, reservas</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between text-sm">
                                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    Sin salir del link
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                                    Un enlace
                                </span>
                            </div>
                        </div>

                        {/* Tarjeta secundaria (Verticales). Móvil: debajo con margen. Desktop: absoluta */}
                        <div className="mt-6 w-full max-w-[260px] rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:w-[260px]">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>Verticales</span>
                                <span>Linkiu</span>
                            </div>
                            <div className="mt-3 flex gap-2">
                                {['Gastronomía', 'Ecommerce', 'Servicios'].map((v, i) => (
                                    <div
                                        key={v}
                                        className="flex-1 rounded-lg bg-slate-100 py-2 text-center text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                        style={{ height: 24 + i * 8 }}
                                    />
                                ))}
                            </div>
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Adaptado a tu sector</p>
                        </div>

                        {/* Mini tarjeta. Móvil: debajo con margen. Desktop: absoluta */}
                        <div className="mt-6 flex max-w-[160px] rounded-xl border border-emerald-200 bg-white px-3 py-2 dark:border-emerald-800 dark:bg-slate-800/80 lg:absolute lg:bottom-8 lg:left-0 lg:mt-0 lg:max-w-none">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Todo en un lugar</span>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: texto + CTA */}
                    <div className="flex flex-col justify-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-primary">
                            Nosotros
                        </p>
                        <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                            Conectamos tu negocio con tus clientes en un solo lugar
                        </h2>
                        <p className="mt-6 max-w-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                            Linkiu nace para que cualquier negocio —restaurante, tienda, servicios— tenga su
                            enlace único: catálogo, pedidos, reservas y contacto. Sin complicaciones técnicas,
                            adaptable a lo que ofreces y pensado para que compartas un solo link en redes,
                            WhatsApp o donde estén tus clientes.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href={route('register.tenant')}
                                className={cn(
                                    'inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                                )}
                            >
                                Regístrate gratis
                            </Link>
                            <Link
                                href="/#funciones"
                                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                Ver funciones
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
