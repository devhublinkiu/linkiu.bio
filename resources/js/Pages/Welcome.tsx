import { useState } from 'react';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import Spline from '@splinetool/react-spline';
import { Menu } from 'lucide-react';
import { DotPattern } from '@/Components/ui/dot-pattern';
import { FeaturesSection } from '@/Components/Landing/FeaturesSection';
import { HowItWorksSection } from '@/Components/Landing/HowItWorksSection';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { href: '/#inicio', label: 'Inicio' },
    { href: '/#funciones', label: 'Funciones' },
    { href: '/#nosotros', label: 'Nosotros' },
    { href: '/#tutoriales', label: 'Tutoriales' },
    { href: '/#blogs', label: 'Blogs' },
    { href: '/#release-notes', label: 'Release Notes' },
    { href: '/#contacto', label: 'Contacto' },
] as const;

const linkClass = "rounded-md px-3 py-2 text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white";
const btnClass = "rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90";

/** Escena Spline local (sin logo, desde public) */
const SPLINE_SCENE_URL = '/scene-clean.splinecode';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <>
            <Head title="Linkiu - Tu negocio en un solo enlace" />
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <div className="relative flex min-h-screen flex-col">
                    <div className="relative w-full max-w-6xl px-6 lg:max-w-7xl mx-auto">
                        <header className="flex items-center justify-between gap-4 py-6 lg:py-8">
                            <Link href="/" className="shrink-0" aria-label="Linkiu inicio">
                                <img src="/logo_nav_web_linkiu.svg" alt="Linkiu" className="h-8 w-auto dark:invert" />
                            </Link>

                            {/* Desktop: nav + botón */}
                            <nav className="hidden md:flex flex-wrap items-center gap-1 lg:gap-2">
                                {NAV_LINKS.map(({ href, label }) => (
                                    <Link key={href} href={href} className={linkClass}>{label}</Link>
                                ))}
                                <Link href={route('register.tenant')} className={cn(btnClass, 'ml-2')}>
                                    Regístrate gratis
                                </Link>
                            </nav>

                            {/* Móvil: botón + hamburguesa */}
                            <div className="flex md:hidden items-center gap-2">
                                <Link href={route('register.tenant')} className={btnClass}>
                                    Regístrate gratis
                                </Link>
                                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="shrink-0" aria-label="Abrir menú">
                                            <Menu className="size-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full max-w-xs flex flex-col gap-2 pt-10">
                                        {NAV_LINKS.map(({ href, label }) => (
                                            <Link key={href} href={href} className={linkClass} onClick={() => setMenuOpen(false)}>
                                                {label}
                                            </Link>
                                        ))}
                                    </SheetContent>
                                </Sheet>
                            </div>
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
                            <div className="relative w-full max-w-4xl mx-auto h-[480px] overflow-hidden rounded-lg -mt-32">
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
