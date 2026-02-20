import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

/** Mismo orden que el index; en esta vista "Release Notes" es la página actual. */
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

interface Category {
    id: string;
    name: string;
}

type ReleaseType = 'new' | 'fix' | 'improvement' | 'security' | 'performance';

interface Release {
    id: string;
    slug: string;
    category_id: string;
    type: ReleaseType;
    date: string;
    title: string;
    snippet: string;
    cover_url: string | null;
}

const TYPE_BADGES: Record<ReleaseType, { label: string; className: string }> = {
    new: { label: 'Nuevo', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    fix: { label: 'Corrección', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    improvement: { label: 'Mejora', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
    security: { label: 'Seguridad', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
    performance: { label: 'Rendimiento', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300' },
};

interface Props {
    categories: Category[];
    releases: Release[];
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

export default function Index({ categories, releases }: Props) {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [menuOpen, setMenuOpen] = useState(false);

    const filtered =
        activeCategory === 'all'
            ? releases
            : releases.filter((r) => r.category_id === activeCategory);

    return (
        <>
            <Head title="Novedades - Linkiu" />
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
                            {/* Desktop: mismo menú que el index; Release Notes = página actual */}
                            <nav className="hidden md:flex flex-wrap items-center gap-1 lg:gap-2">
                                {NAV_LINKS.map((item) =>
                                    'isCurrentPage' in item && item.isCurrentPage ? (
                                        <span
                                            key={item.href}
                                            className={currentClass}
                                            aria-current="page"
                                        >
                                            {item.label}
                                        </span>
                                    ) : (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={linkClass}
                                        >
                                            {item.label}
                                        </Link>
                                    )
                                )}
                                <Link href={route('register.tenant')} className={cn(btnClass, 'ml-2')}>
                                    Regístrate gratis
                                </Link>
                            </nav>
                            {/* Móvil: hamburguesa con las mismas opciones */}
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

                        <main className="pb-16">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                Novedades
                            </h1>
                            <p className="mt-2 text-slate-600 dark:text-slate-400">
                                Actualizaciones, mejoras y novedades de Linkiu.
                            </p>

                            {/* Categorías */}
                            <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={cn(
                                            'rounded-md px-4 py-2 text-sm font-medium transition',
                                            activeCategory === cat.id
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Grid de cards con cover */}
                            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((release) => (
                                    <Link
                                        key={release.id}
                                        href={`/release-notes/${release.slug}`}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 transition hover:shadow-md"
                                    >
                                        {/* Cover: imagen o placeholder */}
                                        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            {release.cover_url ? (
                                                <img
                                                    src={release.cover_url}
                                                    alt=""
                                                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                                />
                                            ) : (
                                                <div
                                                    className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800"
                                                    aria-hidden
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {categories.find((c) => c.id === release.category_id)?.name ?? release.category_id}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                        TYPE_BADGES[release.type]?.className ?? TYPE_BADGES.improvement.className
                                                    )}
                                                >
                                                    {TYPE_BADGES[release.type]?.label ?? release.type}
                                                </span>
                                            </div>
                                            <time
                                                className="mt-2 block text-sm text-slate-500 dark:text-slate-400"
                                                dateTime={release.date}
                                            >
                                                {formatDate(release.date)}
                                            </time>
                                            <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900 dark:text-white">
                                                {release.title}
                                            </h2>
                                            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                                {release.snippet}
                                            </p>
                                            <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-500">
                                                Linkiu
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {filtered.length === 0 && (
                                <p className="mt-12 text-center text-slate-500 dark:text-slate-400">
                                    No hay publicaciones en esta categoría.
                                </p>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
