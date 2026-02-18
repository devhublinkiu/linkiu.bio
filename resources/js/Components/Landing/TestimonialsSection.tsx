import { cn } from '@/lib/utils';
import { Marquee } from '@/Components/ui/marquee';

const reviews = [
    {
        name: 'Camila Muñoz',
        username: 'Sisu Art',
        body: 'Mis clientes ven el catálogo y hacen la compra en el mismo Linkiu. Sin salir del enlace.',
        img: '/profile_1.jpg',
    },
    {
        name: 'Carlos Ruiz',
        username: 'Azienda',
        body: 'Comparto el link y me compran desde ahí. Todo el proceso de compra pasa por Linkiu.',
        img: '/profile_2.jpg',
    },
    {
        name: 'Ana Martínez',
        username: 'BeYou',
        body: 'Ellos eligen, agregan al carrito y pagan en Linkiu. Una sola herramienta para todo.',
        img: '/profile_3.jpg',
    },
    {
        name: 'Luis Fernández',
        username: 'ETG Abogados',
        body: 'Mis clientes agendan y me contactan desde el mismo link. Y las reservas quedan en Linkiu.',
        img: '/profile_4.jpg',
    },
    {
        name: 'Laura Vega',
        username: 'Olmos',
        body: 'El catálogo está en Linkiu y la compra se hace ahí mismo. Mis clientes no salen del enlace.',
        img: '/profile_5.jpg',
    },
    {
        name: 'Pablo Soto',
        username: 'TCA Oriente',
        body: 'Pedidos y reservas: todo dentro de Linkiu. Los clientes compran en el mismo lugar.',
        img: '/profile_6.jpg',
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                'relative h-full w-64 shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4',
                'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:bg-slate-800/50'
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img
                    className="size-8 rounded-full object-cover"
                    width={32}
                    height={32}
                    alt=""
                    src={img}
                />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-slate-900 dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {username}
                    </p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {body}
            </blockquote>
        </figure>
    );
};

export function TestimonialsSection() {
    return (
        <section className="relative z-10 py-16 sm:py-20">
            <div className="mb-12 px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Quienes ya usan Linkiu
                </h2>
                <p className="mx-auto mt-2 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                    Distintos tipos de negocio, un solo enlace.
                </p>
            </div>
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                <Marquee pauseOnHover className="[--duration:20s]">
                    {firstRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:20s]">
                    {secondRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950" />
            </div>
        </section>
    );
}
