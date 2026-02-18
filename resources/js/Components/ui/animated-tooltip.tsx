"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedTooltipItem {
    id: number;
    name: string;
    designation: string;
    image?: string;
}

interface AnimatedTooltipProps {
    items: AnimatedTooltipItem[];
    className?: string;
}

export function AnimatedTooltip({ items, className }: AnimatedTooltipProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mouseX, setMouseX] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const rotation = (mouseX / 100) * 50;
    const translation = (mouseX / 100) * 50;

    function handleMouseEnter(event: React.MouseEvent, itemId: number) {
        setHoveredIndex(itemId);
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        setMouseX(event.clientX - rect.left - halfWidth);
    }

    function handleMouseMove(event: React.MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        setMouseX(event.clientX - rect.left - halfWidth);
    }

    function handleMouseLeave() {
        setHoveredIndex(null);
    }

    function initial(name: string) {
        return name
            .split(/\s+/)
            .map((s) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        <div
            ref={containerRef}
            className={cn("relative flex flex-row items-center gap-0", className)}
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    onMouseEnter={(e) => handleMouseEnter(e, item.id)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative -ml-2 first:ml-0"
                >
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className={cn(
                                "size-11 shrink-0 cursor-pointer rounded-full object-cover border-4 border-white"
                            )}
                        />
                    ) : (
                        <div
                            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            aria-label={`${item.name}, ${item.designation}`}
                        >
                            {initial(item.name)}
                        </div>
                    )}
                    <AnimatePresence>
                        {hoveredIndex === item.id && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, x: "-50%" }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    x: "-50%",
                                    rotate: rotation,
                                    translateX: translation,
                                }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute bottom-full left-1/2 z-50 mb-2 flex w-fit flex-col items-center rounded-md bg-slate-950 px-3 py-2 shadow-lg"
                                style={{ transformOrigin: "bottom center" }}
                            >
                                <p className="whitespace-nowrap text-sm font-medium text-slate-100">
                                    {item.name}
                                </p>
                                <p className="whitespace-nowrap text-xs text-slate-400">
                                    {item.designation}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
