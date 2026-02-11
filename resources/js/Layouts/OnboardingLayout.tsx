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
        <div className="min-h-screen bg-white">
            {title && <Head title={title} />}

            <main className="max-w-5xl mx-auto px-6 py-8 md:py-16">
                {children}
            </main>
        </div>
    );
}
