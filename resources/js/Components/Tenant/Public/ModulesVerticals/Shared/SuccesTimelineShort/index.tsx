import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getEcho } from '@/echo';
import HeaderSectionProducts from '@/Components/Tenant/Public/ModulesVerticals/Shared/HeaderSectionProducts';

import { isTerminalPublicOrderStatus, mapOrderStatusToTimeline } from './mapOrderStatusToTimeline';
import OrderTimelineShortCard from './parts/OrderTimelineShortCard';
import ReservationTimelineShortCard from './parts/ReservationTimelineShortCard';
import type { ActivePublicOrder, ActivePublicReservation } from './types';

export { default as InfoTimelineShort } from './parts/InfoTimelineShort';
export { default as InfoReservationTimelineShort } from './parts/InfoReservationTimelineShort';
export { default as TimelineShortOrders } from './parts/TimelineShortOrders';
export {
    default as TimelineShortReservation,
    mapBackendReservationStatusToTimeline,
} from './parts/TimelineShortReservation';
export { default as OrderTimelineShortCard } from './parts/OrderTimelineShortCard';
export { default as ReservationTimelineShortCard } from './parts/ReservationTimelineShortCard';
export type { TimelineShortOrderStatus } from './parts/TimelineShortOrders';
export type { TimelineShortReservationStatus } from './parts/TimelineShortReservation';
export type { ActivePublicOrder, ActivePublicReservation } from './types';

export type TimelineSlide =
    | { kind: 'order'; data: ActivePublicOrder }
    | { kind: 'reservation'; data: ActivePublicReservation };

function mergeSlides(
    orders: ActivePublicOrder[],
    reservations: ActivePublicReservation[],
): TimelineSlide[] {
    const rows: Array<{ slide: TimelineSlide; sort: number }> = [];
    orders.forEach((data) => {
        rows.push({
            slide: { kind: 'order', data },
            sort: new Date(data.created_at ?? 0).getTime(),
        });
    });
    reservations.forEach((data) => {
        rows.push({
            slide: { kind: 'reservation', data },
            sort: new Date(data.created_at).getTime(),
        });
    });
    return rows
        .sort((a, b) => b.sort - a.sort)
        .map((r) => r.slide);
}

export interface SuccesTimelineShortProps {
    /** Pedidos activos del visitante (desde sesión / backend). */
    orders?: ActivePublicOrder[];
    /** Reservas activas del visitante (desde sesión / backend). */
    reservations?: ActivePublicReservation[];
    /** ID del tenant (canal Ably: `tenant.{id}.orders.{orderId}`). */
    tenantId: number;
    /** Título de la sección (cabecera tipo Hero / productos). */
    title?: string;
    /** Texto de la pastilla cuando hay 1 ítem (singular). */
    pillSuffixSingular?: string;
    /** Texto de la pastilla cuando hay varios (plural). */
    pillSuffixPlural?: string;
    className?: string;
}

export default function SuccesTimelineShort({
    orders = [],
    reservations = [],
    tenantId,
    title = 'Tus órdenes activas',
    pillSuffixSingular = 'orden',
    pillSuffixPlural = 'órdenes',
    className,
}: SuccesTimelineShortProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [slideIndex, setSlideIndex] = useState(0);
    const [liveOrders, setLiveOrders] = useState<ActivePublicOrder[]>(orders);
    const [liveReservations, setLiveReservations] = useState<ActivePublicReservation[]>(reservations);

    const slides = useMemo(
        () => mergeSlides(liveOrders, liveReservations),
        [liveOrders, liveReservations],
    );

    const count = slides.length;
    const pillSuffix = count === 1 ? pillSuffixSingular : pillSuffixPlural;

    const orderIdsKey = orders.map((o) => o.id).join(',');
    const reservationIdsKey = reservations.map((r) => r.id).join(',');
    const slidesSyncKey = `${orderIdsKey}|${reservationIdsKey}`;

    const syncIndexFromScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || count === 0) return;
        const w = el.offsetWidth;
        if (w <= 0) return;
        const idx = Math.round(el.scrollLeft / w);
        setSlideIndex(Math.min(Math.max(0, idx), count - 1));
    }, [count]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onScrollEnd = () => syncIndexFromScroll();
        let debounce: ReturnType<typeof setTimeout>;
        const onScroll = () => {
            clearTimeout(debounce);
            debounce = setTimeout(onScrollEnd, 64);
        };

        el.addEventListener('scroll', onScroll);
        el.addEventListener('scrollend', onScrollEnd);
        return () => {
            clearTimeout(debounce);
            el.removeEventListener('scroll', onScroll);
            el.removeEventListener('scrollend', onScrollEnd);
        };
    }, [syncIndexFromScroll]);

    useEffect(() => {
        setLiveOrders(orders);
    }, [orderIdsKey]);

    useEffect(() => {
        setLiveReservations(reservations);
    }, [reservationIdsKey]);

    useEffect(() => {
        setSlideIndex(0);
        const el = scrollRef.current;
        if (el) el.scrollTo({ left: 0, behavior: 'auto' });
    }, [slidesSyncKey]);

    useEffect(() => {
        if (slideIndex > 0 && slideIndex >= slides.length) {
            const next = Math.max(0, slides.length - 1);
            setSlideIndex(next);
            const el = scrollRef.current;
            if (el && slides.length > 0) {
                const w = el.offsetWidth;
                el.scrollTo({ left: next * w, behavior: 'auto' });
            }
        }
    }, [slides.length, slideIndex]);

    const liveOrderIdsKey = liveOrders.map((o) => o.id).join(',');

    useEffect(() => {
        const echoInstance = getEcho() as {
            connector?: unknown;
            channel: (name: string) => {
                listen: (ev: string, cb: (e: { id: number; status: string; message?: string }) => void) => unknown;
                stopListening: (ev: string) => void;
            };
        } | null;

        if (!echoInstance?.connector || !tenantId || liveOrders.length === 0) {
            return;
        }

        const channels: Array<{ stopListening: (ev: string) => void }> = [];

        liveOrders.forEach((o) => {
            const orderId = o.id;
            const ch = echoInstance.channel(`tenant.${tenantId}.orders.${orderId}`).listen(
                '.order.status.updated',
                (e: { id: number; status: string }) => {
                    if (e.id !== orderId) return;

                    if (isTerminalPublicOrderStatus(e.status)) {
                        setLiveOrders((prev) => prev.filter((row) => row.id !== e.id));
                        if (e.status === 'cancelled') {
                            toast.info('Tu pedido ha sido cancelado.');
                        } else {
                            toast.success('¡Pedido entregado! Gracias por tu compra.');
                        }
                        return;
                    }

                    setLiveOrders((prev) =>
                        prev.map((row) =>
                            row.id === e.id
                                ? { ...row, timeline_status: mapOrderStatusToTimeline(e.status) }
                                : row,
                        ),
                    );

                    if (e.status === 'confirmed') toast.success('¡Tu pedido ha sido confirmado!');
                    else if (e.status === 'preparing') toast.success('¡Están preparando tu pedido!');
                    else if (e.status === 'ready') toast.success('¡Tu pedido está listo!');
                },
            ) as { stopListening: (ev: string) => void };
            channels.push(ch);
        });

        return () => {
            channels.forEach((ch) => ch.stopListening('.order.status.updated'));
        };
    }, [tenantId, liveOrderIdsKey]);

    const goTo = (i: number) => {
        const el = scrollRef.current;
        if (!el || count === 0) return;
        const clamped = Math.max(0, Math.min(i, count - 1));
        const w = el.offsetWidth;
        el.scrollTo({ left: clamped * w, behavior: 'smooth' });
        setSlideIndex(clamped);
    };

    if (slides.length === 0) {
        return null;
    }

    return (
        <section
            className={cn('w-full pt-2', className)}
            aria-labelledby="succes-timeline-heading"
        >
            <HeaderSectionProducts
                headingId="succes-timeline-heading"
                title={title}
                availableCount={count}
                pillSuffix={pillSuffix}
                onPrev={count > 1 ? () => goTo(slideIndex - 1) : undefined}
                onNext={count > 1 ? () => goTo(slideIndex + 1) : undefined}
                prevDisabled={count <= 1 || slideIndex <= 0}
                nextDisabled={count <= 1 || slideIndex >= count - 1}
                navPrevAriaLabel="Anterior"
                navNextAriaLabel="Siguiente"
            />

            <div
                ref={scrollRef}
                className={cn(
                    'mt-1 flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth',
                    '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                )}
                aria-roledescription="carrusel"
            >
                {slides.map((slide) => (
                    <div
                        key={slide.kind === 'order' ? `order-${slide.data.id}` : `reservation-${slide.data.id}`}
                        className="w-full min-w-full shrink-0 snap-start snap-always px-0"
                    >
                        {slide.kind === 'order' ? (
                            <OrderTimelineShortCard order={slide.data} />
                        ) : (
                            <ReservationTimelineShortCard reservation={slide.data} />
                        )}
                    </div>
                ))}
            </div>

            {count > 1 && (
                <div
                    className="mt-3 flex w-full items-center justify-center gap-1.5"
                    role="tablist"
                    aria-label="Posición en el carrusel"
                >
                    {slides.map((slide, i) => (
                        <button
                            key={
                                slide.kind === 'order'
                                    ? `dot-order-${slide.data.id}`
                                    : `dot-reservation-${slide.data.id}`
                            }
                            type="button"
                            role="tab"
                            aria-selected={i === slideIndex}
                            tabIndex={i === slideIndex ? 0 : -1}
                            aria-label={`Elemento ${i + 1} de ${count}`}
                            className={cn(
                                'h-1.5 shrink-0 rounded-full transition-[width,background-color] duration-200 ease-out',
                                i === slideIndex
                                    ? 'w-5 bg-emerald-600'
                                    : 'w-1.5 bg-slate-300 hover:bg-slate-400',
                            )}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
