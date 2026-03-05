import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Tenant/Church/Public/PublicLayout';
import Header from '@/Components/Tenant/Church/Public/Header';
import { Users, ChevronRight } from 'lucide-react';

interface TenantBrandColors {
    bg_color?: string;
    name_color?: string;
    description_color?: string;
}

interface TeamCollaborator {
    id: number;
    name: string;
    role: string | null;
    photo: string | null;
    bio: string | null;
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
}

interface Props {
    tenant: {
        name: string;
        slug: string;
        logo_url?: string;
        store_description?: string;
        brand_colors?: TenantBrandColors;
    };
    collaborators: TeamCollaborator[];
}

function CollaboratorCard({
    tenantSlug,
    collaborator,
}: {
    tenantSlug: string;
    collaborator: TeamCollaborator;
}) {
    return (
        <Link
            href={route('tenant.public.team.show', [tenantSlug, collaborator.id])}
            className="block rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
        >
            <div className="p-5 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow mb-3">
                    {collaborator.photo ? (
                        <img
                            src={collaborator.photo}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Users className="size-10 text-slate-400" />
                        </div>
                    )}
                </div>
                <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                    {collaborator.name}
                </h3>
                {collaborator.role && (
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                        {collaborator.role}
                    </p>
                )}
                {collaborator.bio && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {collaborator.bio}
                    </p>
                )}
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3">
                    Ver perfil
                    <ChevronRight className="size-4" />
                </span>
            </div>
        </Link>
    );
}

export default function TeamIndex({ tenant, collaborators }: Props) {
    const brandColors = tenant.brand_colors ?? {};
    const bg_color = brandColors.bg_color ?? '#1e3a5f';

    return (
        <PublicLayout bgColor={bg_color}>
            <Head title={`Nuestro equipo - ${tenant.name}`} />

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

            <div className="max-w-md mx-auto px-4 w-full flex-1 pb-20 pt-8">
                <section aria-labelledby="equipo-heading">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <Users className="size-6 text-primary" />
                        </div>
                        <div>
                            <h1 id="equipo-heading" className="text-xl font-black tracking-tight">
                                Nuestro equipo
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {collaborators.length === 0
                                    ? 'Conoce a quienes nos sirven'
                                    : `${collaborators.length} ${collaborators.length === 1 ? 'colaborador' : 'colaboradores'}`
                                }
                            </p>
                        </div>
                    </div>

                    <div className="py-4">
                        {collaborators.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="bg-slate-100 rounded-full size-16 mx-auto mb-4 flex items-center justify-center">
                                    <Users className="size-8 text-slate-400" />
                                </div>
                                <p className="text-slate-600 font-medium">No hay colaboradores publicados</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Próximamente verás aquí a nuestro equipo
                                </p>
                            </div>
                        ) : (
                            <ul className="grid gap-4 list-none p-0 m-0 sm:grid-cols-2">
                                {collaborators.map((c) => (
                                    <li key={c.id}>
                                        <CollaboratorCard tenantSlug={tenant.slug} collaborator={c} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
