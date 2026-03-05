import { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { ArrowLeft, ExternalLink, MessageCircle, Radio } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface SermonPublic {
    id: number;
    title: string;
    embed_url: string;
    watch_url: string;
    status: string;
    live_start_at: string | null;
    published_at: string | null;
    live_chat_id?: string | null;
}

interface ChatMessage {
    id: string | null;
    text: string;
    author: string;
    profile_image: string | null;
    published_at: string | null;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    sermon: SermonPublic;
}

function buildChatUrl(tenantSlug: string, sermonId: number, liveChatId: string, pageToken?: string | null): string {
    const base = route('tenant.public.sermons.chat', [tenantSlug, sermonId]);
    const params = new URLSearchParams({ live_chat_id: liveChatId });
  if (pageToken) params.set('pageToken', pageToken);
  return `${base}?${params.toString()}`;
}

export default function SermonShow({ tenant, sermon }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';
    const isLive = sermon.status === 'live';
    const liveChatId = sermon.live_chat_id ?? null;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const [pollingIntervalMs, setPollingIntervalMs] = useState(5000);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const nextPageTokenRef = useRef<string | null>(null);
    const pollingIntervalRef = useRef(5000);
    nextPageTokenRef.current = nextPageToken;
    pollingIntervalRef.current = pollingIntervalMs;

    useEffect(() => {
        if (!liveChatId || !tenant.slug) return;

        const poll = (pageToken?: string | null) => {
            const url = buildChatUrl(tenant.slug, sermon.id, liveChatId, pageToken);
            fetch(url, { headers: { Accept: 'application/json' } })
                .then((res) => res.json())
                .then((data: { messages: ChatMessage[]; nextPageToken: string | null; pollingIntervalMillis: number }) => {
                    if (Array.isArray(data.messages) && data.messages.length > 0) {
                        setMessages((prev) => {
                            const byId = new Map(prev.map((m) => [m.id, m]));
                            data.messages.forEach((m) => m.id && byId.set(m.id, m));
                            return Array.from(byId.values()).sort(
                                (a, b) =>
                                    new Date(a.published_at ?? 0).getTime() - new Date(b.published_at ?? 0).getTime()
                            );
                        });
                    }
                    setNextPageToken(data.nextPageToken ?? null);
                    setPollingIntervalMs(data.pollingIntervalMillis ?? 5000);
                })
                .catch(() => {});
        };

        poll(null);

        const schedule = () => {
            pollingRef.current = setTimeout(() => {
                poll(nextPageTokenRef.current);
                schedule();
            }, pollingIntervalRef.current);
        };
        schedule();

        return () => {
            if (pollingRef.current) clearTimeout(pollingRef.current);
        };
    }, [liveChatId, tenant.slug, sermon.id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`${sermon.title} - ${tenant.name}`} />

            <div className="flex flex-col">
                <Header
                    tenantName={tenant.name}
                    description={tenant.store_description}
                    logoUrl={tenant.logo_url}
                    bgColor={bg_color}
                    textColor={brandColors.name_color ?? '#ffffff'}
                    descriptionColor={brandColors.description_color}
                />
            </div>

            <div className="max-w-md mx-auto w-full flex-1 pb-20 px-4 pt-4">
                <Link
                    href={route('tenant.public.sermons', tenant.slug)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mb-4"
                >
                    <ArrowLeft className="size-4" />
                    Volver a predicas
                </Link>

                <div className="flex items-center gap-2 mb-3">
                    {isLive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                            <Radio className="size-3.5" />
                            EN VIVO
                        </span>
                    )}
                    <h1 className="text-lg font-bold text-slate-900 line-clamp-2">{sermon.title}</h1>
                </div>

                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                    <iframe
                        src={sermon.embed_url}
                        title={sermon.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>

                {liveChatId ? (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white">
                            <MessageCircle className="size-4 text-slate-600" />
                            <span className="text-sm font-semibold text-slate-800">Chat en vivo</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2 space-y-2">
                            {messages.length === 0 ? (
                                <p className="text-xs text-slate-500 py-4 text-center">Cargando mensajes...</p>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id ?? msg.published_at ?? msg.text} className="flex gap-2 text-sm">
                                        {msg.profile_image ? (
                                            <img
                                                src={msg.profile_image}
                                                alt=""
                                                className="w-7 h-7 rounded-full shrink-0 object-cover"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-slate-300 shrink-0 flex items-center justify-center text-xs text-slate-500 font-medium">
                                                {(msg.author || '?').slice(0, 1)}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <span className="font-medium text-slate-700">{msg.author}</span>
                                            <span className="text-slate-500 mx-1">·</span>
                                            <span className="text-slate-800 break-words">{msg.text}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>
                ) : (isLive || sermon.status === 'upcoming') ? (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-amber-50 px-3 py-3">
                        <p className="text-xs text-amber-800">
                            El chat en vivo no está disponible para esta transmisión. Comprueba en YouTube Studio que el chat esté activado para el directo.
                        </p>
                    </div>
                ) : null}

                <a
                    href={sermon.watch_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    <ExternalLink className="size-4" />
                    Ver en YouTube
                </a>
            </div>
        </PublicLayout>
    );
}
