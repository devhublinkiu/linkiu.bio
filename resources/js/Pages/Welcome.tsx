import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Spline from '@splinetool/react-spline';
import { DotPattern } from '@/Components/ui/dot-pattern';
import { FeaturesSection } from '@/Components/Landing/FeaturesSection';
import { HowItWorksSection } from '@/Components/Landing/HowItWorksSection';
import { cn } from '@/lib/utils';

/** Escena Spline local (sin logo, desde public) */
const SPLINE_SCENE_URL = '/scene-clean.splinecode';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Linkiu - Tu negocio en un solo enlace" />
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <div className="relative flex min-h-screen flex-col">
                    <div className="relative w-full max-w-6xl px-6 lg:max-w-7xl mx-auto">
                        <header className="flex flex-wrap items-center justify-between gap-4 py-6 lg:py-8">
                            <Link
                                href="/"
                                className="text-xl font-bold text-black dark:text-white"
                            >
                                Linkiu
                            </Link>
                            <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
                                <Link href="/#inicio" className="rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white">
                                    Inicio
                                </Link>
                                <Link href="/#funciones" className="rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white">
                                    Funciones
                                </Link>
                                <Link href="/#nosotros" className="rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white">
                                    Nosotros
                                </Link>
                                <Link href="/#tutoriales" className="rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white">
                                    Tutoriales
                                </Link>
                                <Link href="/#blogs" className="rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white">
                                    Blogs
                                </Link>
                                <Link href="/#release-notes" className="rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white">
                                    Release Notes
                                </Link>
                                <Link href="/#contacto" className="rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white">
                                    Contacto
                                </Link>
                                <Link
                                    href={route('register.tenant')}
                                    className="ml-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90"
                                >
                                    Regístrate gratis
                                </Link>
                            </nav>
                        </header>

                        {/* Hero */}
                        <section id="inicio" className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-16 sm:py-24 text-center">
                            <DotPattern
                                className={cn(
                                    "text-slate-400 dark:text-slate-700",
                                    "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
                                )}
                            />
                            <div className="relative z-10">
                            <h1 className="text-6xl justify-start text-left md:text-center font-bold tracking-tight text-slate-900 dark:text-white md:text-7xl max-w-4xl mx-auto">
                                Tu negocio, un solo enlace
                            </h1>
                            <p className="mt-6 text-lg justify-start text-left md:text-center sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                                La herramienta digital que concentra tu negocio en un solo enlace: catálogo, pedidos, reservas, contacto y más. Adaptada a tu tipo de negocio.
                            </p>
                            <div className="relative w-full max-w-6xl mx-auto h-[550px] overflow-hidden rounded-lg -mt-10">
                                <Spline scene={SPLINE_SCENE_URL} className="size-full" style={{ width: '100%', height: '100%' }} />
                            </div>
                            </div>
                        </section>

                        <FeaturesSection />

                        <HowItWorksSection />

                        <footer className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} Linkiu
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
