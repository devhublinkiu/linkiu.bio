import { PropsWithChildren } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User } from 'lucide-react';
import { Toaster } from 'sonner';

export default function POSLayout({ children, title, tenant, user }: PropsWithChildren<{ title: string; tenant: any; user?: any }>) {
    return (
        <div className="h-screen bg-slate-100 flex flex-col font-outfit overflow-hidden">
            <Head title={`POS - ${title}`} />

            {/* Minimal Header */}
            <header className="h-14 bg-slate-900 flex items-center justify-between px-4 shrink-0 z-50 shadow-md border-b border-slate-800">
                <div className="flex items-center gap-4">
                    {/* Hide Dashboard Link for Waiters */}
                    {user?.card_brand !== 'waiter' && !user?.roles?.some((r: any) => r.name === 'waiter') && (
                        <Link
                            href={route('tenant.dashboard', tenant.slug)}
                            className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                            title="Volver al Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="font-black text-white text-lg tracking-tight">LINKIU<span className="text-indigo-400">POS</span></span>
                        <span className="text-slate-600">/</span>
                        <span className="font-medium text-slate-300 text-sm hidden sm:inline">{title}</span>
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-4">
                    {/* Status Indicator (Online/Offline eventually) */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">En Línea</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white border border-slate-700 shadow-inner">
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                {children}
            </main>
            <Toaster position="bottom-center" />
        </div>
    );
}
