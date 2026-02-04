"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            data-slot="popover-content"
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 flex flex-col gap-2.5 rounded-lg p-2.5 text-sm shadow-md ring-1 duration-100 z-50 w-72 origin-(--radix-popover-content-transform-origin) outline-none",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const PopoverHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="popover-header"
        className={cn("flex flex-col gap-0.5 text-sm", className)}
        {...props}
    />
)
PopoverHeader.displayName = "PopoverHeader"

const PopoverTitle = ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
        data-slot="popover-title"
        className={cn("font-medium", className)}
        {...props}
    />
)
PopoverTitle.displayName = "PopoverTitle"

const PopoverDescription = ({
    className,
    ...props
}: React.ComponentProps<"p">) => (
    <p
        data-slot="popover-description"
        className={cn("text-muted-foreground", className)}
        {...props}
    />
)
PopoverDescription.displayName = "PopoverDescription"

export {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
}
