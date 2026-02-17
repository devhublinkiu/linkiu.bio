import { cn } from '@/lib/utils';
import { BentoGrid, BentoGridItem } from '@/Components/ui/bento-grid';
import {
    IconUserPlus,
    IconSettings,
    IconShare3,
} from '@tabler/icons-react';
import { motion } from 'motion/react';

/** Paso 1: wireframe de registro (formulario) */
function WireframeStep1() {
    const variants = {
        initial: { x: 0 },
        animate: { x: 6, rotate: 2, transition: { duration: 0.2 } },
    };
    const variantsSecond = {
        initial: { x: 0 },
        animate: { x: -6, rotate: -2, transition: { duration: 0.2 } },
    };
    return (
        <motion.div
            initial="initial"
            whileHover="animate"
            className="flex flex-1 w-full h-full min-h-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3 flex-col space-y-3"
        >
            <motion.div variants={variants} className="h-8 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
            <motion.div variants={variantsSecond} className="h-8 w-full rounded-md bg-slate-200 dark:bg-slate-700" />
            <motion.div variants={variants} className="h-8 w-2/3 rounded-md bg-slate-200 dark:bg-slate-700" />
            <motion.div variants={variantsSecond} className="h-9 w-full rounded-md bg-slate-900 dark:bg-slate-600 mt-2" />
        </motion.div>
    );
}

/** Paso 2: wireframe de configuración (panel con bloques) */
function WireframeStep2() {
    const variants = {
        initial: { width: 0 },
        animate: { width: '100%', transition: { duration: 0.3 } },
    };
    const parentVariants = { initial: {}, animate: {} };
    return (
        <motion.div
            initial="initial"
            whileHover="animate"
            variants={parentVariants}
            className="flex flex-1 w-full h-full min-h-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3 flex-col space-y-2"
        >
            <div className="flex gap-2">
                <motion.div variants={variants} className="h-6 flex-1 rounded bg-slate-200 dark:bg-slate-700" style={{ maxWidth: '60%' }} />
                <motion.div variants={variants} className="h-6 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <motion.div variants={variants} className="h-16 w-full rounded-md bg-slate-200/80 dark:bg-slate-700/80" style={{ maxWidth: '100%' }} />
            <div className="grid grid-cols-2 gap-2 flex-1">
                <motion.div variants={variants} className="rounded-md bg-slate-200 dark:bg-slate-700" style={{ maxWidth: '100%' }} />
                <motion.div variants={variants} className="rounded-md bg-slate-200 dark:bg-slate-700" style={{ maxWidth: '100%' }} />
            </div>
        </motion.div>
    );
}

/** Paso 3: wireframe de compartir (enlace + dispositivo) */
function WireframeStep3() {
    const first = { initial: { x: 12, rotate: -3 }, animate: { x: 0, rotate: 0 } };
    const second = { initial: { x: -12, rotate: 3 }, animate: { x: 0, rotate: 0 } };
    return (
        <motion.div
            initial="initial"
            whileHover="animate"
            className="flex flex-1 w-full h-full min-h-[10rem] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3 flex-col items-center justify-center gap-3"
        >
            <motion.div
                variants={first}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 flex items-center gap-2"
            >
                <div className="h-4 w-4 rounded bg-slate-300 dark:bg-slate-600 shrink-0" />
                <div className="h-3 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 max-w-[80%]" />
            </motion.div>
            <motion.div variants={second} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </motion.div>
        </motion.div>
    );
}

const steps = [
    {
        title: 'Regístrate',
        description: (
            <span className="text-sm">
                Crea tu cuenta en pocos minutos. Dinos tu negocio y listo.
            </span>
        ),
        header: <WireframeStep1 />,
        className: 'md:col-span-1',
        icon: <IconUserPlus className="size-5 text-slate-500" />,
    },
    {
        title: 'Configura',
        description: (
            <span className="text-sm">
                Sube tu catálogo, precios y fotos. Todo desde un solo lugar.
            </span>
        ),
        header: <WireframeStep2 />,
        className: 'md:col-span-1',
        icon: <IconSettings className="size-5 text-slate-500" />,
    },
    {
        title: 'Comparte',
        description: (
            <span className="text-sm">
                Comparte tu enlace en redes, WhatsApp o donde tengas clientes.
            </span>
        ),
        header: <WireframeStep3 />,
        className: 'md:col-span-1',
        icon: <IconShare3 className="size-5 text-slate-500" />,
    },
];

export function HowItWorksSection() {
    return (
        <section id="como-funciona" className="relative z-10 py-16 sm:py-20">
            <div className="px-6 mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Tu negocio en un solo enlace, en 3 pasos
                </h2>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Regístrate en minutos, configura tu catálogo y comparte tu enlace donde tengas clientes.
                </p>
            </div>
            <div className="px-6 max-w-4xl mx-auto">
                <BentoGrid className="md:auto-rows-[22rem]">
                    {steps.map((step, i) => (
                        <BentoGridItem
                            key={step.title}
                            title={step.title}
                            description={step.description}
                            header={step.header}
                            className={cn(step.className)}
                            icon={step.icon}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
