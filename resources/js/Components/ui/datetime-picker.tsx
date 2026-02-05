"use client"

import * as React from "react"
import { Calendar } from "@/Components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/Components/ui/card"
import { Field, FieldLabel } from "@/Components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/Components/ui/input-group"
import { Clock2Icon, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import { Button } from "@/Components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface DateTimePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    label?: string
}

export function DateTimePicker({ date, setDate, label = "Hora" }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    // Helper to get time string (HH:mm:ss) from date
    const getTimeString = (d: Date | undefined) => {
        if (!d) return "00:00:00"
        return d.toTimeString().split(' ')[0]
    }

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) {
            setDate(undefined)
            return
        }
        // Preserve time from current date if exists, else keep newDate's time (usually 00:00)
        // Actually, if we are selecting a date, we probably want to keep the time the user already set?
        // Or if it's fresh, maybe 00:00 is fine.
        const d = new Date(newDate)
        if (date) {
            d.setHours(date.getHours())
            d.setMinutes(date.getMinutes())
            d.setSeconds(date.getSeconds())
        }
        setDate(d)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value // "HH:mm" or "HH:mm:ss"
        if (!timeStr) return

        const [hours, minutes, seconds] = timeStr.split(':').map(Number)

        const newDate = date ? new Date(date) : new Date()
        newDate.setHours(hours || 0)
        newDate.setMinutes(minutes || 0)
        newDate.setSeconds(seconds || 0)

        setDate(newDate)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP p", { locale: es }) : <span>Seleccionar fecha y hora</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-4" align="start">
                <Card className="mx-auto w-auto border-0 shadow-none">
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="p-0"
                            locale={es}
                        />
                    </CardContent>
                    <CardFooter className="bg-card border-t p-3">
                        <Field className="w-full">
                            <FieldLabel>{label}</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    type="time"
                                    step="1"
                                    value={getTimeString(date)}
                                    onChange={handleTimeChange}
                                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                />
                                <InputGroupAddon>
                                    <Clock2Icon className="text-muted-foreground w-4 h-4" />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    )
}
