import React from 'react';
import { Calendar, CheckCircle, Clock, User, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/Components/ui/sheet';
import { ScrollArea } from '@/Components/ui/scroll-area';

import { Reservation } from '@/types/pos';

interface Props {
    reservations: Reservation[];
    onCheckIn: (reservation: Reservation) => void;
}

export const POSReservationWidget = ({ reservations = [], onCheckIn }: Props) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservas
                    {reservations.length > 0 && (
                        <Badge className="ml-2 bg-indigo-600 text-white hover:bg-indigo-700 h-5 px-1.5 min-w-[1.25rem] rounded-full">
                            {reservations.length}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Reservas de Hoy</SheetTitle>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
                    <div className="space-y-4">
                        {reservations.length === 0 ? (
                            <div className="text-center text-slate-500 py-10">
                                No hay reservas pendientes para hoy.
                            </div>
                        ) : (
                            reservations.map(res => (
                                <div key={res.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center group">
                                    <div className="space-y-1">
                                        <div className="font-semibold flex items-center gap-2">
                                            {res.customer_name}
                                            <Badge variant={res.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                                                {res.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-slate-500 flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {res.reservation_time ? res.reservation_time.substring(0, 5) : '--:--'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" /> {res.party_size} pax
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={() => onCheckIn(res)}
                                        className={res.status === 'confirmed' ? 'bg-indigo-600' : ''}
                                    >
                                        Sentar
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
