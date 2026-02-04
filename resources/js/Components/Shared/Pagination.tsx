import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis
} from '@/Components/ui/pagination';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    className?: string;
}

export default function SharedPagination({ links, className = '' }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <Pagination className={className}>
            <PaginationContent>
                {links.map((link, key) => {
                    // Logic to identify Previous/Next
                    const isPrevious = link.label.includes('Previous') || link.label.includes('pagination.previous') || link.label.includes('&laquo;');
                    const isNext = link.label.includes('Next') || link.label.includes('pagination.next') || link.label.includes('&raquo;');
                    const isEllipsis = link.label === '...' || link.label.includes('...');

                    // Clean label
                    let label = link.label.replace('&laquo; ', '').replace(' &raquo;', '');
                    // Basic HTML entity decode if needed, or rely on render.
                    // React renders strings safely. If label has HTML entities like &amp;, they should be decoded or passed as HTML.
                    // For safety, let's assume labels are just strings or simple entities.

                    if (isEllipsis) {
                        return (
                            <PaginationItem key={key}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    if (isPrevious) {
                        return (
                            <PaginationItem key={key}>
                                <PaginationPrevious
                                    href={link.url || '#'}
                                    className={!link.url ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        );
                    }

                    if (isNext) {
                        return (
                            <PaginationItem key={key}>
                                <PaginationNext
                                    href={link.url || '#'}
                                    className={!link.url ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        );
                    }

                    // Standard Page Link
                    return (
                        <PaginationItem key={key}>
                            <PaginationLink
                                href={link.url || '#'}
                                isActive={link.active}
                                dangerouslySetInnerHTML={{ __html: link.label }} // Keep HTML rendering for consistency if labels carry formatting
                            />
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
