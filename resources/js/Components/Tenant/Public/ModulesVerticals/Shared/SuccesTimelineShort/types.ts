import type { TimelineShortOrderStatus } from './parts/TimelineShortOrders';
import type { TimelineShortReservationStatus } from './parts/TimelineShortReservation';

/** Pedido activo del visitante (sesión) para la tarjeta + timeline. */
export interface ActivePublicOrder {
    id: number;
    order_number: string;
    estimated_delivery_range: string;
    timeline_status: TimelineShortOrderStatus;
    /** ISO 8601; ordenación en el carrusel junto a reservas. */
    created_at?: string;
}

/** Reserva activa del visitante (sesión) para la tarjeta + timeline. */
export interface ActivePublicReservation {
    id: number;
    reservation_date: string;
    reservation_time: string;
    party_size: number;
    timeline_status: TimelineShortReservationStatus;
    created_at: string;
}
