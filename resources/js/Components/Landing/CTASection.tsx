import { Link } from '@inertiajs/react';
import { IconRocket } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { TrustedBy } from '@/Components/Landing/TrustedBy';

const btnClass =
    'inline-flex items-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-base font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100';

export function CTASection() {
    return (
        <section className="relative z-10 py-16 sm:py-24">
            <div className="px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    ¿Listo? Crea tu enlace en minutos
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Sin tarjeta para empezar. Regístrate gratis y comparte tu enlace donde tengas clientes.
                </p>
                <TrustedBy/>
                <Link
                    href={route('register.tenant')}
                    className={cn(btnClass, 'mt-2 inline-flex w-auto h-10')}
                >
                    <IconRocket className="size-5" />
                    Regístrate gratis
                </Link>
            </div>
        </section>
    );
}
