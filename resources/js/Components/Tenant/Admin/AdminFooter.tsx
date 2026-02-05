import { Link } from '@inertiajs/react';

export default function AdminFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-6 px-8 bg-white border-t border-slate-100 rounded-b-3xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span>&copy; {currentYear}</span>
                    <Link href="/" className="font-bold text-slate-900 hover:text-primary transition-colors">
                        Linkiu.bio
                    </Link>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="hidden sm:inline">Todos los derechos reservados.</span>
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                        Privacidad
                    </a>
                    <a href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                        Términos
                    </a>
                    <a href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                        Soporte
                    </a>
                </div>
            </div>
        </footer>
    );
}
