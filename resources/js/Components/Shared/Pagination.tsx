import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    className?: string;
}

export default function Pagination({ links, className = '' }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className={`flex flex-wrap gap-1 ${className}`}>
            {links.map((link, key) => {
                let label = link.label;
                let icon = null;

                // Handle Previous/Next with Icons
                if (label.includes('Previous') || label.includes('pagination.previous') || label.includes('&laquo;')) {
                    icon = <ChevronLeft className="h-4 w-4" />;
                    label = '';
                } else if (label.includes('Next') || label.includes('pagination.next') || label.includes('&raquo;')) {
                    icon = <ChevronRight className="h-4 w-4" />;
                    label = '';
                }

                return link.url === null ? (
                    <div
                        key={key}
                        className="flex items-center justify-center px-3 py-1.5 text-sm leading-4 text-gray-400 border rounded-md"
                    // dangerouslySetInnerHTML={{ __html: link.label }} // Fallback if regular text
                    >
                        {icon || <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                    </div>
                ) : (
                    <Link
                        key={key}
                        className={`flex items-center justify-center px-3 py-1.5 text-sm leading-4 border rounded-md focus:text-indigo-500 focus:border-indigo-500 hover:bg-white
                        ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        href={link.url}
                    >
                        {icon || <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                    </Link>
                );
            })}
        </div>
    );
}
