import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';

const faqs = [
    {
        question: '¿Qué es Linkiu?',
        answer:
            'Linkiu es la herramienta digital que concentra tu negocio en un solo enlace. Tus clientes ven el catálogo, hacen pedidos, reservas o compras y te contactan desde el mismo lugar, sin salir del enlace. Se adapta a tu tipo de negocio: gastronomía, ecommerce, servicios y más.',
    },
    {
        question: '¿Cómo puedo empezar con Linkiu?',
        answer:
            'Regístrate gratis, crea tu cuenta y elige el tipo de negocio (vertical). Configura tu catálogo, horarios y formas de pago. Comparte tu enlace único con tus clientes y empieza a recibir pedidos o reservas desde el primer día. Puedes probar las funciones sin compromiso.',
    },
    {
        question: '¿Qué tipos de negocio puede usar Linkiu?',
        answer:
            'Linkiu ofrece soluciones para gastronomía (menú, mesas, cocina, reservas), ecommerce, dropshipping y servicios. Cada vertical incluye las funciones que necesitas: productos, carrito, checkout, reservas, contacto y más, todo en un solo enlace.',
    },
    {
        question: '¿Linkiu es adecuado para negocios pequeños?',
        answer:
            'Sí. Está pensado para que cualquier negocio, desde un emprendimiento hasta varias sedes, tenga su tienda o carta en un solo enlace. La interfaz es sencilla y puedes ir creciendo: más productos, más ubicaciones o más opciones de pago cuando lo necesites.',
    },
    {
        question: '¿Qué tipo de soporte ofrece Linkiu?',
        answer:
            'Ofrecemos tutoriales, preguntas frecuentes y un equipo de soporte para ayudarte con la configuración y el día a día. También publicamos actualizaciones y novedades para que aproveches todas las funciones de tu cuenta.',
    },
];

export function FAQSection() {
    return (
        <section id="preguntas-frecuentes" className="relative w-full py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <h2 className="mb-10 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Preguntas frecuentes
                </h2>
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-3">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 data-[state=open]:border-slate-300 dark:data-[state=open]:border-slate-700"
                        >
                            <AccordionTrigger className="py-5 text-left text-slate-900 hover:no-underline dark:text-slate-100 [&[data-state=open]]:pb-2">
                                <span className="pr-4 font-medium">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
