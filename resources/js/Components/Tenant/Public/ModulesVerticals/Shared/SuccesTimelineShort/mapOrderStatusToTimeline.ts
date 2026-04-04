import type { TimelineShortOrderStatus } from './parts/TimelineShortOrders';

/** Misma lógica que `PublicController::mapGastronomyOrderStatusToTimeline` + entregado. */
export function mapOrderStatusToTimeline(status: string): TimelineShortOrderStatus {
    switch (status) {
        case 'pending':
            return 'recibido';
        case 'confirmed':
            return 'confirmado';
        case 'preparing':
            return 'preparando';
        case 'ready':
            return 'en_camino';
        case 'completed':
            return 'entregado';
        default:
            return 'recibido';
    }
}

export function isTerminalPublicOrderStatus(status: string): boolean {
    return status === 'completed' || status === 'cancelled';
}
