import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Menu, ArrowLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { href: '/#inicio', label: 'Inicio' },
    { href: '/#funciones', label: 'Funciones' },
    { href: '/#nosotros', label: 'Nosotros' },
    { href: '/#tutoriales', label: 'Tutoriales' },
    { href: '/#blogs', label: 'Blogs' },
    { href: '/release-notes', label: 'Release Notes', isCurrentPage: true },
    { href: '/#contacto', label: 'Contacto' },
] as const;

const linkClass =
    'rounded-md px-3 py-2 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100';
const currentClass = 'rounded-md px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100';
const btnClass =
    'rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100';

type ReleaseType = 'new' | 'fix' | 'improvement' | 'security' | 'performance';

const TYPE_BADGES: Record<ReleaseType, { label: string; className: string }> = {
    new: { label: 'Nuevo', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    fix: { label: 'Corrección', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    improvement: { label: 'Mejora', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
    security: { label: 'Seguridad', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
    performance: { label: 'Rendimiento', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
};

interface Release {
    id: string;
    slug: string;
    title: string;
    type: ReleaseType;
    date: string;
    category_name: string;
    snippet: string;
    body: string;
    cover_url: string | null;
    hero_url: string | null;
}

interface Props {
    release: Release;
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Show({ release }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const imageUrl = release.hero_url ?? release.cover_url;
    const badge = TYPE_BADGES[release.type] ?? TYPE_BADGES.improvement;

    return (
        <>
            <Head title={`${release.title} - Novedades Linkiu`} />
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <div className="relative flex min-h-screen flex-col">
                    <div className="relative w-full max-w-6xl px-4 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
                        <header className="flex items-center justify-between gap-4 py-6 lg:py-8">
                            <Link href="/" className="shrink-0" aria-label="Linkiu inicio">
                                <img
                                    src="/logo_nav_web_linkiu.svg"
                                    alt="Linkiu"
                                    className="h-8 w-auto dark:invert"
                                />
                            </Link>
                            <nav className="hidden md:flex flex-wrap items-center gap-1 lg:gap-2">
                                {NAV_LINKS.map((item) =>
                                    'isCurrentPage' in item && item.isCurrentPage ? (
                                        <span key={item.href} className={currentClass} aria-current="page">
                                            {item.label}
                                        </span>
                                    ) : (
                                        <Link key={item.href} href={item.href} className={linkClass}>
                                            {item.label}
                                        </Link>
                                    )
                                )}
                                <Link href={route('register.tenant')} className={cn(btnClass, 'ml-2')}>
                                    Regístrate gratis
                                </Link>
                            </nav>
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
                                        {NAV_LINKS.map((item) =>
                                            'isCurrentPage' in item && item.isCurrentPage ? (
                                                <span key={item.href} className={cn(linkClass, 'font-medium')} aria-current="page">
                                                    {item.label}
                                                </span>
                                            ) : (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={linkClass}
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    {item.label}
                                                </Link>
                                            )
                                        )}
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </header>

                        <main className="pb-16 mt-16">
                            <Link
                                href="/release-notes"
                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mb-16"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Volver a novedades
                            </Link>

                            <article className="max-w-5xl mx-auto">

                                <div className="flex flex-wrap items-center gap-2">
                                    {release.category_name && (
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {release.category_name}
                                        </span>
                                    )}
                                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', badge.className)}>
                                        {badge.label}
                                    </span>
                                </div>
                                <time
                                    className="mt-2 block text-sm text-slate-500 dark:text-slate-400"
                                    dateTime={release.date}
                                >
                                    {formatDate(release.date)}
                                </time>
                                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                                    {release.title}
                                </h1>
                                {release.snippet && (
                                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 text-justify">
                                        {release.snippet}
                                    </p>
                                )}

                                {release.body && (
                                    <div
                                        className="mt-8 text-justify prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-slate-900 dark:prose-a:text-slate-100 prose-img:rounded-lg"
                                        dangerouslySetInnerHTML={{ __html: release.body }}
                                    />
                                )}

                                <p className="mt-10 text-xs font-medium text-slate-500 dark:text-slate-500">
                                    Linkiu
                                </p>
                            </article>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
