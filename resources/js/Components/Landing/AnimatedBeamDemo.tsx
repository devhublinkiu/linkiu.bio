import React, { forwardRef, useRef } from "react";
import {
  Link as LinkIcon,
  User,
  MessageCircle,
  Store,
  UtensilsCrossed,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/Components/ui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const iconWrap =
  "flex size-6 shrink-0 items-center justify-center [&_svg]:size-full [&_svg]:max-h-6 [&_svg]:max-w-6";

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] w-full max-w-4xl flex-col items-stretch justify-between gap-10">
        {/* Fila 1: Clientes (izq) | Linkiu (centro) | Verticales (der) */}
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <span className={iconWrap}><LinkIcon className="size-6 text-slate-600 dark:text-slate-300" /></span>
          </Circle>
          <Circle ref={div5Ref}>
            <span className={iconWrap}><Store className="size-6 text-slate-600 dark:text-slate-300" /></span>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <span className={iconWrap}><User className="size-6 text-slate-600 dark:text-slate-300" /></span>
          </Circle>
          <div ref={div4Ref} className="relative flex size-16 shrink-0 items-center justify-center">
            <div
              className="absolute size-16 rounded-full bg-slate-400/40 animate-pulse scale-110 dark:bg-slate-500/25"
              aria-hidden
            />
            <div
              className="absolute size-20 rounded-full bg-slate-400/20 scale-110 animate-pulse dark:bg-slate-500/20"
              aria-hidden
            />
            <Circle className="size-14 overflow-hidden border-0 bg-transparent p-0 shadow-none">
              <img
                src="/LogoLinkiu.svg"
                alt="Linkiu"
                className="size-full rounded-full object-cover"
              />
            </Circle>
          </div>
          <Circle ref={div6Ref}>
            <span className={iconWrap}><UtensilsCrossed className="size-6 text-slate-600 dark:text-slate-300" /></span>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <span className={iconWrap}><MessageCircle className="size-6 text-slate-600 dark:text-slate-300" /></span>
          </Circle>
          <Circle ref={div7Ref}>
            <span className={iconWrap}><Briefcase className="size-6 text-slate-600 dark:text-slate-300" /></span>
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  );
}
