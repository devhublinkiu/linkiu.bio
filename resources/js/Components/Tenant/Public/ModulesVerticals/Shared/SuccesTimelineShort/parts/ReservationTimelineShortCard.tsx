import { cn } from '@/lib/utils';
import type { ActivePublicReservation } from '../types';

import InfoReservationTimelineShort from './InfoReservationTimelineShort';
import TimelineShortReservation from './TimelineShortReservation';

export interface ReservationTimelineShortCardProps {
    reservation: ActivePublicReservation;
    className?: string;
}

export default function ReservationTimelineShortCard({
    reservation,
    className,
}: ReservationTimelineShortCardProps) {
    const reservationNumber = String(reservation.id).padStart(4, '0');

    return (
        <div
            className={cn(
                'w-full rounded-3xl bg-slate-50 p-4',
                className,
            )}
            data-name="ReservationTimelineShortCard"
            data-reservation-id={reservation.id}
        >
            <InfoReservationTimelineShort
                reservationDate={reservation.reservation_date}
                reservationTime={reservation.reservation_time}
                partySize={reservation.party_size}
                reservationNumber={reservationNumber}
            />

            <div className="mt-4 w-full">
                <TimelineShortReservation status={reservation.timeline_status} />
            </div>
        </div>
    );
}
