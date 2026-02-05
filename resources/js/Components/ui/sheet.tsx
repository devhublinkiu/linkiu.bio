"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        ref={ref}
        data-slot="sheet-overlay"
        className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 data-ending-style:opacity-0 data-starting-style:opacity-0 backdrop-blur-sm fixed inset-0 z-50",
            className
        )}
        {...props}
    />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
        side?: "top" | "right" | "bottom" | "left"
        showCloseButton?: boolean
    }
>(({ className, children, side = "right", showCloseButton = true, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
            ref={ref}
            data-slot="sheet-content"
            data-side={side}
            className={cn(
                "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-open:animate-in data-closed:animate-out data-[side=right]:data-[state=closed]:slide-out-to-right-10 data-[side=right]:data-[state=open]:slide-in-from-right-10 data-[side=left]:data-[state=closed]:slide-out-to-left-10 data-[side=left]:data-[state=open]:slide-in-from-left-10 data-[side=top]:data-[state=closed]:slide-out-to-top-10 data-[side=top]:data-[state=open]:slide-in-from-top-10 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-[state=closed]:slide-out-to-bottom-10 data-[side=bottom]:data-[state=open]:slide-in-from-bottom-10 fixed z-50 flex flex-col gap-4 p-6 bg-clip-padding text-sm shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
                className
            )}
            {...props}
        >
            {children}
            {showCloseButton && (
                <SheetPrimitive.Close data-slot="sheet-close" asChild>
                    <Button variant="ghost" className="absolute top-3 right-3" size="icon-sm">
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </Button>
                </SheetPrimitive.Close>
            )}
        </SheetPrimitive.Content>
    </SheetPortal>
))
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        data-slot="sheet-header"
        className={cn("gap-0.5 flex flex-col", className)}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        data-slot="sheet-footer"
        className={cn("gap-2 mt-auto flex flex-col", className)}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
        ref={ref}
        data-slot="sheet-title"
        className={cn("text-foreground text-base font-medium", className)}
        {...props}
    />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
        ref={ref}
        data-slot="sheet-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
    />
))
SheetDescription.displayName = "SheetDescription"

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    SheetPortal,
    SheetOverlay,
}
