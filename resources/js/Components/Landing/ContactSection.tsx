import { cn } from '@/lib/utils';
import { IconMail, IconBrandWhatsapp } from '@tabler/icons-react';

export function ContactSection() {
    return (
        <section id="contacto" className="relative z-10 py-16 sm:py-20">
            <div className="px-6 mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Contacto
                </h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    ¿Dudas o quieres contarnos tu caso? Escríbenos.
                </p>
            </div>
            <div className="px-6 max-w-2xl mx-auto">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="mailto:hola@linkiu.bio"
                        className={cn(
                            'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium',
                            'text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition'
                        )}
                    >
                        <IconMail className="size-5 text-slate-500" />
                        hola@linkiu.bio
                    </a>
                    <a
                        href="https://wa.me/573001234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            'inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium',
                            'text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition'
                        )}
                    >
                        <IconBrandWhatsapp className="size-5 text-slate-500" />
                        WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
}
