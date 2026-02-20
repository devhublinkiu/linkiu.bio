import { Link } from '@inertiajs/react';
import { CalendarRange, Sparkles, Package, Wrench, Shield, Zap } from 'lucide-react';

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    new: Sparkles,
    fix: Wrench,
    improvement: Package,
    security: Shield,
    performance: Zap,
};

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
}

interface ReleaseNoteItem {
    id: string;
    slug: string;
    type: string;
    date: string;
    title: string;
    snippet: string;
    cover_url?: string | null;
}

interface ReleaseNotesSectionProps {
    releaseNotes?: ReleaseNoteItem[];
}

export function ReleaseNotesSection({ releaseNotes = [] }: ReleaseNotesSectionProps) {
    const list = releaseNotes.slice(0, 3);

    return (
        <section id="release-notes" className="relative w-full py-16 sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Novedades
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Últimas actualizaciones de Linkiu.
                </p>

                <div className="mt-12 grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-slate-200 dark:sm:divide-slate-700">
                    {list.map((release) => {
                        const Icon = TYPE_ICONS[release.type] ?? CalendarRange;
                        return (
                            <Link
                                key={release.id}
                                href={`/release-notes/${release.slug}`}
                                className="flex flex-col px-0 py-6 sm:px-8 sm:py-0 sm:pt-6 sm:pb-8 transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                                        <Icon className="size-5" aria-hidden />
                                    </span>
                                    <time
                                        className="text-sm text-slate-500 dark:text-slate-400"
                                        dateTime={release.date}
                                    >
                                        {formatDate(release.date)}
                                    </time>
                                </div>
                                <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900 dark:text-white">
                                    {release.title}
                                </h3>
                                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    {release.snippet}
                                </p>
                                <span className="mt-4 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-900 dark:text-slate-400 dark:decoration-slate-500 dark:hover:text-slate-200">
                                    Ver actualización
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <p className="mt-10 text-center">
                    <Link
                        href="/release-notes"
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        Ver todas las novedades →
                    </Link>
                </p>
            </div>
        </section>
    );
}
