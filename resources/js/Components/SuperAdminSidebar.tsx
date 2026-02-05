"use client"

import * as React from "react"
import {
    BookOpen,
    Bot,
    LayoutGrid,
    Settings2,
    SquareTerminal,
    Users,
    Inbox,
    ShieldCheck,
    LifeBuoy
} from "lucide-react"
import { usePage } from "@inertiajs/react"

import { NavMain } from "@/Components/nav-main"
import { NavUser } from "@/Components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/Components/ui/sidebar"
import ApplicationLogo from "@/Components/ApplicationLogo"

export function SuperAdminSidebar({ user, logo, ...props }: React.ComponentProps<typeof Sidebar> & { user: any, logo?: { url: string | null, name: string } }) {
    const { url } = usePage()

    const navMain = React.useMemo(() => {
        return [
            {
                title: "Dashboard",
                url: "/superlinkiu/dashboard",
                icon: SquareTerminal,
                isActive: url.startsWith('/superlinkiu/dashboard'),
            },
            {
                title: "Tenants",
                url: "/superlinkiu/tenants",
                icon: Bot,
                isActive: url.startsWith('/superlinkiu/tenants'),
            },
            {
                title: "Usuarios",
                url: "/superlinkiu/users",
                icon: Users,
                isActive: url.startsWith('/superlinkiu/users'),
            },
            {
                title: "Facturación",
                url: "#",
                icon: BookOpen,
                isActive: url.startsWith('/superlinkiu/plans') || url.startsWith('/superlinkiu/subscriptions') || url.startsWith('/superlinkiu/payments'),
                items: [
                    {
                        title: "Planes",
                        url: "/superlinkiu/plans",
                    },
                    {
                        title: "Suscripciones",
                        url: "/superlinkiu/subscriptions",
                    },
                    {
                        title: "Pagos",
                        url: "/superlinkiu/payments",
                    },
                ],
            },
            {
                title: "Contenido",
                url: "#",
                icon: LayoutGrid,
                isActive: url.startsWith('/superlinkiu/category-icons') || url.startsWith('/superlinkiu/support') || url.startsWith('/superlinkiu/media'),
                items: [
                    {
                        title: "Categorías e Iconos",
                        url: "/superlinkiu/category-icons",
                    },
                    {
                        title: "Solicitudes",
                        url: "/superlinkiu/support/requests",
                    },
                    {
                        title: "Mis archivos",
                        url: "/superlinkiu/media",
                    },

                ],
            },
            {
                title: "Atención",
                url: "#",
                icon: LifeBuoy,
                isActive: url.startsWith('/superlinkiu/support'),
                items: [
                    {
                        title: "Tickets de Soporte",
                        url: "/superlinkiu/support",
                    },
                ],
            },
            {
                title: "Configuración",
                url: "#",
                icon: Settings2,
                isActive: url.startsWith('/superlinkiu/roles'),
                items: [
                    {
                        title: "Roles y Permisos",
                        url: "/superlinkiu/roles",
                    },
                ],
            },
        ]
    }, [url])

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="group-data-[state=expanded]:bg-transparent group-data-[state=expanded]:hover:bg-transparent ring-0 group-data-[state=expanded]:h-14 group-data-[state=expanded]:p-4 group-data-[state=expanded]:pl-8">
                            <a href="/superlinkiu/dashboard">
                                {/* Collapsed: Show standardized Icon */}
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground group-data-[state=expanded]:hidden">
                                    <ApplicationLogo className="size-6" />
                                </div>

                                {/* Expanded: Show Legacy Logo Image */}
                                <div className="hidden group-data-[state=expanded]:block">
                                    {logo?.url ? (
                                        <img
                                            src={logo.url}
                                            alt={logo.name || 'Logo'}
                                            className="h-8 w-auto object-contain max-w-[200px]"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-sidebar-foreground">
                                            <div className="h-8 w-8 flex items-center justify-center bg-primary p-1.5 rounded-lg">
                                                <ApplicationLogo className="size-5 text-primary-foreground" />
                                            </div>
                                            <span>{logo?.name || 'Linkiu.bio'}</span>
                                        </div>
                                    )}
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: user.name,
                    email: user.email,
                    avatar: user.profile_photo_url || `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`
                }} />
            </SidebarFooter>
        </Sidebar>
    )
}
