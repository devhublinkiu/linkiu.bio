import { Link, Head } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import { Separator } from '@/Components/ui/separator';

interface Props {
    children: React.ReactNode;
    currentStep: number;
    siteSettings?: {
        app_name: string;
        logo_url: string | null;
    };
    title?: string;
}

export default function OnboardingLayout({ children, currentStep, siteSettings, title }: Props) {
    return (
        <div className="min-h-screen bg-slate-50/50">
            {title && <Head title={title} />}

            {/* Header with 4-Step Progress */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="block">
                            {siteSettings?.logo_url ? (
                                <img
                                    src={siteSettings.logo_url}
                                    alt={siteSettings.app_name || 'Logo'}
                                    className="h-8 w-auto object-contain max-w-[200px]"
                                />
                            ) : (
                                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
                                    <div className="h-8 w-8 flex items-center justify-center bg-primary p-1.5 rounded-lg">
                                        <ShoppingBag className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                    <span>{siteSettings?.app_name || 'Linkiu.bio'}</span>
                                </div>
                            )}
                        </Link>

                        <Separator orientation="vertical" className="h-8 mx-2 hidden sm:block" />
                        <p className="text-sm text-muted-foreground hidden sm:block font-medium">
                            Registro Linkiu
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-500",
                                        step === currentStep ? "w-8 bg-primary" :
                                            step < currentStep ? "w-2 bg-primary" : "w-2 bg-gray-200"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {children}
            </main>
        </div>
    );
}
