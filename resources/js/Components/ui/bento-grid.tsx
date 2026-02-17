import { cn } from '@/lib/utils';

export function BentoGrid({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                'grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[20rem]',
                className
            )}
        >
            {children}
        </div>
    );
}

export function BentoGridItem({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string;
    description?: React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) {
    return (
        <div
            className={cn(
                'group/bento row-span-1 flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900',
                className
            )}
        >
            {header && <div className="min-h-[10rem] flex flex-col flex-1 shrink-0">{header}</div>}
            <div className="mt-4 shrink-0">
                {icon && (
                    <div className="mb-2 text-slate-600 dark:text-slate-400">
                        {icon}
                    </div>
                )}
                {title && (
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                    </div>
                )}
                {description && (
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
}
