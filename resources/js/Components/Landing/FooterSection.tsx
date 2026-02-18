import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const footerLinkClass =
    'text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100';

const columns = [
    {
        title: 'Legal',
        links: [
            { label: 'Política de Cookies', href: '/politica-cookies' },
            { label: 'Aviso Legal', href: '/aviso-legal' },
            { label: 'Política de Privacidad', href: '/politica-privacidad' },
            { label: 'Política de Reembolsos', href: '/politica-reembolsos' },
            { label: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
        ],
    },
    {
        title: 'Soluciones',
        links: [
            { label: 'Gastronomía', href: '/#funciones' },
            { label: 'Ecommerce', href: '/#funciones' },
            { label: 'Dropshipping', href: '/#funciones' },
            { label: 'Servicios', href: '/#funciones' },
        ],
    },
    {
        title: 'Ayuda',
        links: [
            { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
            { label: 'Tutoriales', href: '/#tutoriales' },
            { label: 'Actualizaciones', href: '/actualizaciones' },
        ],
    },
    {
        title: 'Empresa',
        links: [
            { label: 'Nosotros', href: '/#nosotros' },
            { label: 'Equipo Linkiu', href: '/equipo' },
            { label: 'Partners', href: '/partners' },
            { label: 'Blog', href: '/blog' },
        ],
    },
];

export function FooterSection() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative z-10 w-full border-t border-slate-200 bg-white pt-8 pb-0 dark:border-slate-800 dark:bg-slate-950 overflow-hidden sm:pt-12">
            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-10">
                    {/* Logo + copyright */}
                    <div className="flex flex-col gap-3">
                        {/*<Link href="/" className="inline-flex items-center gap-2" aria-label="Linkiu inicio">
                            <img
                                src="/Logo_nav_web_linkiu.svg"
                                alt=""
                                className="h-9 w-auto dark:invert"
                                aria-hidden
                            />
                        </Link>*/}
                        <h3 className="text-3xl font-bold pb-2 sm:text-5xl lg:text-6xl">Un solo enlace, <br /> infinitas oportunidades</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            © {year} Linkiu. Todos los derechos reservados.
                        </p>
                    </div>

                    {/* Columnas de enlaces */}
                    <div className="grid grid-cols-2 gap-6 gap-y-8 sm:grid-cols-4 sm:gap-10">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                                    {col.title}
                                </h3>
                                <ul className="flex flex-col gap-3">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className={cn(footerLinkClass)}
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marca grande abajo con espacio respecto a las secciones */}
                <div
                    className="pointer-events-none mt-10 flex justify-center -mb-12 sm:mt-16 sm:-mb-24"
                    aria-hidden
                >
                    <span className="select-none text-[clamp(10rem,45vw,48rem)] font-black leading-none tracking-tighter text-slate-100 dark:text-slate-800/50 sm:text-[clamp(20rem,20vw,48rem)]">
                        Linkiu
                    </span>
                </div>
            </div>
        </footer>
    );
}
