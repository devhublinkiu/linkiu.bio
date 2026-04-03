import HeaderTopBestSeller from './parts/HeaderTopBestSeller';
import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

export default function TopBestSeller({ className }: Props) {
    return (
        <section className={cn('w-full', className)} aria-labelledby="top-best-seller-heading">
            <HeaderTopBestSeller headingId="top-best-seller-heading" />
        </section>
    );
}

export { default as HeaderTopBestSeller } from './parts/HeaderTopBestSeller';
export { default as ItemProductTopBestSeller } from './parts/ItemProductTopBestSeller';
