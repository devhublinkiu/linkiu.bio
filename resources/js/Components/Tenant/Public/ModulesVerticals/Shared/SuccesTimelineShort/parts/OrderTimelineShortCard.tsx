import { cn } from '@/lib/utils';
import type { ActivePublicOrder } from '../types';

import InfoTimelineShort from './InfoTimelineShort';
import TimelineShortOrders from './TimelineShortOrders';

export interface OrderTimelineShortCardProps {
    order: ActivePublicOrder;
    className?: string;
}

export default function OrderTimelineShortCard({ order, className }: OrderTimelineShortCardProps) {
    return (
        <div
            className={cn(
                'w-full rounded-3xl bg-slate-50 p-4',
                className,
            )}
            data-name="OrderTimelineShortCard"
            data-order-id={order.id}
        >
            <InfoTimelineShort
                estimatedDeliveryRange={order.estimated_delivery_range}
                orderNumber={order.order_number}
            />

            <div className="mt-4 w-full">
                <TimelineShortOrders status={order.timeline_status} />
            </div>

            <div className="mt-4 empty:hidden" data-name="TimelineShortOrderActions" />
        </div>
    );
}
