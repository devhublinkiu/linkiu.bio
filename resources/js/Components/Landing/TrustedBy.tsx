import { AnimatedTooltip } from '@/Components/ui/animated-tooltip';

const people = [
    { id: 1, name: 'Camila Muñoz', designation: 'Sisu Art', image: '/profile_1.jpg' },
    { id: 2, name: 'Carlos Ruiz', designation: 'Azienda', image: '/profile_2.jpg' },
    { id: 3, name: 'Ana Martínez', designation: 'BeYou', image: '/profile_3.jpg' },
    { id: 4, name: 'Luis Fernández', designation: 'ETG Abogados', image: '/profile_4.jpg' },
    { id: 5, name: 'Laura Vega', designation: 'Olmos', image: '/profile_5.jpg' },
    { id: 6, name: 'Pablo Soto', designation: 'TCA Oriente', image: '/profile_6.jpg' },
];

export function TrustedBy() {
    return (
        <div className="mt-2 flex flex-col items-center gap-4">
            <AnimatedTooltip items={people} className="flex-wrap justify-center " />
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Ellos confiaron en nosotros
            </p>
        </div>
    );
}
